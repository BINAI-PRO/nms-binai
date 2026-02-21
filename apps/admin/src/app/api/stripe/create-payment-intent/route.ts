import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  amount_cents: z.number().int().positive(),
  currency: z.string().default("mxn"),
  community_id: z.string().uuid(),
  wallet_id: z.string().uuid(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  if (!env.STRIPE_SECRET_KEY) {
    return new NextResponse("Stripe no configurado", { status: 500 });
  }
  if (!supabaseAdmin) {
    return new NextResponse("Supabase no configurado", { status: 500 });
  }

  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const payload = parsed.data;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20" as Stripe.LatestApiVersion,
  });

  const intent = await stripe.paymentIntents.create({
    amount: payload.amount_cents,
    currency: payload.currency,
    payment_method_types: ["card"],
    description: payload.description,
    metadata: {
      community_id: payload.community_id,
      wallet_id: payload.wallet_id,
      ...payload.metadata,
    },
  });

  const txInsert = await supabaseAdmin
    .from("wallet_transactions")
    .insert({
      wallet_id: payload.wallet_id,
      community_id: payload.community_id,
      type: "payment",
      amount_cents: payload.amount_cents,
      currency: payload.currency.toUpperCase(),
      status: "pending",
      payment_intent_id: intent.id,
      description: payload.description ?? "Pago con Stripe",
      metadata: payload.metadata ?? {},
    });
  if (txInsert.error) {
    return NextResponse.json({ error: txInsert.error.message }, { status: 500 });
  }

  return NextResponse.json({ client_secret: intent.client_secret, payment_intent_id: intent.id });
}
