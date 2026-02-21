import { NextResponse } from "next/server";
import { z } from "zod";
import { getDriveClient } from "@/lib/google-drive";
import { supabaseAdmin } from "@/lib/supabase";

const allowedMime = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
];

const schema = z.object({
  community_id: z.string().uuid(),
  linked_entity_type: z.string(),
  linked_entity_id: z.string().uuid(),
  drive_folder_id: z.string().optional(),
});

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const form = await request.formData();
  const jsonPart = form.get("metadata");
  const file = form.get("file") as File | null;

  if (!jsonPart || typeof jsonPart !== "string") {
    return NextResponse.json({ error: "metadata requerida" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "file requerido" }, { status: 400 });
  }

  const parsed = schema.safeParse(JSON.parse(jsonPart));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!allowedMime.includes(file.type)) {
    return NextResponse.json({ error: "Mime no permitido" }, { status: 400 });
  }

  const drive = getDriveClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadRes = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: parsed.data.drive_folder_id ? [parsed.data.drive_folder_id] : undefined,
    },
    media: {
      mimeType: file.type,
      body: Buffer.from(buffer),
    },
    fields: "id, name, mimeType, size",
  });

  const driveFile = uploadRes.data;

  const insert = await supabaseAdmin.from("drive_files").insert({
    community_id: parsed.data.community_id,
    drive_file_id: driveFile.id,
    drive_folder_id: parsed.data.drive_folder_id ?? null,
    file_name: driveFile.name ?? file.name,
    mime_type: driveFile.mimeType ?? file.type,
    size_bytes: Number(driveFile.size ?? buffer.byteLength),
    linked_entity_type: parsed.data.linked_entity_type,
    linked_entity_id: parsed.data.linked_entity_id,
  });
  if (insert.error) {
    return NextResponse.json({ error: insert.error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    drive_file_id: driveFile.id,
    file_name: driveFile.name,
  });
}
