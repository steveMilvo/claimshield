import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionOrDefault } from "@/lib/server/identity";
import { listAlerts, acknowledgeAlert } from "@/lib/server/store";

export const runtime = "nodejs";

/** Safeguarding alerts for the teacher / DSL of the current class. */
export async function GET() {
  const session = getSessionOrDefault();
  const alerts = await listAlerts(session.classId);
  return NextResponse.json({ alerts });
}

const Ack = z.object({ id: z.string() });

/** Acknowledge an alert (records who reviewed it and when). */
export async function POST(req: NextRequest) {
  const session = getSessionOrDefault();
  if (session.role !== "teacher") {
    return NextResponse.json({ error: "Only a teacher can acknowledge alerts." }, { status: 403 });
  }
  let body: z.infer<typeof Ack>;
  try {
    body = Ack.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }
  const alert = await acknowledgeAlert(body.id, session.name);
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, alert });
}
