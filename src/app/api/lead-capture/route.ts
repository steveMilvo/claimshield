import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email || !firstName) {
    return NextResponse.json({ error: "First name and email are required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // MVP: log to stdout. Production: persist + notify.
  console.log(
    `[lead-capture] firstName="${firstName}" lastName="${lastName}" email="${email}" at=${new Date().toISOString()}`
  );

  return NextResponse.json({ ok: true });
}
