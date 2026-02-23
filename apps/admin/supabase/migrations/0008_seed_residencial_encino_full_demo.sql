-- Renames Country Lomas Altas -> Residencial Encino and seeds full demo model
-- Requires: 0001..0007

-- Constants
-- community admin:   7c5c828c-f95a-4c31-a5c7-1b338df81001 (Bisalom)
-- Encino community:  7c5c828c-f95a-4c31-a5c7-1b338df82001
-- resident user:     3f9c153a-d8a1-4f10-b81a-ef08764f9575
-- admin user:        fa0402d5-cd9f-432c-940b-100587b88030

-- 1) Ensure and rename community
insert into communities (id, name, timezone, created_at)
values (
  '7c5c828c-f95a-4c31-a5c7-1b338df82001',
  'Residencial Encino',
  'America/Mexico_City',
  now()
)
on conflict (id) do update
set
  name = excluded.name,
  timezone = excluded.timezone;

-- If the column from migration 0006 exists, keep community linked to Bisalom administrator.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'communities'
      and column_name = 'community_administrator_id'
  ) then
    update communities
    set community_administrator_id = '7c5c828c-f95a-4c31-a5c7-1b338df81001'
    where id = '7c5c828c-f95a-4c31-a5c7-1b338df82001';
  end if;
end $$;

-- 2) Booking rule model
create table if not exists facility_booking_policies (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  reservation_mode text not null,
  slot_interval_minutes integer not null default 30,
  duration_step_minutes integer not null default 30,
  min_duration_minutes integer not null default 60,
  max_duration_minutes integer not null,
  max_advance_days integer not null default 45,
  opening_time time not null default '06:00'::time,
  closing_time time not null default '22:00'::time,
  capacity_total integer,
  subspaces_count integer,
  subspace_capacity integer,
  allow_overlap boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  constraint facility_booking_policies_mode_check
    check (reservation_mode in ('exclusive', 'zoned', 'capacity')),
  constraint facility_booking_policies_interval_check
    check (slot_interval_minutes in (15, 30, 60)),
  constraint facility_booking_policies_step_check
    check (duration_step_minutes in (15, 30, 60)),
  constraint facility_booking_policies_duration_check
    check (max_duration_minutes >= min_duration_minutes and min_duration_minutes > 0),
  constraint facility_booking_policies_capacity_check
    check ((capacity_total is null or capacity_total > 0)
      and (subspaces_count is null or subspaces_count > 0)
      and (subspace_capacity is null or subspace_capacity > 0)),
  constraint facility_booking_policies_unique_facility unique (facility_id)
);

create table if not exists facility_resources (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  code text not null,
  name text not null,
  capacity integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  constraint facility_resources_capacity_check check (capacity > 0),
  constraint facility_resources_unique_code unique (facility_id, code)
);

create index if not exists facility_booking_policies_community_idx
  on facility_booking_policies (community_id, facility_id);
create index if not exists facility_resources_community_idx
  on facility_resources (community_id, facility_id);

