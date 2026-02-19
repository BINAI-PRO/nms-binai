-- Core enums
create type role_enum as enum ('resident', 'admin', 'staff', 'supplier');
create type incident_status as enum ('open', 'acknowledged', 'in_progress', 'waiting', 'resolved', 'closed');
create type incident_priority as enum ('low', 'medium', 'high', 'critical');
create type booking_status as enum ('pending', 'confirmed', 'cancelled');
create type wallet_tx_type as enum ('payment', 'topup', 'refund', 'deposit');
create type document_visibility as enum ('public', 'private', 'group');

-- Tenancy backbone
create table communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text default 'America/Mexico_City',
  created_at timestamptz default now()
);

create table buildings (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table units (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  building_id uuid references buildings(id) on delete set null,
  unit_code text not null,
  owner_name text,
  created_at timestamptz default now()
);

-- User + membership
create table users (
  id uuid primary key,
  email text unique not null,
  full_name text,
  created_at timestamptz default now()
);

alter table users enable row level security;
create policy users_self on users for select using (auth.uid() = id);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  building_id uuid references buildings(id) on delete set null,
  unit_id uuid references units(id) on delete set null,
  role role_enum not null default 'resident',
  created_at timestamptz default now(),
  unique (user_id, community_id, role)
);

-- Announcements & documents
create table announcements (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  title text not null,
  body text,
  status text default 'published',
  audience text[] default '{}',
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  folder text,
  name text not null,
  visibility document_visibility not null default 'private',
  group_ids uuid[] default '{}',
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table drive_files (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  drive_file_id text not null,
  drive_folder_id text,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint,
  uploaded_by uuid references users(id),
  linked_entity_type text,
  linked_entity_id uuid,
  created_at timestamptz default now()
);

-- Incidents
create table incidents (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  title text not null,
  description text,
  category text,
  priority incident_priority default 'medium',
  status incident_status default 'open',
  location text,
  created_by uuid references users(id),
  assigned_to uuid references users(id),
  created_at timestamptz default now()
);

create table incident_comments (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references incidents(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  body text not null,
  is_private boolean default false,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table incident_timeline (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references incidents(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  action text not null,
  details jsonb,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

-- Facilities & bookings
create table facilities (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  name text not null,
  type text,
  location text,
  status text default 'available',
  created_at timestamptz default now()
);

create table facility_blackouts (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  user_id uuid not null references users(id),
  status booking_status default 'pending',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  price_cents integer default 0,
  currency text default 'MXN',
  deposit_cents integer default 0,
  created_at timestamptz default now()
);

-- Wallet & payments
create table wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  balance_cents integer default 0,
  unique (user_id, community_id)
);

create table wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references wallets(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  type wallet_tx_type not null,
  amount_cents integer not null,
  currency text default 'MXN',
  status text default 'pending',
  payment_intent_id text,
  description text,
  metadata jsonb,
  created_at timestamptz default now()
);

create table payments_stripe_events (
  id text primary key,
  community_id uuid,
  type text not null,
  payload jsonb not null,
  received_at timestamptz default now()
);

-- Groups and forums (lightweight)
create table groups (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  community_id uuid not null references communities(id) on delete cascade,
  primary key (group_id, user_id)
);

-- RLS helpers
alter table communities enable row level security;
alter table buildings enable row level security;
alter table units enable row level security;
alter table announcements enable row level security;
alter table documents enable row level security;
alter table drive_files enable row level security;
alter table incidents enable row level security;
alter table incident_comments enable row level security;
alter table incident_timeline enable row level security;
alter table facilities enable row level security;
alter table facility_blackouts enable row level security;
alter table bookings enable row level security;
alter table wallets enable row level security;
alter table wallet_transactions enable row level security;
alter table payments_stripe_events enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;

-- Membership-based access
create or replace view current_memberships as
select m.*, u.email
from memberships m
join users u on u.id = m.user_id
where m.user_id = auth.uid();

-- Policies
create policy communities_select on communities for select using (
  exists (
    select 1
    from memberships m
    where m.user_id = auth.uid()
      and m.community_id = communities.id
  )
);

do $$
declare
  tables text[] := array[
    'buildings','units','announcements','documents','drive_files',
    'incidents','incident_comments','incident_timeline',
    'facilities','facility_blackouts','bookings',
    'wallets','wallet_transactions','payments_stripe_events',
    'groups','group_members'
  ];
  t text;
begin
  foreach t in array tables loop
    execute format('create policy "%s_select" on %I for select using (exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = %I.community_id));', t, t, t);
  end loop;
end $$;

-- Write policies: residents can insert their own scoped rows
create policy incidents_insert on incidents for insert with check (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = incidents.community_id)
);

create policy incidents_update_admin on incidents for update using (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = incidents.community_id and m.role in ('admin','staff'))
);

create policy incident_comments_insert on incident_comments for insert with check (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = incident_comments.community_id)
);

create policy bookings_insert on bookings for insert with check (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = bookings.community_id)
);

create policy bookings_update_owner on bookings for update using (
  bookings.user_id = auth.uid()
) with check (
  bookings.user_id = auth.uid()
);

create policy bookings_update_admin on bookings for update using (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = bookings.community_id and m.role in ('admin','staff'))
);

create policy wallets_insert on wallets for insert with check (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = wallets.community_id)
);

create policy wallet_tx_insert on wallet_transactions for insert with check (
  exists (select 1 from wallets w where w.id = wallet_transactions.wallet_id and w.user_id = auth.uid())
);

create policy wallet_tx_update_admin on wallet_transactions for update using (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = wallet_transactions.community_id and m.role in ('admin','staff'))
);

create policy documents_insert on documents for insert with check (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = documents.community_id)
);

create policy drive_files_insert on drive_files for insert with check (
  exists (select 1 from memberships m where m.user_id = auth.uid() and m.community_id = drive_files.community_id)
);

-- Audit table for Stripe events: allow service role only
create policy stripe_events_service on payments_stripe_events for insert with check (auth.role() = 'service_role');

-- Helpers
create index on memberships (user_id, community_id);
create index on incidents (community_id, status);
create index on bookings (community_id, facility_id, starts_at);
create index on wallet_transactions (community_id, wallet_id, created_at);
