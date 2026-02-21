import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseAuth } from "@/lib/firebase-admin";
import { upsertUserAndMemberships } from "@/lib/auth/supabase-users";

const bodySchema = z.object({
  idToken: z.string(),
  communityId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const firebaseAuth = getFirebaseAuth();
  const decoded = await firebaseAuth.verifyIdToken(parsed.data.idToken);
  const email = decoded.email ?? "";

  const sessionUser = await upsertUserAndMemberships({
    uid: decoded.uid,
    email,
    name: decoded.name,
    communityId: parsed.data.communityId ?? null,
  });

  return NextResponse.json({
    ok: true,
    user: sessionUser,
  });
}
