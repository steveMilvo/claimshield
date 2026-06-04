// Company-policy KB — the org-private second layer (docs/er-advisor-spec.md, the
// two-tier KB: legislation = the floor, company policy = what the org promised).
//
// Phase 0 scope: policies are pasted/added by the HR team and held client-side
// (localStorage), then sent with each request. The server chunks and retrieves
// over them per-request alongside the legislation KB — nothing org-private is
// persisted server-side yet (auth + per-tenant isolation is a Phase 1 item).
//
// The point of this layer: a manager can satisfy the legislative floor yet still
// breach the company's own policy (e.g. "two written warnings before dismissal"
// when the Act requires none). Surfacing that gap is a core differentiator.

import { queryTerms, scoreWords, wordsOf } from "./kb";

/** A policy document as supplied by the HR team. */
export type PolicyDoc = {
  title: string; // e.g. "Disciplinary Procedure"
  text: string; // pasted policy body
  addedAt?: string; // ISO date the org added/updated it
};

export type PolicyChunk = {
  id: string;
  docTitle: string;
  /** Citation shown to the user, e.g. "Disciplinary Procedure, cl 3.4.5". */
  citationLabel: string;
  text: string;
  version: string; // the doc's addedAt, or "company policy"
};

/** Detect a leading clause/section number on the first line of a block. */
function leadingClause(block: string): string | null {
  const first = block.split("\n")[0].trim();
  const m =
    /^(\d+(?:\.\d+)*)/.exec(first) ??
    /^(?:clause|cl\.?|section|sec\.?|s\.?|policy)\s+([\w.]+)/i.exec(first);
  return m ? m[1] : null;
}

/**
 * Split a pasted policy into chunks on blank lines. Each non-trivial block
 * becomes a chunk; a detected clause number is folded into its citation label.
 */
export function chunkPolicy(doc: PolicyDoc): PolicyChunk[] {
  const version = doc.addedAt ?? "company policy";
  const blocks = doc.text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  // Fall back to the whole doc as one chunk if there are no blank-line breaks.
  const effective = blocks.length > 0 ? blocks : [doc.text.trim()];

  return effective
    .filter((b) => b.length >= 12) // skip stray fragments
    .map((block, i) => {
      const clause = leadingClause(block);
      const citationLabel = clause
        ? `${doc.title}, cl ${clause}`
        : `${doc.title}${effective.length > 1 ? ` (part ${i + 1})` : ""}`;
      return {
        id: `policy-${slug(doc.title)}-${i}`,
        docTitle: doc.title,
        citationLabel,
        text: block,
        version,
      };
    });
}

export function chunkPolicies(docs: PolicyDoc[]): PolicyChunk[] {
  return docs.flatMap((d) => chunkPolicy(d));
}

/** Keyword retrieval over policy chunks (same scorer as the legislation KB). */
export function retrievePolicy(
  query: string,
  chunks: PolicyChunk[],
  k = 4,
): PolicyChunk[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];
  return chunks
    .map((chunk) => ({
      chunk,
      score: scoreWords(terms, wordsOf(`${chunk.docTitle} ${chunk.text}`)),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.chunk);
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
