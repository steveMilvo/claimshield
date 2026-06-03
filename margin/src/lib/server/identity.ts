import { cookies } from "next/headers";
import { defaultClassId } from "./store";

/**
 * Lightweight session identity for the pilot. A signed/encrypted session
 * (NextAuth or iron-session) replaces this before production — but the shape
 * here is what the rest of the app consumes, so that swap is contained.
 */

export type Role = "student" | "teacher";

export interface Session {
  role: Role;
  id: string;
  name: string;
  classId: string;
}

export const SESSION_COOKIE = "margin_session";

export function encodeSession(s: Session): string {
  return Buffer.from(JSON.stringify(s), "utf8").toString("base64url");
}

export function decodeSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (s && (s.role === "student" || s.role === "teacher") && s.id) return s as Session;
  } catch {
    /* ignore */
  }
  return null;
}

/** Read the current session in a Server Component or Route Handler. */
export function getSession(): Session | null {
  return decodeSession(cookies().get(SESSION_COOKIE)?.value);
}

/** Session, or a safe default student so the demo never dead-ends. */
export function getSessionOrDefault(): Session {
  return (
    getSession() || {
      role: "student",
      id: "stu_1",
      name: "Maya P.",
      classId: defaultClassId(),
    }
  );
}

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
