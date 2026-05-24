import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const sessionId = String(body.sessionId ?? "").trim();
  const reportId = String(body.reportId ?? "").trim();

  if (!sessionId || !reportId) {
    return NextResponse.json({ paid: false, error: "Missing sessionId or reportId" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid =
      session.payment_status === "paid" &&
      session.client_reference_id === reportId;

    if (paid) {
      console.log(
        `[checkout-success] reportId="${reportId}" sessionId="${sessionId}" email="${session.customer_email ?? ""}" amount=${session.amount_total} ${session.currency} at=${new Date().toISOString()}`
      );
    }

    return NextResponse.json({
      paid,
      amount: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
    });
  } catch (err) {
    console.error("Stripe verify-session error:", err);
    return NextResponse.json(
      { paid: false, error: err instanceof Error ? err.message : "Stripe error" },
      { status: 500 }
    );
  }
}