alter table facility_booking_policies enable row level security;
alter table facility_resources enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'facility_booking_policies'
      and policyname = 'facility_booking_policies_select'
  ) then
    create policy facility_booking_policies_select
      on facility_booking_policies
      for select
      using (
        exists (
          select 1
          from memberships m
          where m.user_id = auth.uid()
            and m.community_id = facility_booking_policies.community_id
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'facility_booking_policies'
      and policyname = 'facility_booking_policies_write_admin'
  ) then
    create policy facility_booking_policies_write_admin
      on facility_booking_policies
      for all
      using (
        exists (
          select 1
          from memberships m
          where m.user_id = auth.uid()
            and m.community_id = facility_booking_policies.community_id
            and m.role in ('admin', 'staff')
        )
      )
      with check (
        exists (
          select 1
          from memberships m
          where m.user_id = auth.uid()
            and m.community_id = facility_booking_policies.community_id
            and m.role in ('admin', 'staff')
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'facility_resources'
      and policyname = 'facility_resources_select'
  ) then
    create policy facility_resources_select
      on facility_resources
      for select
      using (
        exists (
          select 1
          from memberships m
          where m.user_id = auth.uid()
            and m.community_id = facility_resources.community_id
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'facility_resources'
      and policyname = 'facility_resources_write_admin'
  ) then
    create policy facility_resources_write_admin
      on facility_resources
      for all
      using (
        exists (
          select 1
          from memberships m
          where m.user_id = auth.uid()
            and m.community_id = facility_resources.community_id
            and m.role in ('admin', 'staff')
        )
      )
      with check (
        exists (
          select 1
          from memberships m
          where m.user_id = auth.uid()
            and m.community_id = facility_resources.community_id
            and m.role in ('admin', 'staff')
        )
      );
  end if;
end $$;

-- 3) Extend bookings table to support capacity/resource bookings
alter table bookings
  add column if not exists resource_id uuid;

alter table bookings
  add column if not exists party_size integer not null default 1;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_resource_id_fkey'
  ) then
    alter table bookings
      add constraint bookings_resource_id_fkey
      foreign key (resource_id)
      references facility_resources(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_party_size_check'
  ) then
    alter table bookings
      add constraint bookings_party_size_check
      check (party_size > 0);
  end if;
end $$;

create index if not exists bookings_resource_id_idx
  on bookings (resource_id);

-- 4) Core buildings for Residencial Encino
insert into buildings (id, community_id, name, created_at)
values
  ('7c5c828c-f95a-4c31-a5c7-1b338df84001', '7c5c828c-f95a-4c31-a5c7-1b338df82001', 'Torre Encino (Departamentos)', now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84002', '7c5c828c-f95a-4c31-a5c7-1b338df82001', 'Privada Fresno', now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84003', '7c5c828c-f95a-4c31-a5c7-1b338df82001', 'Privada Nogal', now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84004', '7c5c828c-f95a-4c31-a5c7-1b338df82001', 'Privada Sabino', now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84105', '7c5c828c-f95a-4c31-a5c7-1b338df82001', 'Privada Laurel', now()),
  ('7c5c828c-f95a-4c31-a5c7-1b338df84106', '7c5c828c-f95a-4c31-a5c7-1b338df82001', 'Privada Cedro', now())
on conflict (id) do update
set
  name = excluded.name,
  community_id = excluded.community_id;

-- 5) Units: 30 apartments + 50 houses
insert into units (id, community_id, building_id, unit_code, owner_name, created_at)
select
  gen_random_uuid(),
  '7c5c828c-f95a-4c31-a5c7-1b338df82001',
  '7c5c828c-f95a-4c31-a5c7-1b338df84001',
  'DEP-' || lpad(gs::text, 3, '0'),
  'Departamento ' || lpad(gs::text, 3, '0'),
  now()
from generate_series(1, 30) gs
where not exists (
  select 1
  from units u
  where u.community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
    and u.unit_code = 'DEP-' || lpad(gs::text, 3, '0')
);

insert into units (id, community_id, building_id, unit_code, owner_name, created_at)
select
  gen_random_uuid(),
  '7c5c828c-f95a-4c31-a5c7-1b338df82001',
  case
    when gs between 1 and 10 then '7c5c828c-f95a-4c31-a5c7-1b338df84002'::uuid
    when gs between 11 and 20 then '7c5c828c-f95a-4c31-a5c7-1b338df84003'::uuid
    when gs between 21 and 30 then '7c5c828c-f95a-4c31-a5c7-1b338df84004'::uuid
    when gs between 31 and 40 then '7c5c828c-f95a-4c31-a5c7-1b338df84105'::uuid
    else '7c5c828c-f95a-4c31-a5c7-1b338df84106'::uuid
  end,
  'CASA-' || lpad(gs::text, 3, '0'),
  'Casa ' || lpad(gs::text, 3, '0'),
  now()
