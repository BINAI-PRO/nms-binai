import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const updateSchema = z.object({
  status: z.enum(["active", "revoked"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const params = await context.params;
  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "id invalido" }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsedBody = updateSchema.safeParse(json);
  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error.flatten() }, { status: 400 });
  }

  const update = await supabaseAdmin
    .from("access_passes")
    .update({ status: parsedBody.data.status })
    .eq("id", parsedParams.data.id)
    .select(
      "id,community_id,type,label,token,status,valid_from,valid_until,max_uses,used_count,last_used_at,created_at"
    )
    .single();

  if (update.error) {
    return NextResponse.json({ error: update.error.message }, { status: 500 });
  }

  return NextResponse.json({ pass: update.data });
}
