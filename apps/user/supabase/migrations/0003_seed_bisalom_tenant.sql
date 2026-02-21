-- Seed community for Bisalom tenant (idempotent)
insert into communities (id, name, timezone, created_at)
values (
  'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
  'Bisalom Hub',
  'America/Mexico_City',
  now()
)
on conflict (id) do update
set
  name = excluded.name,
  timezone = excluded.timezone;
