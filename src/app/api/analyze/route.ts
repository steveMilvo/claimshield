import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import {
  ALL_JURISDICTIONS,
  isJurisdiction,
  jurisdictionConfig,
  type Jurisdiction,
} from "@/lib/jurisdiction";

export const runtime = "nodejs";
export const maxDuration = 300;

const FindingSchema = z.object({
  kind: z.enum(["exclusion", "regulation", "valuation", "procedure"]),
  title: z.string(),
  detail: z.string(),
  citation: z.string().nullable(),
});

const AnalysisSchema = z.object({
  jurisdiction: z.enum(ALL_JURISDICTIONS as [Jurisdiction, ...Jurisdiction[]]),
  insurer: z.string(),
  policyType: z.string(),
  policyNumber: z.string(),
  lossDescription: z.string(),
  insurerOffer: z.number(),
  estimatedFairValue: z.number(),
  upside: z.number(),
  score: z.number(),
  scoreLabel: z.enum(["Strong", "Moderate", "Weak"]),
  findings: z.array(FindingSchema),
  comparables: z.array(
    z.object({
      reference: z.string(),
      insurer: z.string(),
      settlement: z.string(),
      note: z.string(),
    }),
  ),
  generatedDocs: z.array(
    z.object({
      name: z.string(),
      kind: z.enum(["appeal", "demand", "complaint"]),
    }),
  ),
  nextSteps: z.array(
    z.object({ title: z.string(), detail: z.string(), due: z.string() }),
  ),
  appealLetter: z.string(),
  demandLetter: z.string(),
  complaintText: z.string(),
});

const SYSTEM_PROMPT_BASE = `You are ClaimShield, an AI insurance-claim analyst working on behalf of policyholders. You read insurance policies and insurer denial / settlement letters, identify where the insurer has misapplied exclusions or breached its regulatory obligations, value the loss against comparable claims, and draft the documents the policyholder needs to fight back.

You are an information and document-preparation tool. You are not a law firm and you do not give legal advice. Frame findings as "your policy says X" and "here is a template letter", never "you must do X".

When you receive a claim, produce a single structured analysis with these fields:
- jurisdiction: the jurisdiction code given to you for this claim. Set it exactly as instructed below — do not change it.
- insurer, policyType, policyNumber: extracted from the documents (use "Not stated" if genuinely absent).
- lossDescription: a one or two sentence neutral summary of the loss and the insurer's stated reasoning.
- insurerOffer: the dollar amount the insurer offered or paid (number, AUD). Use 0 if the claim was denied outright with no offer.
- estimatedFairValue: your best estimate of the fair settlement (number, AUD), grounded in any estimates/quotes provided and typical Australian outcomes.
- upside: estimatedFairValue minus insurerOffer (never negative; use 0 if there is no recoverable upside).
- score: an integer 0-100 — the ClaimShield Score — reflecting strength of the policyholder's position (policy fit, regulatory leverage, valuation gap, comparable outcomes).
- scoreLabel: "Strong" (score >= 70), "Moderate" (40-69), or "Weak" (< 40).
- findings: 2-5 items. kind is "exclusion" (a clause/exclusion the insurer is misapplying), "regulation" (a regulatory obligation engaged — GICOP, ASIC RG 271, etc.), "valuation" (under-valuation evidence), or "procedure" (dispute-process timing/leverage). title is a short headline; detail is 1-3 sentences; citation is the specific clause/regulation reference or null.
- comparables: 2-4 plausible comparable Australian claims, each with a reference code (e.g. "AU-MTR-08172"), insurer name, settlement amount (string like "$7,150"), and a short note. These are illustrative, derived from typical patterns — keep them realistic.
- generatedDocs: the documents you have prepared — typically an appeal letter (kind "appeal"), a settlement demand (kind "demand"), and an AFCA complaint (kind "complaint"). Give each a descriptive name.
- nextSteps: 2-4 concrete next moves, each with a title, a detail line, and a due window (e.g. "Within 2 days", "Day 30").
- appealLetter: a complete, ready-to-send appeal / internal-dispute-resolution letter addressed to the insurer. Cite the specific policy provisions and regulations from your findings. Use [Your Name] / [Date] placeholders. Professional but firm. ~250-400 words.
- demandLetter: a "without prejudice" settlement demand letter — rejects the current offer, states the fair settlement figure, gives a deadline (e.g. 10 business days), and flags escalation to AFCA. Use [Your Name] / [Date] placeholders. ~150-250 words.
- complaintText: a pre-formatted complaint to the external dispute body for this jurisdiction (see the JURISDICTION block below). Structure it with clear sections — complainant details, what happened, why I am complaining (numbered), what I want, steps already taken, documents attached — using bracketed placeholders for anything not in the documents.

The three documents should reference the same facts, figures and provisions you used in findings. Keep them consistent with each other.

If the documents are too thin to analyse confidently, still produce the structure: make conservative estimates, set a lower score, and say so plainly in lossDescription and findings.`;

