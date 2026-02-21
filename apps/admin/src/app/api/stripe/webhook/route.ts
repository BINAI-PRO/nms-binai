import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_SECRET_KEY) {
    return new NextResponse("Stripe no configurado", { status: 500 });
  }
  if (!supabaseAdmin) {
    return new NextResponse("Supabase no configurado", { status: 500 });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20" as Stripe.LatestApiVersion,
  });

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Sin firma");
    event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Error verificando webhook", error);
    return new NextResponse("Firma inválida", { status: 400 });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent | undefined;
  const paymentIntentId = paymentIntent?.id ?? null;

  if (paymentIntentId) {
    const status =
      event.type === "payment_intent.succeeded"
        ? "succeeded"
        : event.type === "charge.refunded"
          ? "refunded"
          : event.type === "payment_intent.payment_failed"
            ? "failed"
            : undefined;

    if (status) {
      const updateRes = await supabaseAdmin
        .from("wallet_transactions")
        .update({ status })
        .eq("payment_intent_id", paymentIntentId);
      if (updateRes.error) {
        console.error("Error actualizando wallet_transactions", updateRes.error);
      }
    }
  }

  const communityId = (paymentIntent?.metadata?.community_id as string) ?? null;
  const insertEvent = await supabaseAdmin.from("payments_stripe_events").upsert({
    id: event.id,
    community_id: communityId,
    type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });
  if (insertEvent.error) {
    console.error("No se pudo guardar evento Stripe", insertEvent.error);
  }

  return NextResponse.json({ received: true });
}
