-- Seed base data for Bisalom Hub + authenticated users (idempotent)
-- Uses auth.users UUIDs already present in Supabase Auth.

insert into communities (id, name, timezone, created_at)
values (
  'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
  'Bisalom Hub',
  'America/Mexico_City',
  '2026-02-21 20:17:26.112141+00'::timestamptz
)
on conflict (id) do update
set
  name = excluded.name,
  timezone = excluded.timezone;

insert into users (id, email, full_name, created_at)
values
  (
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'contacto@binai.pro',
    'BInAI Contacto',
    '2026-02-21 02:13:50.278794+00'::timestamptz
  ),
  (
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'support@binai.pro',
    'BInAI Support',
    '2026-02-21 02:12:09.831802+00'::timestamptz
  )
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name;

insert into memberships (user_id, community_id, role, created_at)
values (
  'fa0402d5-cd9f-432c-940b-100587b88030',
  'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
  'admin'::role_enum,
  now()
)
on conflict (user_id, community_id, role) do nothing;
