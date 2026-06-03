import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildLadder } from "@/lib/practice";
import { TRAIT_MAP } from "@/lib/rubric";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  trait: z.string(),
  tag: z.string(),
  topic: z.string().default(""),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }
  if (!TRAIT_MAP[body.trait]) {
    return NextResponse.json({ error: "Unknown trait" }, { status: 400 });
  }

  const { ladder, engine } = await buildLadder(body.trait as any, body.tag, body.topic);
  return NextResponse.json({ ladder, engine });
}
