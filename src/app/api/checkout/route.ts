import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in your environment." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const reportId = String(body.reportId ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const firstName = String(body.firstName ?? "").trim();

  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const unitAmount = parseInt(process.env.STRIPE_PRICE_AUD_CENTS ?? "9900", 10);
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: unitAmount,
            product_data: {
              name: "Founder Tax Blueprint — Full Report",
              description:
                "Complete Australian tax structure & exit planning analysis. Includes all 8+ structure scenarios, full exit narrative, action checklist, international analysis, and accountant brief.",
            },
          },
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      client_reference_id: reportId,
      metadata: { reportId, firstName },
      success_url: `${origin}/report/${reportId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/report/${reportId}?cancelled=1`,
      automatic_tax: { enabled: false },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stripe error" },
      { status: 500 }
    );
  }
}
