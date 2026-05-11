// LegisPro document-generation client.
//
// LegisPro is the document-generation engine in the SynthexIQ ecosystem
// (see the ClaimShield positioning brief): ClaimShield sends structured data,
// LegisPro returns formatted, jurisdiction-correct documents.
//
// === ASSUMED API CONTRACT — adjust once the real LegisPro spec is available ===
//   POST {LEGISPRO_BASE_URL}/v1/documents
//   Headers:
//     Authorization: Bearer {LEGISPRO_API_KEY}
//     Content-Type: application/json
//   Body:
//     { documentType: string, jurisdiction: string, title: string, data: Record<string, unknown> }
//   Response — any of:
//     - a binary body (Content-Type officedocument / pdf / octet-stream)
//     - JSON { filename?: string, contentBase64: string }
//     - JSON { url: string }                       (a downloadable document)
//     - JSON { format?: string, content: string }  (html / markdown / plain text)
//
// Required env to enable: LEGISPRO_BASE_URL, LEGISPRO_API_KEY
// When either is missing — or any call fails — callers fall back to the local
// .docx generator in /api/document.

export type LegisProDocKind = "appeal" | "demand" | "complaint";

export type LegisProResult =
  | { kind: "binary"; bytes: Uint8Array; filename: string; contentType: string }
  | { kind: "text"; text: string };

const DOC_TYPE_MAP: Record<LegisProDocKind, string> = {
  appeal: "insurance_appeal_letter",
  demand: "insurance_demand_letter",
  complaint: "afca_complaint",
};

const DOCX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function isLegisProConfigured(): boolean {
  return Boolean(process.env.LEGISPRO_BASE_URL && process.env.LEGISPRO_API_KEY);
}

function filenameFromResponse(res: Response, fallbackTitle: string): string {
  const cd = res.headers.get("content-disposition") ?? "";
  const m = /filename\*?=(?:UTF-8''|")?([^";]+)"?/i.exec(cd);
  return m?.[1] ? decodeURIComponent(m[1]) : `${fallbackTitle}.docx`;
}

export async function generateWithLegisPro(opts: {
  kind: LegisProDocKind;
  title: string;
  data: Record<string, unknown>;
  jurisdiction?: string;
}): Promise<LegisProResult | null> {
  const base = process.env.LEGISPRO_BASE_URL;
  const key = process.env.LEGISPRO_API_KEY;
  if (!base || !key) return null;

  let res: Response;
  try {
    res = await fetch(`${base.replace(/\/+$/, "")}/v1/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentType: DOC_TYPE_MAP[opts.kind],
        jurisdiction: opts.jurisdiction ?? "AU",
        title: opts.title,
        data: opts.data,
      }),
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();

  // Binary document streamed directly.
  if (
    contentType.includes("officedocument") ||
    contentType.includes("application/pdf") ||
    contentType.includes("application/octet-stream")
  ) {
    const bytes = new Uint8Array(await res.arrayBuffer());
    return {
      kind: "binary",
      bytes,
      filename: filenameFromResponse(res, opts.title),
      contentType: contentType || DOCX_CONTENT_TYPE,
    };
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  if (typeof p.contentBase64 === "string") {
    return {
      kind: "binary",
      bytes: Uint8Array.from(Buffer.from(p.contentBase64, "base64")),
      filename: typeof p.filename === "string" ? p.filename : `${opts.title}.docx`,
      contentType: DOCX_CONTENT_TYPE,
    };
  }

  if (typeof p.url === "string") {
    try {
      const f = await fetch(p.url);
      if (f.ok) {
        return {
          kind: "binary",
          bytes: new Uint8Array(await f.arrayBuffer()),
          filename: filenameFromResponse(f, opts.title),
          contentType: (f.headers.get("content-type") ?? DOCX_CONTENT_TYPE).toLowerCase(),
        };
      }
    } catch {
      /* fall through to null */
    }
    return null;
  }

  if (typeof p.content === "string") {
    return { kind: "text", text: p.content };
  }

  return null;
}
