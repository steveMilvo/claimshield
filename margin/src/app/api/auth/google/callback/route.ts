import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  encodeSession,
  googleConfigured,
  type Session,
} from "@/lib/server/identity";
import { upsertStudentByExternalId, defaultClassId } from "@/lib/server/store";

export const runtime = "nodejs";

/** Google OAuth callback: exchange code → fetch profile → upsert → session. */
export async function GET(req: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/signin?error=google_unconfigured", req.url));
  }
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expected = req.cookies.get("margin_oauth_state")?.value;

  if (!code || !state || state !== expected) {
    return NextResponse.redirect(new URL("/signin?error=oauth_state", req.url));
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${url.origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const token = await tokenRes.json();
    if (!token.access_token) throw new Error("no access_token");

    const profRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const profile = await profRes.json();
    const sub: string = profile.sub;
    const name: string = profile.name || profile.email || "Student";
    if (!sub) throw new Error("no profile sub");

    const student = await upsertStudentByExternalId(sub, name, defaultClassId());
    const session: Session = {
      role: "student",
      id: student.studentId,
      name,
      classId: defaultClassId(),
    };

    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set(SESSION_COOKIE, encodeSession(session), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    res.cookies.set("margin_oauth_state", "", { path: "/", maxAge: 0 });
    return res;
  } catch (e) {
    console.error("google oauth callback failed:", e);
    return NextResponse.redirect(new URL("/signin?error=oauth_failed", req.url));
  }
}
