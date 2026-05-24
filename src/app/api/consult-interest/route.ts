import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let firstName = "";
  let email = "";

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    firstName = body.firstName ?? "";
    email = body.email ?? "";
  } else {
    const form = await req.formData();
    firstName = String(form.get("firstName") ?? "");
    email = String(form.get("email") ?? "");
  }

  if (!email) {
    return NextResponse.redirect(new URL("/?consult=error#pricing", req.url), { status: 303 });
  }

  console.log(
    `[consult-interest] firstName="${firstName}" email="${email}" at=${new Date().toISOString()}`
  );

  return NextResponse.redirect(new URL("/?consult=registered#pricing", req.url), { status: 303 });
}
