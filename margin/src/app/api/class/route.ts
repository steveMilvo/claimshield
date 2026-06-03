import { NextResponse } from "next/server";
import { getSessionOrDefault } from "@/lib/server/identity";
import { getClass, listClassStudents } from "@/lib/server/store";

export const runtime = "nodejs";

/** Class roster + every student's live model, for the teacher dashboard. */
export async function GET() {
  const session = getSessionOrDefault();
  const [cls, students] = await Promise.all([
    getClass(session.classId),
    listClassStudents(session.classId),
  ]);
  return NextResponse.json({ class: cls, students, session });
}
