import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key to bypass row level security (RLS)

export async function POST(request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ message: "Stripe Webhook received (running in development fallback mode)." }, { status: 200 });
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: `Signature verification failed: ${err.message}` }, { status: 400 });
  }

  // Handle payment success
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const tierKey = paymentIntent.metadata.tierKey;
    const userEmail = paymentIntent.metadata.email || paymentIntent.receipt_email;

    if (userEmail && tierKey && supabaseUrl && supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      
      // Update user plan tier in profiles
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ plan_tier: tierKey })
        .eq("email", userEmail);

      if (error) {
        console.error("Failed to upgrade user profile tier in Supabase:", error);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
