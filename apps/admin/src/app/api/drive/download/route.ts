import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  fileId: z.string(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = schema.safeParse({ fileId: searchParams.get("fileId") });
  if (!parsed.success) {
    return NextResponse.json({ error: "fileId requerido" }, { status: 400 });
  }

  const url = `https://drive.google.com/uc?export=download&id=${parsed.data.fileId}`;
  return NextResponse.redirect(url);
}
