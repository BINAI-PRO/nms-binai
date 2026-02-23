-- Adds a top-level Community Administrator entity and seeds 2 new communities.
-- Requires: 0001..0005

-- 1) New top-level entity
create table if not exists community_administrators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  slug text not null unique,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (name)
);

alter table community_administrators enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'community_administrators'
      and policyname = 'community_administrators_select_authenticated'
  ) then
    create policy community_administrators_select_authenticated
      on community_administrators
      for select
      using (auth.role() = 'authenticated');
  end if;
end $$;

-- 2) Link communities -> community administrator
alter table communities
  add column if not exists community_administrator_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'communities_community_administrator_id_fkey'
  ) then
    alter table communities
      add constraint communities_community_administrator_id_fkey
      foreign key (community_administrator_id)
      references community_administrators(id)
      on delete set null;
  end if;
end $$;

create index if not exists communities_community_administrator_id_idx
  on communities (community_administrator_id);

-- 3) Seed top-level administrator
insert into community_administrators (id, name, legal_name, slug, status, created_at)
values (
  '7c5c828c-f95a-4c31-a5c7-1b338df81001',
  'Bisalom',
  'Bisalom Community Management',
  'bisalom',
  'active',
  now()
)
on conflict (id) do update
set
  name = excluded.name,
  legal_name = excluded.legal_name,
  slug = excluded.slug,
  status = excluded.status;

-- 4) Seed/assign communities under Bisalom
insert into communities (id, name, timezone, created_at, community_administrator_id)
values
  (
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Bisalom Hub',
    'America/Mexico_City',
    now(),
    '7c5c828c-f95a-4c31-a5c7-1b338df81001'
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Country Lomas Altas',
    'America/Mexico_City',
    now(),
    '7c5c828c-f95a-4c31-a5c7-1b338df81001'
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'Valle La Silla',
    'America/Mexico_City',
    now(),
    '7c5c828c-f95a-4c31-a5c7-1b338df81001'
  )
on conflict (id) do update
set
  name = excluded.name,
  timezone = excluded.timezone,
  community_administrator_id = excluded.community_administrator_id;

-- 5) Admin/resident memberships in the 2 new communities
insert into memberships (id, user_id, community_id, role, created_at)
values
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df83001',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'admin'::role_enum,
    now()
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df83002',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'admin'::role_enum,
    now()
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df83003',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'resident'::role_enum,
    now()
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df83004',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'resident'::role_enum,
    now()
  )
on conflict (user_id, community_id, role) do nothing;

