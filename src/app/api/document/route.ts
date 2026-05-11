import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export const runtime = "nodejs";

function sanitizeFilename(name: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9 _.-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 80);
  return cleaned || "ClaimShield_document";
}

export async function POST(req: NextRequest) {
  let payload: { title?: unknown; body?: unknown };
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

  if (!body.trim()) {
    return NextResponse.json({ error: "The document body is empty." }, { status: 400 });
  }

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
  const bytes = new Uint8Array(buffer);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${sanitizeFilename(title)}.docx"`,
      "Content-Length": String(bytes.byteLength),
    },
  });
}
