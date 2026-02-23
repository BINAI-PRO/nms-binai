import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { type AccessPassRow, decorateAccessPass } from "@/lib/access-passes";
import { supabaseAdmin } from "@/lib/supabase";

const createPassSchema = z.object({
  community_id: z.string().uuid(),
  type: z.enum(["visitor", "service"]),
  label: z.string().min(2).max(120),
  valid_hours: z.number().int().min(1).max(168).default(2),
  max_uses: z.number().int().min(1).max(50).default(1),
  created_by: z.string().uuid().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const querySchema = z.object({
  community_id: z.string().uuid().optional(),
  status: z.enum(["active", "revoked", "expired", "used_up"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

function generateToken(type: "visitor" | "service") {
  const prefix = type === "visitor" ? "INV" : "SRV";
  const suffix = randomBytes(9).toString("base64url").toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    community_id: searchParams.get("community_id") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("access_passes")
    .select(
      "id,community_id,type,label,token,qr_payload,status,valid_from,valid_until,max_uses,used_count,last_used_at,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(parsed.data.limit);

  if (parsed.data.community_id) {
    query = query.eq("community_id", parsed.data.community_id);
  }
  if (parsed.data.status) {
    query = query.eq("status", parsed.data.status);
  }

  const result = await query;
  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  const nowTimestamp = Date.now();
  const passes = await Promise.all(
    ((result.data ?? []) as AccessPassRow[]).map((item) => decorateAccessPass(item, nowTimestamp))
  );

  return NextResponse.json({ passes });
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createPassSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const token = generateToken(parsed.data.type);
  const validFrom = new Date();
  const validUntil = new Date(validFrom.getTime() + parsed.data.valid_hours * 60 * 60 * 1000);
  const qrPayload = JSON.stringify({
    token,
    type: parsed.data.type,
    community_id: parsed.data.community_id,
    valid_until: validUntil.toISOString(),
  });

  const insert = await supabaseAdmin
    .from("access_passes")
    .insert({
      community_id: parsed.data.community_id,
      created_by: parsed.data.created_by ?? null,
      type: parsed.data.type,
      label: parsed.data.label,
      token,
      qr_payload: qrPayload,
      valid_from: validFrom.toISOString(),
      valid_until: validUntil.toISOString(),
      max_uses: parsed.data.max_uses,
      metadata: parsed.data.metadata ?? {},
    })
    .select(
      "id,community_id,type,label,token,qr_payload,status,valid_from,valid_until,max_uses,used_count,last_used_at,created_at"
    )
    .single();

  if (insert.error) {
    return NextResponse.json({ error: insert.error.message }, { status: 500 });
  }

  const pass = await decorateAccessPass(insert.data as AccessPassRow);
  return NextResponse.json({ pass });
}
