import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request) {
  try {
    const { amount, tierKey } = await request.json();

    if (!stripe) {
      // If Stripe is not configured yet, return a mock success response so the checkout still works in preview mode
      return NextResponse.json({
        mock: true,
        clientSecret: "mock_secret_" + Date.now(),
        message: "Stripe not configured on backend. Returning mock client secret."
      });
    }

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: "eur",
      metadata: { tierKey },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Stripe payment intent error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
