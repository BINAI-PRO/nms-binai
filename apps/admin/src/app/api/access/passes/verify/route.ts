import { NextResponse } from "next/server";
import { z } from "zod";
import {
  type AccessPassRow,
  decorateAccessPass,
  getEffectivePassStatus,
} from "@/lib/access-passes";
import { supabaseAdmin } from "@/lib/supabase";

const verifySchema = z.object({
  token: z.string().min(6).max(160),
  consume: z.boolean().optional().default(false),
});

const passSelect =
  "id,community_id,type,label,token,qr_payload,status,valid_from,valid_until,max_uses,used_count,last_used_at,created_at";

function messageByStatus(status: "invalid" | "active" | "revoked" | "expired" | "used_up") {
  if (status === "active") return "Acceso permitido";
  if (status === "revoked") return "Pase revocado";
  if (status === "expired") return "Pase expirado";
  if (status === "used_up") return "Pase sin usos disponibles";
  return "Token no encontrado";
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const json = await request.json().catch(() => null);
  const parsed = verifySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const normalizedToken = parsed.data.token.trim().toUpperCase();
  const passResult = await supabaseAdmin
    .from("access_passes")
    .select(passSelect)
    .eq("token", normalizedToken)
    .maybeSingle();

  if (passResult.error) {
    return NextResponse.json({ error: passResult.error.message }, { status: 500 });
  }

  if (!passResult.data) {
    return NextResponse.json({
      valid: false,
      status: "invalid",
      message: messageByStatus("invalid"),
      pass: null,
    });
  }

  let row = passResult.data as AccessPassRow;
  let effectiveStatus = getEffectivePassStatus(row);

  if (parsed.data.consume && effectiveStatus === "active") {
    const nextUsedCount = row.used_count + 1;
    const nextStatus = nextUsedCount >= row.max_uses ? "used_up" : row.status;
    const updateResult = await supabaseAdmin
      .from("access_passes")
      .update({
        used_count: nextUsedCount,
        status: nextStatus,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", row.id)
      .select(passSelect)
      .single();

    if (updateResult.error) {
      return NextResponse.json({ error: updateResult.error.message }, { status: 500 });
    }
    row = updateResult.data as AccessPassRow;
    effectiveStatus = getEffectivePassStatus(row);
  }

  const pass = await decorateAccessPass(row);
  return NextResponse.json({
    valid: pass.effective_status === "active",
    status: pass.effective_status,
    message: messageByStatus(pass.effective_status),
    pass,
  });
}