from generate_series(1, 50) gs
where not exists (
  select 1
  from units u
  where u.community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
    and u.unit_code = 'CASA-' || lpad(gs::text, 3, '0')
);

-- Ensure resident is mapped to DEP-001 in Encino
update memberships m
set
  building_id = '7c5c828c-f95a-4c31-a5c7-1b338df84001',
  unit_id = u.id
from units u
where m.user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575'
  and m.community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
  and m.role = 'resident'::role_enum
  and u.community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
  and u.unit_code = 'DEP-001';

-- 6) Three main amenities
insert into facilities (id, community_id, name, type, location, status, created_at)
values
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df86101',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Alberca central',
    'Amenidad familiar',
    'Zona deportiva',
    'available',
    now()
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df86102',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Cancha de padel',
    'Deportiva',
    'Corredor deportivo',
    'available',
    now()
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df86103',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Gimnasio',
    'Bienestar',
    'Casa Club',
    'available',
    now()
  )
on conflict (id) do update
set
  name = excluded.name,
  type = excluded.type,
  location = excluded.location,
  status = excluded.status,
  community_id = excluded.community_id;

-- 7) Amenity booking policies
insert into facility_booking_policies (
  facility_id,
  community_id,
  reservation_mode,
  slot_interval_minutes,
  duration_step_minutes,
  min_duration_minutes,
  max_duration_minutes,
  max_advance_days,
  opening_time,
  closing_time,
  capacity_total,
  subspaces_count,
  subspace_capacity,
  allow_overlap,
  notes
)
values
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df86101',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'zoned',
    30,
    30,
    60,
    120,
    45,
    '06:00'::time,
    '22:00'::time,
    75,
    5,
    15,
    true,
    'Alberca por espacios fijos de 15 personas cada uno.'
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df86102',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'exclusive',
    30,
    30,
    60,
    180,
    45,
    '06:00'::time,
    '22:00'::time,
    1,
    null,
    null,
    false,
    'Cancha unica, sin traslape de reservas en el mismo horario.'
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df86103',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'capacity',
    30,
    30,
    60,
    60,
    45,
    '05:00'::time,
    '23:00'::time,
    30,
    null,
    null,
    true,
    'Aforo maximo de 30 personas por bloque horario.'
  )
on conflict (facility_id) do update
set
  reservation_mode = excluded.reservation_mode,
  slot_interval_minutes = excluded.slot_interval_minutes,
  duration_step_minutes = excluded.duration_step_minutes,
  min_duration_minutes = excluded.min_duration_minutes,
  max_duration_minutes = excluded.max_duration_minutes,
  max_advance_days = excluded.max_advance_days,
  opening_time = excluded.opening_time,
  closing_time = excluded.closing_time,
  capacity_total = excluded.capacity_total,
  subspaces_count = excluded.subspaces_count,
  subspace_capacity = excluded.subspace_capacity,
  allow_overlap = excluded.allow_overlap,
  notes = excluded.notes,
  community_id = excluded.community_id;

-- 8) Facility resources (5 pool spaces + padel court + gym area)
insert into facility_resources (facility_id, community_id, code, name, capacity, status, created_at)
select
  '7c5c828c-f95a-4c31-a5c7-1b338df86101',
  '7c5c828c-f95a-4c31-a5c7-1b338df82001',
  'P' || gs::text,
  'Espacio Alberca ' || gs::text,
  15,
  'active',
  now()
from generate_series(1, 5) gs
on conflict (facility_id, code) do update
set
  name = excluded.name,
  capacity = excluded.capacity,
  status = excluded.status,
  community_id = excluded.community_id;

