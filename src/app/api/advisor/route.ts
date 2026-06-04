import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { KB_VERSION_DATE, retrieve } from "@/lib/advisor/kb";
import {
  chunkPolicies,
  retrievePolicy,
  type PolicyChunk,
} from "@/lib/advisor/policyKb";
import {
  ADVISOR_SYSTEM_PROMPT,
  VERIFIER_SYSTEM_PROMPT,
  jurisdictionNote,
  renderSources,
  type PromptSource,
} from "@/lib/advisor/prompts";
import type { AdvisorySource, VerifiedClaim } from "@/lib/advisor/types";

/** A unified record for every source available this turn, keyed by citation. */
type SourceRecord = {
  citationLabel: string;
  title: string;
  text: string;
  url: string | null;
  version: string;
  kind: "legislation" | "company";
};

export const runtime = "nodejs";
export const maxDuration = 300;

const MODEL = "claude-opus-4-7";

const FactsSchema = z.object({
  employeeType: z.enum([
    "permanent",
    "casual",
    "fixed-term",
    "contractor",
    "unknown",
  ]),
  award: z.string().nullable(),
  tenureMonths: z.number().nullable(),
  smallBusiness: z.boolean().nullable(),
  issue: z.enum([
    "conduct",
    "capacity",
    "redundancy",
    "leave",
    "flexible-work",
    "general",
    "unknown",
  ]),
});

const ClaimSchema = z.object({
  claim: z.string(),
  citationLabel: z.string().nullable(),
});

const TurnSchema = z.object({
  mode: z.enum(["clarify", "advise"]),
  reply: z.string(),
  questions: z.array(z.string()),
  facts: FactsSchema,
  summary: z.string(),
  claims: z.array(ClaimSchema),
  nextSteps: z.array(z.object({ title: z.string(), detail: z.string() })),
  riskFlags: z.array(
    z.object({
      level: z.enum(["low", "medium", "high"]),
      detail: z.string(),
    }),
  ),
});

const VerificationSchema = z.object({
  results: z.array(
    z.object({
      supported: z.enum(["supported", "partial", "unsupported"]),
      sourceQuote: z.string().nullable(),
      note: z.string().nullable(),
    }),
  ),
});

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
  // The org's own policy documents (the private second KB layer). Optional.
  policies: z
    .array(
      z.object({
        title: z.string(),
        text: z.string(),
        addedAt: z.string().optional(),
      }),
    )
    .optional(),
});

