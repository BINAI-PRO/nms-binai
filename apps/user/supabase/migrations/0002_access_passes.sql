create type access_pass_type as enum ('visitor', 'service');
create type access_pass_status as enum ('active', 'revoked', 'expired', 'used_up');

create table access_passes (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  created_by uuid references users(id) on delete set null,
  type access_pass_type not null,
  label text not null,
  token text not null unique,
  qr_payload text not null,
  status access_pass_status not null default 'active',
  valid_from timestamptz not null default now(),
  valid_until timestamptz not null,
  max_uses integer not null default 1,
  used_count integer not null default 0,
  last_used_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint access_passes_validity_check check (valid_until > valid_from),
  constraint access_passes_usage_check check (max_uses > 0 and used_count >= 0)
);

alter table access_passes enable row level security;

create policy access_passes_select on access_passes for select using (
  exists (
    select 1
    from memberships m
    where m.user_id = auth.uid()
      and m.community_id = access_passes.community_id
  )
);

create policy access_passes_insert on access_passes for insert with check (
  exists (
    select 1
    from memberships m
    where m.user_id = auth.uid()
      and m.community_id = access_passes.community_id
  )
);

create policy access_passes_update_admin on access_passes for update using (
  exists (
    select 1
    from memberships m
    where m.user_id = auth.uid()
      and m.community_id = access_passes.community_id
      and m.role in ('admin', 'staff')
  )
);

create index access_passes_community_status_idx on access_passes (community_id, status);
create index access_passes_community_valid_until_idx on access_passes (community_id, valid_until);
