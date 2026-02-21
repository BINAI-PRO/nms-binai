import { NextResponse } from "next/server";
import { z } from "zod";
import { getDriveClient } from "@/lib/google-drive";

const schema = z.object({
  community_id: z.string().uuid(),
  root_folder_id: z.string().optional(),
});

const CHILDREN = [
  "incidents",
  "receipts_expenses",
  "receipts_income",
  "improvement_reports",
  "documents_public",
  "documents_private",
];

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const drive = getDriveClient();

  let rootId = parsed.data.root_folder_id;
  if (!rootId) {
    const rootRes = await drive.files.create({
      requestBody: {
        name: `community_${parsed.data.community_id}`,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });
    rootId = rootRes.data.id ?? undefined;
  }

  const created: Record<string, string | undefined> = {};
  for (const name of CHILDREN) {
    const res = await drive.files.create({
      requestBody: {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: rootId ? [rootId] : undefined,
      },
      fields: "id, name",
    });
    created[name] = res.data.id ?? undefined;
  }

  return NextResponse.json({ ok: true, root_folder_id: rootId, children: created });
}
