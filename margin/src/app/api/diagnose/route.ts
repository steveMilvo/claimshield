import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreWriting, buildDiagnosis } from "@/lib/scoring";
import {
  selectFocusTrait,
  dominantTag,
  applyDiagnosis,
} from "@/lib/studentModel";
import { misconceptionsFor } from "@/lib/taxonomy";
import type { StudentModel, TraitScore } from "@/lib/types";
import { getSessionOrDefault } from "@/lib/server/identity";
import { getStudent, saveStudent, addAlert } from "@/lib/server/store";
import { evaluateSafeguarding, crisisResources } from "@/lib/safeguarding";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  text: z.string().min(1),
  textType: z.enum(["persuasive", "narrative"]),
  taskId: z.string(),
  /** Optional override; defaults to the signed-in student. */
  studentId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }

  const session = getSessionOrDefault();
  const studentId = body.studentId || session.id;
  const stored = getStudent(studentId);

  // Safeguarding triage runs BEFORE scoring. A writing tool receives
  // disclosures of harm; the AI must never counsel or engage with one.
  const sg = await evaluateSafeguarding(body.text);

  if (sg.severity === "urgent") {
    // Raise to the teacher/DSL and suppress normal feedback. We deliberately
    // do NOT score or "grade" a disclosure, and do not update the model.
    addAlert({
      studentId: stored.studentId,
      studentName: stored.displayName,
      classId: stored.classId,
      category: sg.category ?? "other",
      severity: "urgent",
      span: sg.span ?? "",
      rationale: sg.rationale,
      taskId: body.taskId,
    });
    return NextResponse.json({
      suppressed: true,
      safeguarding: { severity: sg.severity, category: sg.category },
      support: crisisResources(),
    });
  }

  // Lower-level concern: a trusted adult is notified, but the student still
  // gets their writing feedback (silently, so they are not singled out).
  if (sg.severity === "concern") {
    addAlert({
      studentId: stored.studentId,
      studentName: stored.displayName,
      classId: stored.classId,
      category: sg.category ?? "other",
      severity: "concern",
      span: sg.span ?? "",
      rationale: sg.rationale,
      taskId: body.taskId,
    });
  }

  const wordCount = body.text.trim().split(/\s+/).filter(Boolean).length;
  const { scores, engine } = await scoreWriting(body.text, body.textType);

  const { trait } = selectFocusTrait(foldTags(stored, scores), body.textType);
  const observedTagForFocus =
    scores.find((s) => s.trait === trait)?.tags?.[0] ??
    dominantTag(stored.traits[trait], misconceptionsFor(trait)[0]?.id ?? "");

  const diagnosis = buildDiagnosis(scores, { trait, tag: observedTagForFocus }, wordCount);

  // Cold-write rule (server-authoritative): the first attempt at a given task
  // is a cold write and can count toward transfer-based mastery; subsequent
  // re-checks of the same task are revisions and cannot grant mastery.
  const cold = !stored.pieces.some((p) => p.taskId === body.taskId);

  const updated = applyDiagnosis(stored, diagnosis, {
    taskId: body.taskId,
    textType: body.textType,
    cold,
    t: Date.now(),
  });
  const savedStudent = saveStudent(updated, stored.classId);

  return NextResponse.json({ diagnosis, engine, cold, student: savedStudent });
}

function foldTags(model: StudentModel, scores: TraitScore[]): StudentModel {
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
