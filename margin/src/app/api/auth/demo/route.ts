import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE,
  encodeSession,
  googleConfigured,
  type Session,
} from "@/lib/server/identity";
import { getClass, getStudent, defaultClassId } from "@/lib/server/store";

export const runtime = "nodejs";

/** List the roster (for the sign-in picker). */
export async function GET() {
  const cls = await getClass(defaultClassId());
  const students = cls
    ? await Promise.all(
        cls.studentIds.map(async (id) => {
          const s = await getStudent(id);
          return { id: s.studentId, name: s.displayName };
        })
      )
    : [];
  return NextResponse.json({
    class: cls,
    students,
    teacher: { id: "teacher_1", name: cls?.teacherName ?? "Teacher" },
    googleConfigured: googleConfigured(),
  });
}

const Body = z.object({
  role: z.enum(["student", "teacher"]),
  id: z.string(),
  name: z.string(),
});

/** Demo sign-in: set the session cookie for the chosen identity. */
export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }
  const session: Session = {
    role: body.role,
    id: body.id,
    name: body.name,
    classId: defaultClassId(),
  };
  const res = NextResponse.json({ ok: true, session });
  res.cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