insert into facility_resources (facility_id, community_id, code, name, capacity, status, created_at)
values
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df86102',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'COURT-1',
    'Cancha de padel unica',
    1,
    'active',
    now()
  ),
  (
    '7c5c828c-f95a-4c31-a5c7-1b338df86103',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'GYM-1',
    'Area general de gimnasio',
    30,
    'active',
    now()
  )
on conflict (facility_id, code) do update
set
  name = excluded.name,
  capacity = excluded.capacity,
  status = excluded.status,
  community_id = excluded.community_id;

-- 9) Reservations demo with resources and party_size
insert into bookings (
  id,
  facility_id,
  resource_id,
  community_id,
  user_id,
  status,
  starts_at,
  ends_at,
  party_size,
  price_cents,
  currency,
  deposit_cents,
  created_at
)
values
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000001',
    '7c5c828c-f95a-4c31-a5c7-1b338df86101',
    (
      select id
      from facility_resources
      where facility_id = '7c5c828c-f95a-4c31-a5c7-1b338df86101'
        and code = 'P1'
      limit 1
    ),
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'confirmed'::booking_status,
    '2026-03-28 09:00:00+00'::timestamptz,
    '2026-03-28 10:00:00+00'::timestamptz,
    15,
    50000,
    'MXN',
    0,
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000002',
    '7c5c828c-f95a-4c31-a5c7-1b338df86101',
    (
      select id
      from facility_resources
      where facility_id = '7c5c828c-f95a-4c31-a5c7-1b338df86101'
        and code = 'P2'
      limit 1
    ),
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'pending'::booking_status,
    '2026-03-28 10:30:00+00'::timestamptz,
    '2026-03-28 11:30:00+00'::timestamptz,
    12,
    40000,
    'MXN',
    0,
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000003',
    '7c5c828c-f95a-4c31-a5c7-1b338df86102',
    (
      select id
      from facility_resources
      where facility_id = '7c5c828c-f95a-4c31-a5c7-1b338df86102'
        and code = 'COURT-1'
      limit 1
    ),
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'confirmed'::booking_status,
    '2026-03-29 17:00:00+00'::timestamptz,
    '2026-03-29 18:30:00+00'::timestamptz,
    4,
    35000,
    'MXN',
    10000,
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000004',
    '7c5c828c-f95a-4c31-a5c7-1b338df86102',
    (
      select id
      from facility_resources
      where facility_id = '7c5c828c-f95a-4c31-a5c7-1b338df86102'
        and code = 'COURT-1'
      limit 1
    ),
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'cancelled'::booking_status,
    '2026-03-30 13:30:00+00'::timestamptz,
    '2026-03-30 14:30:00+00'::timestamptz,
    4,
    20000,
    'MXN',
    0,
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000005',
    '7c5c828c-f95a-4c31-a5c7-1b338df86103',
    (
      select id
      from facility_resources
      where facility_id = '7c5c828c-f95a-4c31-a5c7-1b338df86103'
        and code = 'GYM-1'
      limit 1
    ),
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'confirmed'::booking_status,
    '2026-03-31 06:00:00+00'::timestamptz,
    '2026-03-31 07:00:00+00'::timestamptz,
    18,
    0,
    'MXN',
    0,
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000006',
    '7c5c828c-f95a-4c31-a5c7-1b338df86103',
    (
      select id
      from facility_resources
      where facility_id = '7c5c828c-f95a-4c31-a5c7-1b338df86103'
        and code = 'GYM-1'
      limit 1
    ),
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'pending'::booking_status,
    '2026-03-31 08:00:00+00'::timestamptz,
    '2026-03-31 09:00:00+00'::timestamptz,
    8,
    0,
    'MXN',
    0,
    now()
  )
on conflict (id) do update
set
  facility_id = excluded.facility_id,
  resource_id = excluded.resource_id,
  community_id = excluded.community_id,
  user_id = excluded.user_id,
  status = excluded.status,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  party_size = excluded.party_size,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  deposit_cents = excluded.deposit_cents;

