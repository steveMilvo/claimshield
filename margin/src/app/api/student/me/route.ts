import { NextResponse } from "next/server";
import { getSessionOrDefault } from "@/lib/server/identity";
import { getStudent } from "@/lib/server/store";

export const runtime = "nodejs";

/** The current signed-in student's model (canonical, server-owned). */
export async function GET() {
  const session = getSessionOrDefault();
  const student = getStudent(session.id);
  return NextResponse.json({ student, session });
}