function transcript(messages: { role: string; content: string }[]): string {
  return messages
    .map((m) => `${m.role === "user" ? "MANAGER" : "ER ADVISOR"}: ${m.content}`)
    .join("\n\n");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let parsedBody;
  try {
    parsedBody = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Expected { messages: [{ role, content }] }." },
      { status: 400 },
    );
  }
  const { messages, policies } = parsedBody;

  // Retrieve against everything the manager has said so far.
  const query = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");

  // Layer 1: legislation. Layer 2: the org's own policies (if supplied).
  const retrieved = retrieve(query, 8);
  const policyChunks: PolicyChunk[] = policies?.length
    ? retrievePolicy(query, chunkPolicies(policies), 4)
    : [];

  // Unified index of every source available this turn, keyed by citation label.
  // Used to render the prompt, ground the verifier, and build the source list.
  const sourceIndex = new Map<string, SourceRecord>();
  for (const c of retrieved) {
    sourceIndex.set(c.citationLabel, {
      citationLabel: c.citationLabel,
      title: c.heading,
      text: c.text,
      url: c.url,
      version: c.version,
      kind: "legislation",
    });
  }
  for (const p of policyChunks) {
    sourceIndex.set(p.citationLabel, {
      citationLabel: p.citationLabel,
      title: p.docTitle,
      text: p.text,
      url: null,
      version: p.version,
      kind: "company",
    });
  }

  const promptSources: PromptSource[] = [
    ...retrieved.map((c) => ({
      citationLabel: c.citationLabel,
      heading: c.heading,
      text: c.text,
      kind: "LEGISLATION" as const,
    })),
    ...policyChunks.map((p) => ({
      citationLabel: p.citationLabel,
      heading: p.docTitle,
      text: p.text,
      kind: "COMPANY POLICY" as const,
    })),
  ];

  const client = new Anthropic({ apiKey });

  // --- 1. Triage + generate -------------------------------------------------
  let turn;
  try {
    const msg = await client.messages.parse({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: zodOutputFormat(TurnSchema) },
      system: [
        {
          type: "text",
          text: ADVISOR_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
        { type: "text", text: jurisdictionNote("AU") },
      ],
      messages: [
        {
          role: "user",
          content:
            `Conversation so far:\n\n${transcript(messages)}\n\n` +
            `${renderSources(promptSources)}\n\n` +
            `Decide whether you can advise yet. If not, set mode "clarify" and ask up to 3 clarifying questions. ` +
            `If you can, set mode "advise" and ground every claim's citationLabel in the SOURCES above.`,
        },
      ],
    });
    turn = msg.parsed_output;
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error (${err.status ?? "unknown"}): ${err.message}` },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: "Advisor request failed." }, { status: 500 });
  }

  if (!turn) {
    return NextResponse.json(
      { error: "The advisor returned no structured result." },
      { status: 502 },
    );
  }

  if (turn.mode === "clarify") {
    return NextResponse.json({
      mode: "clarify",
      reply: turn.reply,
      questions: turn.questions,
      facts: turn.facts,
    });
  }

  // --- 2. Verify ------------------------------------------------------------
  // For each claim, pull the exact text of the source it cited (legislation OR
  // company policy) and have the verifier judge it strictly against that text.
  // A citation that matches no available source is a fabricated cite.
  const claimSources: (SourceRecord | null)[] = turn.claims.map((c) =>
    c.citationLabel ? sourceIndex.get(c.citationLabel) ?? null : null,
  );

  let verified: VerifiedClaim[] = [];
  if (turn.claims.length > 0) {
    const verifyInput = turn.claims
      .map((c, i) => {
        const src = claimSources[i];
        const srcText = src
          ? `SOURCE (${src.citationLabel}): ${src.text}`
          : c.citationLabel
            ? `SOURCE: (no provision in the knowledge base matches the citation "${c.citationLabel}")`
            : `SOURCE: (no citation was provided for this claim)`;
        return `CLAIM ${i + 1}: ${c.claim}\n${srcText}`;
      })
      .join("\n\n");

    try {
      const vmsg = await client.messages.parse({
        model: MODEL,
        max_tokens: 4000,
        output_config: {
          effort: "low",
          format: zodOutputFormat(VerificationSchema),
        },
        system: [
          {
            type: "text",
            text: VERIFIER_SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content:
              `Judge each claim strictly against its SOURCE text. Return one result per claim, in order.\n\n${verifyInput}`,
          },
        ],
      });
      const results = vmsg.parsed_output?.results ?? [];
      verified = turn.claims.map((c, i) => {
        const r = results[i];
        // No matching source = fabricated/uncited → force unsupported.
        const hasSource = Boolean(claimSources[i]);
        const supported = !hasSource
          ? ("unsupported" as const)
          : (r?.supported ?? "unsupported");
        return {
          claim: c.claim,
          citationLabel: c.citationLabel,
          supported,
          sourceQuote: r?.sourceQuote ?? null,
          note: r?.note ?? (hasSource ? null : "Citation did not match any source provision."),
        };
      });
    } catch {
      // If verification fails, fail safe: present nothing as grounded.
      verified = turn.claims.map((c) => ({
        claim: c.claim,
        citationLabel: c.citationLabel,
        supported: "unsupported" as const,
        sourceQuote: null,
        note: "Verification pass unavailable; claim could not be confirmed.",
      }));
    }
  }

  // Rendering rule (spec §5.4): show supported + partial; strip unsupported.
  const shownClaims = verified.filter((c) => c.supported !== "unsupported");
  const droppedCount = verified.length - shownClaims.length;

  // Sources = the distinct sources (both layers) actually backing shown claims.
  const sourceMap = new Map<string, AdvisorySource>();
  for (const c of shownClaims) {
    if (!c.citationLabel) continue;
    const src = sourceIndex.get(c.citationLabel);
    if (src && !sourceMap.has(src.citationLabel)) {
      sourceMap.set(src.citationLabel, {
        citationLabel: src.citationLabel,
        title: src.title,
        url: src.url,
        version: src.version,
        kind: src.kind,
      });
    }
  }

  return NextResponse.json({
    mode: "advise",
    reply: turn.reply,
    facts: turn.facts,
    answer: {
      summary: turn.summary,
      claims: shownClaims,
      droppedCount,
      nextSteps: turn.nextSteps,
      riskFlags: turn.riskFlags,
      asAtDate: KB_VERSION_DATE,
      sources: Array.from(sourceMap.values()),
    },
  });
}
