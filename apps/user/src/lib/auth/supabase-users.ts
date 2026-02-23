import { supabaseAdmin } from "@/lib/supabase";

export type MembershipRow = {
  community_id: string;
  building_id: string | null;
  unit_id: string | null;
  role: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: string;
  community_ids: string[];
  active_community_id: string | null;
  unit_id_optional: string | null;
  building_id_optional: string | null;
};

export async function upsertUserAndMemberships(params: {
  uid: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  communityId?: string | null;
}): Promise<SessionUser> {
  if (!supabaseAdmin) {
    throw new Error("Supabase no configurado");
  }

  const { uid, email, name, avatarUrl, communityId } = params;

  const upsertRes = await supabaseAdmin
    .from("users")
    .upsert({ id: uid, email, full_name: name ?? email }, { onConflict: "id" })
    .select("id, email, full_name")
    .single();

  if (upsertRes.error) {
    throw upsertRes.error;
  }

  if (communityId) {
    const membership = await supabaseAdmin
      .from("memberships")
      .upsert(
        {
          user_id: uid,
          community_id: communityId,
          role: "resident",
        },
        { onConflict: "user_id,community_id,role" }
      )
      .select("community_id, role")
      .maybeSingle();
    if (membership.error) throw membership.error;
  }

  const memberships = await supabaseAdmin
    .from("memberships")
    .select("community_id, building_id, unit_id, role")
    .eq("user_id", uid);
  if (memberships.error) throw memberships.error;

  const primary = memberships.data?.[0];

  return {
    id: uid,
    email,
    name: upsertRes.data.full_name,
    image: avatarUrl ?? null,
    role: primary?.role ?? "resident",
    community_ids: memberships.data?.map((m) => m.community_id) ?? [],
    active_community_id: primary?.community_id ?? null,
    unit_id_optional: primary?.unit_id ?? null,
    building_id_optional: primary?.building_id ?? null,
  };
}