-- 10) Supporting data for full Encino demo
insert into groups (id, community_id, name, created_at)
values
  ('8d4d2f16-1111-4bf2-8b0b-500000000101', '7c5c828c-f95a-4c31-a5c7-1b338df82001', 'Comite de Seguridad Encino', now()),
  ('8d4d2f16-1111-4bf2-8b0b-500000000102', '7c5c828c-f95a-4c31-a5c7-1b338df82001', 'Comite de Amenidades Encino', now())
on conflict (id) do update
set
  name = excluded.name,
  community_id = excluded.community_id;

insert into group_members (group_id, user_id, community_id)
values
  ('8d4d2f16-1111-4bf2-8b0b-500000000101', 'fa0402d5-cd9f-432c-940b-100587b88030', '7c5c828c-f95a-4c31-a5c7-1b338df82001'),
  ('8d4d2f16-1111-4bf2-8b0b-500000000101', '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001', '7c5c828c-f95a-4c31-a5c7-1b338df82001'),
  ('8d4d2f16-1111-4bf2-8b0b-500000000102', '3f9c153a-d8a1-4f10-b81a-ef08764f9575', '7c5c828c-f95a-4c31-a5c7-1b338df82001')
on conflict (group_id, user_id) do update
set
  community_id = excluded.community_id;

insert into announcements (id, community_id, title, body, status, audience, created_by, created_at)
values
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000201',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Bienvenida a Residencial Encino',
    'Nueva configuracion operativa con reglas de reservacion por amenidades y control de aforo.',
    'published',
    array['all'],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000202',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Calendario de mantenimiento de amenidades',
    'Consulta bloqueos programados para alberca, padel y gimnasio desde la app.',
    'published',
    array['all'],
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    now()
  )
on conflict (id) do update
set
  title = excluded.title,
  body = excluded.body,
  status = excluded.status,
  audience = excluded.audience,
  created_by = excluded.created_by;

insert into incidents (
  id,
  community_id,
  title,
  description,
  category,
  priority,
  status,
  location,
  created_by,
  assigned_to,
  created_at
)
values
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000301',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Sensor de caseta norte intermitente',
    'El sensor de la pluma vehicular presenta lecturas intermitentes durante la manana.',
    'Seguridad',
    'high'::incident_priority,
    'in_progress'::incident_status,
    'Caseta norte',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000302',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Revision de bomba de recirculacion alberca',
    'Se detecta variacion de presion en la linea principal de recirculacion.',
    'Mantenimiento',
    'medium'::incident_priority,
    'open'::incident_status,
    'Cuarto tecnico alberca',
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002',
    now()
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  priority = excluded.priority,
  status = excluded.status,
  location = excluded.location,
  created_by = excluded.created_by,
  assigned_to = excluded.assigned_to;

insert into incident_comments (id, incident_id, community_id, body, is_private, created_by, created_at)
values
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000311',
    '8d4d2f16-1111-4bf2-8b0b-500000000301',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Proveedor de acceso notificado para revision en sitio.',
    false,
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  )
on conflict (id) do update
set
  body = excluded.body,
  is_private = excluded.is_private,
  created_by = excluded.created_by;

insert into incident_timeline (id, incident_id, community_id, action, details, created_by, created_at)
values
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000321',
    '8d4d2f16-1111-4bf2-8b0b-500000000301',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'assigned',
    '{"assigned_to":"8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001","source":"admin"}'::jsonb,
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  )
on conflict (id) do update
set
  action = excluded.action,
  details = excluded.details,
  created_by = excluded.created_by;

insert into documents (id, community_id, folder, name, visibility, group_ids, created_by, created_at)
values
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000401',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Reglamentos',
    'Reglamento Residencial Encino 2026.pdf',
    'public'::document_visibility,
    '{}'::uuid[],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000402',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Comites',
    'Minuta comite amenidades Encino - Marzo.pdf',
    'group'::document_visibility,
    array['8d4d2f16-1111-4bf2-8b0b-500000000102'::uuid],
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    now()
  )
