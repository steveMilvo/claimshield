import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let firm = "";
  let email = "";
  let tpb = "";

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    firm = body.firm ?? "";
    email = body.email ?? "";
    tpb = body.tpb ?? "";
  } else {
    const form = await req.formData();
    firm = String(form.get("firm") ?? "");
    email = String(form.get("email") ?? "");
    tpb = String(form.get("tpb") ?? "");
  }

  if (!email || !firm) {
    return NextResponse.redirect(new URL("/?practice=error", req.url), { status: 303 });
  }

  // MVP: log to stdout. Production: persist + notify.
  console.log(
    `[accountant-interest] firm="${firm}" email="${email}" tpb="${tpb}" at=${new Date().toISOString()}`
  );

  return NextResponse.redirect(new URL("/?practice=registered#practice", req.url), { status: 303 });
}
