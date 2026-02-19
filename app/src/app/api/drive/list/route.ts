import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  linked_entity_type: z.string(),
  linked_entity_id: z.string().uuid(),
  community_id: z.string().uuid(),
});

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = schema.safeParse({
    linked_entity_type: searchParams.get("linked_entity_type"),
    linked_entity_id: searchParams.get("linked_entity_id"),
    community_id: searchParams.get("community_id"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const files = await supabaseAdmin
    .from("drive_files")
    .select("*")
    .match({
      linked_entity_type: parsed.data.linked_entity_type,
      linked_entity_id: parsed.data.linked_entity_id,
      community_id: parsed.data.community_id,
    })
    .order("created_at", { ascending: false });

  if (files.error) {
    return NextResponse.json({ error: files.error.message }, { status: 500 });
  }

  return NextResponse.json({ files: files.data });
}
