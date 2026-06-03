import { NextRequest, NextResponse } from "next/server";
import { googleConfigured } from "@/lib/server/identity";

export const runtime = "nodejs";

/**
 * Begin Google sign-in (OAuth2 authorization-code flow). Real and standard —
 * set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET and add this app's
 * `${origin}/api/auth/google/callback` as an authorised redirect URI in the
 * Google Cloud console, and it works. Until then the button is disabled.
 *
 * Classroom roster import (classroom.rosters.readonly) is a Phase-1 add-on;
 * for login we only need openid/email/profile.
 */
export async function GET(req: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.json(
      { error: "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET." },
      { status: 503 }
    );
  }
  const origin = new URL(req.url).origin;
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
  res.cookies.set("margin_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
