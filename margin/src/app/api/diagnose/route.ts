import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreWriting, buildDiagnosis } from "@/lib/scoring";
import { selectFocusTrait, dominantTag } from "@/lib/studentModel";
import { misconceptionsFor } from "@/lib/taxonomy";
import { newStudent } from "@/lib/studentModel";
import type { StudentModel, TraitScore } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  text: z.string().min(1),
  textType: z.enum(["persuasive", "narrative"]),
  taskId: z.string(),
  /** The caller's current student model (client-owned). Optional on first run. */
  model: z.any().optional(),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }

  const wordCount = body.text.trim().split(/\s+/).filter(Boolean).length;
  const { scores, engine } = await scoreWriting(body.text, body.textType);

  // Provisional model = caller's model with these scores' tags folded in, so
  // focus selection reflects this piece too.
  const model: StudentModel =
    (body.model as StudentModel) || newStudent("anon", "Student");

  const { trait } = selectFocusTrait(
    foldTagsIntoModel(model, scores),
    body.textType
  );

  // Choose the misconception within the focus trait: prefer one observed on
  // THIS piece, else the student's dominant historical tag, else canonical.
  const observedTagForFocus =
    scores.find((s) => s.trait === trait)?.tags?.[0] ??
    dominantTag(model.traits[trait], misconceptionsFor(trait)[0]?.id ?? "");

  const diagnosis = buildDiagnosis(
    scores,
    { trait, tag: observedTagForFocus },
    wordCount
  );

  return NextResponse.json({ diagnosis, engine });
}

/** Non-mutating: returns a shallow clone with this piece's tags counted, used
 * only to inform focus selection for the current request. */
function foldTagsIntoModel(model: StudentModel, scores: TraitScore[]): StudentModel {
  const traits = { ...model.traits };
  for (const s of scores) {
    const st = traits[s.trait];
    if (!st) continue;
    const tagCounts = { ...st.tagCounts };
    for (const tag of s.tags) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    traits[s.trait] = { ...st, tagCounts };
  }
  return { ...model, traits };
}