on conflict (id) do update
set
  folder = excluded.folder,
  name = excluded.name,
  visibility = excluded.visibility,
  group_ids = excluded.group_ids,
  created_by = excluded.created_by;

insert into drive_files (
  id,
  community_id,
  drive_file_id,
  drive_folder_id,
  file_name,
  mime_type,
  size_bytes,
  uploaded_by,
  linked_entity_type,
  linked_entity_id,
  created_at
)
values
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000411',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'drv-encino-reglamento-2026',
    'drv-encino-reglamentos',
    'Reglamento Residencial Encino 2026.pdf',
    'application/pdf',
    256300,
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'document',
    '8d4d2f16-1111-4bf2-8b0b-500000000401',
    now()
  )
on conflict (id) do update
set
  drive_file_id = excluded.drive_file_id,
  drive_folder_id = excluded.drive_folder_id,
  file_name = excluded.file_name,
  mime_type = excluded.mime_type,
  size_bytes = excluded.size_bytes,
  uploaded_by = excluded.uploaded_by,
  linked_entity_type = excluded.linked_entity_type,
  linked_entity_id = excluded.linked_entity_id;

insert into access_passes (
  id,
  community_id,
  created_by,
  type,
  label,
  token,
  qr_payload,
  status,
  valid_from,
  valid_until,
  max_uses,
  used_count,
  last_used_at,
  metadata,
  created_at
)
values
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000501',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'visitor'::access_pass_type,
    'Visita familiar Encino',
    'PASS-ENCINO-001',
    '{"token":"PASS-ENCINO-001","type":"visitor","community_id":"7c5c828c-f95a-4c31-a5c7-1b338df82001"}',
    'active'::access_pass_status,
    now(),
    '2026-12-31 23:59:59+00'::timestamptz,
    4,
    1,
    now(),
    '{"space":"caseta norte","vehicle":"ENC-1234"}'::jsonb,
    now()
  ),
  (
    '8d4d2f16-1111-4bf2-8b0b-500000000502',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'service'::access_pass_type,
    'Proveedor mantenimiento alberca',
    'PASS-ENCINO-002',
    '{"token":"PASS-ENCINO-002","type":"service","community_id":"7c5c828c-f95a-4c31-a5c7-1b338df82001"}',
    'active'::access_pass_status,
    now(),
    '2026-12-31 23:59:59+00'::timestamptz,
    20,
    2,
    now(),
    '{"provider":"PoolCare MX","contact":"support@binai.pro"}'::jsonb,
    now()
  )
on conflict (id) do update
set
  label = excluded.label,
  status = excluded.status,
  valid_from = excluded.valid_from,
  valid_until = excluded.valid_until,
  max_uses = excluded.max_uses,
  used_count = excluded.used_count,
  last_used_at = excluded.last_used_at,
  metadata = excluded.metadata;

insert into payments_stripe_events (id, community_id, type, payload, received_at)
values
  (
    'evt_demo_encino_0001',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'payment_intent.succeeded',
    '{"id":"pi_demo_encino_pool_001","amount":50000,"currency":"mxn","status":"succeeded"}'::jsonb,
    now()
  )
on conflict (id) do update
set
  type = excluded.type,
  payload = excluded.payload,
  community_id = excluded.community_id;

-- Normalize legacy labels that still mention CLA
update announcements
set title = replace(title, 'CLA', 'Encino')
where community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
  and title like '%CLA%';

update groups
set name = replace(name, 'CLA', 'Encino')
where community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
  and name like '%CLA%';

update documents
set name = replace(name, 'CLA', 'Encino')
where community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
  and name like '%CLA%';

update drive_files
set file_name = replace(file_name, 'CLA', 'Encino')
where community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001'
  and file_name like '%CLA%';