-- 6) Buildings / cerradas / privadas
insert into buildings (id, community_id, name, created_at)
values
  -- Country Lomas Altas
  ('7c5c828c-f95a-4c31-a5c7-1b338df84001','7c5c828c-f95a-4c31-a5c7-1b338df82001','Edificio Lago Norte',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84002','7c5c828c-f95a-4c31-a5c7-1b338df82001','Edificio Mirador Sur',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84003','7c5c828c-f95a-4c31-a5c7-1b338df82001','Cerrada Encinos',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84004','7c5c828c-f95a-4c31-a5c7-1b338df82001','Privada Robles',now()),
  -- Valle La Silla
  ('7c5c828c-f95a-4c31-a5c7-1b338df84005','7c5c828c-f95a-4c31-a5c7-1b338df82002','Edificio Sierra Alta',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84006','7c5c828c-f95a-4c31-a5c7-1b338df82002','Edificio Horizonte',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84007','7c5c828c-f95a-4c31-a5c7-1b338df82002','Cerrada La Cima',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84008','7c5c828c-f95a-4c31-a5c7-1b338df82002','Privada del Bosque',now())
on conflict (id) do update
set
  name = excluded.name,
  community_id = excluded.community_id;

-- 7) Units
insert into units (id, community_id, building_id, unit_code, owner_name, created_at)
values
  ('7c5c828c-f95a-4c31-a5c7-1b338df85001','7c5c828c-f95a-4c31-a5c7-1b338df82001','7c5c828c-f95a-4c31-a5c7-1b338df84001','LN-101','Familia Herrera',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df85002','7c5c828c-f95a-4c31-a5c7-1b338df82001','7c5c828c-f95a-4c31-a5c7-1b338df84003','CE-12','Contacto BInAI',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df85003','7c5c828c-f95a-4c31-a5c7-1b338df82001','7c5c828c-f95a-4c31-a5c7-1b338df84004','PR-07','Familia Salinas',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df85004','7c5c828c-f95a-4c31-a5c7-1b338df82002','7c5c828c-f95a-4c31-a5c7-1b338df84005','SA-301','Familia Garza',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df85005','7c5c828c-f95a-4c31-a5c7-1b338df82002','7c5c828c-f95a-4c31-a5c7-1b338df84007','LC-21','Contacto BInAI',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df85006','7c5c828c-f95a-4c31-a5c7-1b338df82002','7c5c828c-f95a-4c31-a5c7-1b338df84008','PB-02','Familia Elizondo',now())
on conflict (id) do update
set
  unit_code = excluded.unit_code,
  owner_name = excluded.owner_name,
  building_id = excluded.building_id,
  community_id = excluded.community_id;

-- Map resident memberships to specific unit/building
update memberships
set
  building_id = '7c5c828c-f95a-4c31-a5c7-1b338df84003',
  unit_id = '7c5c828c-f95a-4c31-a5c7-1b338df85002'
where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575'
  and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
  and role = 'resident'::role_enum;

update memberships
set
  building_id = '7c5c828c-f95a-4c31-a5c7-1b338df84007',
  unit_id = '7c5c828c-f95a-4c31-a5c7-1b338df85005'
where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575'
  and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82002'
  and role = 'resident'::role_enum;

-- 8) Amenities (facilities)
insert into facilities (id, community_id, name, type, location, status, created_at)
values
  -- Country Lomas Altas
  ('7c5c828c-f95a-4c31-a5c7-1b338df86001','7c5c828c-f95a-4c31-a5c7-1b338df82001','Casa Club Lomas','Area Comun','Plaza Central','available',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df86002','7c5c828c-f95a-4c31-a5c7-1b338df82001','Alberca Familiar','Area Exterior','Zona Deportiva','available',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df86003','7c5c828c-f95a-4c31-a5c7-1b338df82001','Cancha de Padel','Area Deportiva','Zona Deportiva','available',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df86004','7c5c828c-f95a-4c31-a5c7-1b338df82001','Pet Park','Area Exterior','Jardin Norte','available',now()),
  -- Valle La Silla
  ('7c5c828c-f95a-4c31-a5c7-1b338df86005','7c5c828c-f95a-4c31-a5c7-1b338df82002','Casa Club Panorama','Area Comun','Acceso Principal','available',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df86006','7c5c828c-f95a-4c31-a5c7-1b338df82002','Alberca Semiolimpica','Area Exterior','Andador Oriente','available',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df86007','7c5c828c-f95a-4c31-a5c7-1b338df82002','Gimnasio 24/7','Area Deportiva','Torre de Amenidades','available',now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df86008','7c5c828c-f95a-4c31-a5c7-1b338df82002','Salon de Eventos','Area Comun','Nivel 2 - Casa Club','available',now())
on conflict (id) do update
set
  name = excluded.name,
  type = excluded.type,
  location = excluded.location,
  status = excluded.status,
  community_id = excluded.community_id;

-- 9) One blackout per new community
insert into facility_blackouts (id, facility_id, community_id, starts_at, ends_at, reason)
values
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df87001',
    '7c5c828c-f95a-4c31-a5c7-1b338df86003',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '2026-03-12 15:00:00+00'::timestamptz,
    '2026-03-12 20:00:00+00'::timestamptz,
    'Torneo interno'
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df87002',
    '7c5c828c-f95a-4c31-a5c7-1b338df86007',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    '2026-03-18 05:00:00+00'::timestamptz,
    '2026-03-18 10:00:00+00'::timestamptz,
    'Mantenimiento de equipo'
  )
on conflict (id) do update
set
  facility_id = excluded.facility_id,
  community_id = excluded.community_id,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  reason = excluded.reason;