function jurisdictionPromptFor(j: Jurisdiction): string {
  const cfg = jurisdictionConfig(j);
  return (
    `=== JURISDICTION ===\n` +
    `Set analysis.jurisdiction to "${cfg.code}" (${cfg.name}).\n` +
    `External dispute body for the complaint: ${cfg.complaintBody}.\n` +
    `Regulatory guidance: ${cfg.promptNotes}`
  );
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;

async function fileToBlocks(
  file: File,
  label: string,
): Promise<Anthropic.ContentBlockParam[]> {
  const buf = Buffer.from(await file.arrayBuffer());
  const labelBlock: Anthropic.ContentBlockParam = {
    type: "text",
    text: `--- ${label}: ${file.name} ---`,
  };
  if (file.type === "application/pdf") {
    return [
      labelBlock,
      {
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: buf.toString("base64") },
      },
    ];
  }
  if ((ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return [
      labelBlock,
      {
        type: "image",
        source: {
          type: "base64",
          media_type: file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
          data: buf.toString("base64"),
        },
      },
    ];
  }
  // Fall back to treating it as text (txt, eml, etc.)
  return [labelBlock, { type: "text", text: buf.toString("utf-8").slice(0, 200_000) }];
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const policy = form.get("policy");
  const letter = form.get("letter");
  const category = String(form.get("category") ?? "auto");
  const insurer = String(form.get("insurer") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const offerAmount = String(form.get("offerAmount") ?? "").trim();
  const estimateAmount = String(form.get("estimateAmount") ?? "").trim();
  const rawJurisdiction = String(form.get("jurisdiction") ?? "AU");
  const jurisdiction: Jurisdiction = isJurisdiction(rawJurisdiction)
    ? rawJurisdiction
    : "AU";
  const cfg = jurisdictionConfig(jurisdiction);

  const policyFile = policy instanceof File && policy.size > 0 ? policy : null;
  const letterFile = letter instanceof File && letter.size > 0 ? letter : null;

  if (!policyFile && !letterFile && !description) {
    return NextResponse.json(
      { error: "Provide at least a policy document, an insurer letter, or a description of the loss." },
      { status: 400 },
    );
  }

  const content: Anthropic.ContentBlockParam[] = [
    {
      type: "text",
      text:
        `Claim intake form\n` +
        `- Jurisdiction: ${cfg.name} (${cfg.code})\n` +
        `- Insurance category: ${category}\n` +
        `- Insurer: ${insurer || "(not provided)"}\n` +
        `- Loss description: ${description || "(not provided)"}\n` +
        `- Settlement offered (${cfg.currency}): ${offerAmount || "(not provided)"}\n` +
        `- Independent estimate / actual cost (${cfg.currency}): ${estimateAmount || "(not provided)"}`,
    },
  ];

  if (policyFile) content.push(...(await fileToBlocks(policyFile, "INSURANCE POLICY")));
  if (letterFile) content.push(...(await fileToBlocks(letterFile, "INSURER DENIAL / SETTLEMENT LETTER")));

  content.push({
    type: "text",
    text: "Analyse this insurance claim and return the structured ClaimShield analysis.",
  });

  const client = new Anthropic({ apiKey });

  let message;
  try {
    message = await client.messages.parse({
      model: "claude-opus-4-7",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "high",
        format: zodOutputFormat(AnalysisSchema),
      },
      system: [
        { type: "text", text: SYSTEM_PROMPT_BASE, cache_control: { type: "ephemeral" } },
        { type: "text", text: jurisdictionPromptFor(jurisdiction) },
      ],
      messages: [{ role: "user", content }],
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error (${err.status ?? "unknown"}): ${err.message}` },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: "Analysis request failed." }, { status: 500 });
  }

  const analysis = message.parsed_output;
  if (!analysis) {
    return NextResponse.json(
      { error: "The analysis could not be completed — the model returned no structured result." },
      { status: 502 },
    );
  }

  return NextResponse.json({ analysis });
}
