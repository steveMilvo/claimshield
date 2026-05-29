import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import {
  generateWithLegisPro,
  isLegisProConfigured,
  type LegisProDocKind,
} from "@/lib/legispro";
import { isJurisdiction, type Jurisdiction } from "@/lib/jurisdiction";

export const runtime = "nodejs";

const DOCX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const VALID_KINDS = new Set(["appeal", "demand", "complaint"]);

function sanitizeFilename(name: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9 _.-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 80);
  return cleaned || "ClaimShield_document";
}

async function textToDocxBytes(title: string, body: string): Promise<Uint8Array> {
  const children: Paragraph[] = [
    new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({}),
  ];
  for (const line of body.replace(/\r\n/g, "\n").split("\n")) {
    children.push(new Paragraph({ children: [new TextRun(line)] }));
  }
  children.push(new Paragraph({}));
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Prepared with ClaimShield (MilvoTech Pty Ltd). This document is a template provided for information and document-preparation purposes and is not legal advice. Replace any [bracketed] placeholders before sending.",
          italics: true,
          size: 18,
        }),
      ],
    }),
  );
  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}

function docResponse(
  bytes: Uint8Array,
  filename: string,
  contentType: string,
  source: "legispro" | "local",
) {
  const blob = new Blob([bytes as BlobPart], { type: contentType });
  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(blob.size),
      "X-Doc-Source": source,
    },
  });
}

export async function POST(req: NextRequest) {
  let payload: { title?: unknown; body?: unknown; kind?: unknown; jurisdiction?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const title =
    typeof payload.title === "string" && payload.title.trim()
      ? payload.title.trim()
      : "ClaimShield document";
  const body = typeof payload.body === "string" ? payload.body : "";
  const kind =
    typeof payload.kind === "string" && VALID_KINDS.has(payload.kind)
      ? (payload.kind as LegisProDocKind)
      : null;
  const jurisdiction: Jurisdiction = isJurisdiction(payload.jurisdiction)
    ? payload.jurisdiction
    : "AU";

  if (!body.trim()) {
    return NextResponse.json({ error: "The document body is empty." }, { status: 400 });
  }

  // Prefer LegisPro (the SynthexIQ document-generation engine) when configured.
  if (kind && isLegisProConfigured()) {
    try {
      const result = await generateWithLegisPro({
        kind,
        title,
        data: { title, body },
        jurisdiction,
      });
      if (result?.kind === "binary") {
        return docResponse(
          result.bytes,
          sanitizeFilename(result.filename.replace(/\.docx$/i, "")) + ".docx",
          result.contentType || DOCX_CONTENT_TYPE,
          "legispro",
        );
      }
      if (result?.kind === "text") {
        const bytes = await textToDocxBytes(title, result.text);
        return docResponse(bytes, sanitizeFilename(title) + ".docx", DOCX_CONTENT_TYPE, "legispro");
      }
      // result === null → fall through to the local generator
    } catch {
      // fall through to the local generator
    }
  }

  const bytes = await textToDocxBytes(title, body);
  return docResponse(bytes, sanitizeFilename(title) + ".docx", DOCX_CONTENT_TYPE, "local");
}
