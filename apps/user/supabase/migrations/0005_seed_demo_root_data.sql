-- Demo root data for Bisalom Hub (idempotent)
-- Requires: 0001..0004

-- Constants:
-- community: f7fd88d8-64bd-4fa1-b5a0-bf96038fef62
-- resident user: 3f9c153a-d8a1-4f10-b81a-ef08764f9575 (contacto@binai.pro)
-- admin user:    fa0402d5-cd9f-432c-940b-100587b88030 (support@binai.pro)

-- Buildings
insert into buildings (id, community_id, name, created_at)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Torre A',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Torre B',
    now()
  )
on conflict (id) do update
set
  name = excluded.name,
  community_id = excluded.community_id;

-- Units
insert into units (id, community_id, building_id, unit_code, owner_name, created_at)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac2001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    '29a6f26f-c825-4eb1-a42f-0f9584ac1001',
    'A-101',
    'Contacto BInAI',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac2002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    '29a6f26f-c825-4eb1-a42f-0f9584ac1001',
    'A-102',
    'Demo Residente',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac2003',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    '29a6f26f-c825-4eb1-a42f-0f9584ac1002',
    'B-201',
    'Demo Inversionista',
    now()
  )
on conflict (id) do update
set
  unit_code = excluded.unit_code,
  owner_name = excluded.owner_name,
  building_id = excluded.building_id,
  community_id = excluded.community_id;

-- Memberships (admin + resident)
insert into memberships (id, user_id, community_id, building_id, unit_id, role, created_at)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac2101',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    '29a6f26f-c825-4eb1-a42f-0f9584ac1001',
    null,
    'admin'::role_enum,
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac2102',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    '29a6f26f-c825-4eb1-a42f-0f9584ac1001',
    '29a6f26f-c825-4eb1-a42f-0f9584ac2001',
    'resident'::role_enum,
    now()
  )
on conflict (user_id, community_id, role) do update
set
  building_id = excluded.building_id,
  unit_id = excluded.unit_id;

-- Groups and members
insert into groups (id, community_id, name, created_at)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac3001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Comite de Seguridad',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac3002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Comite de Eventos',
    now()
  )
on conflict (id) do update
set
  name = excluded.name,
  community_id = excluded.community_id;

insert into group_members (group_id, user_id, community_id)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac3001',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62'
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac3002',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62'
  )
on conflict (group_id, user_id) do update
set
  community_id = excluded.community_id;

-- Facilities and blackouts
insert into facilities (id, community_id, name, type, location, status, created_at)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac4001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Piscina Principal',
    'Area Exterior',
    'Zona Central',
    'available',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac4002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Gimnasio',
    'Area Deportiva',
    'Sotano 1',
    'available',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac4003',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Salon Social',
    'Area Comun',
    'Planta Baja',
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

insert into facility_blackouts (id, facility_id, community_id, starts_at, ends_at, reason)
values (
  '29a6f26f-c825-4eb1-a42f-0f9584ac5001',
  '29a6f26f-c825-4eb1-a42f-0f9584ac4001',
  'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
  '2026-03-10 08:00:00+00'::timestamptz,
  '2026-03-10 14:00:00+00'::timestamptz,
  'Mantenimiento preventivo'
)
on conflict (id) do update
set
  facility_id = excluded.facility_id,
  community_id = excluded.community_id,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  reason = excluded.reason;

-- Bookings
insert into bookings (
  id,
  facility_id,
  community_id,
  user_id,
  status,
  starts_at,
  ends_at,
  price_cents,
  currency,
  deposit_cents,
  created_at
)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1201',
    '29a6f26f-c825-4eb1-a42f-0f9584ac4003',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'confirmed'::booking_status,
    '2026-03-15 20:00:00+00'::timestamptz,
    '2026-03-15 23:00:00+00'::timestamptz,
    120000,
    'MXN',
    30000,
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1202',
    '29a6f26f-c825-4eb1-a42f-0f9584ac4002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'pending'::booking_status,
    '2026-03-20 13:00:00+00'::timestamptz,
    '2026-03-20 14:00:00+00'::timestamptz,
    0,
    'MXN',
    0,
    now()
  )
on conflict (id) do update
set
  facility_id = excluded.facility_id,
  community_id = excluded.community_id,
  user_id = excluded.user_id,
  status = excluded.status,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  deposit_cents = excluded.deposit_cents;

-- Announcements
insert into announcements (id, community_id, title, body, status, audience, created_by, created_at)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac6001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Asamblea general mensual',
    'La asamblea se realizara el proximo jueves a las 19:00 en el salon social.',
    'published',
    array['all'],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac6002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Mantenimiento de elevador Torre A',
    'Se programo mantenimiento para el elevador principal el martes por la manana.',
    'published',
    array['tower-a'],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  )
on conflict (id) do update
set
  title = excluded.title,
  body = excluded.body,
  status = excluded.status,
  audience = excluded.audience,
  created_by = excluded.created_by;

-- Documents and Drive files
insert into documents (id, community_id, folder, name, visibility, group_ids, created_by, created_at)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac7001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Reglamentos',
    'Reglamento interno 2026.pdf',
    'public'::document_visibility,
    '{}'::uuid[],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac7002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Minutas',
    'Minuta comite de seguridad - Febrero.pdf',
    'group'::document_visibility,
    array['29a6f26f-c825-4eb1-a42f-0f9584ac3001'::uuid],
    'fa0402d5-cd9f-432c-940b-100587b88030',
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
    '29a6f26f-c825-4eb1-a42f-0f9584ac8001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'drv-demo-reglamento-2026',
    'drv-folder-reglamentos',
    'Reglamento interno 2026.pdf',
    'application/pdf',
    245760,
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'document',
    '29a6f26f-c825-4eb1-a42f-0f9584ac7001',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac8002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'drv-demo-minuta-seguridad-feb',
    'drv-folder-minutas',
    'Minuta comite de seguridad - Febrero.pdf',
    'application/pdf',
    198112,
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'document',
    '29a6f26f-c825-4eb1-a42f-0f9584ac7002',
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

-- Incidents + comments + timeline
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
    '29a6f26f-c825-4eb1-a42f-0f9584ac9001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Elevador detenido en Torre A',
    'El elevador principal se detuvo entre pisos y emitio alarma.',
    'Mantenimiento',
    'high'::incident_priority,
    'in_progress'::incident_status,
    'Torre A - Lobby',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac9002',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Luminaria fundida en pasillo B',
    'La luminaria del piso 2 en Torre B no enciende.',
    'Mantenimiento',
    'medium'::incident_priority,
    'open'::incident_status,
    'Torre B - Piso 2',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'fa0402d5-cd9f-432c-940b-100587b88030',
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
    '29a6f26f-c825-4eb1-a42f-0f9584ac9101',
    '29a6f26f-c825-4eb1-a42f-0f9584ac9001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Se contacto al proveedor de mantenimiento y esta en camino.',
    false,
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac9102',
    '29a6f26f-c825-4eb1-a42f-0f9584ac9001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'Gracias por la atencion, quedamos pendientes.',
    false,
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
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
    '29a6f26f-c825-4eb1-a42f-0f9584ac9201',
    '29a6f26f-c825-4eb1-a42f-0f9584ac9001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'created',
    '{"source":"app","channel":"resident"}'::jsonb,
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac9202',
    '29a6f26f-c825-4eb1-a42f-0f9584ac9001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'assigned',
    '{"assigned_to":"fa0402d5-cd9f-432c-940b-100587b88030"}'::jsonb,
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac9203',
    '29a6f26f-c825-4eb1-a42f-0f9584ac9001',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'status_changed',
    '{"from":"open","to":"in_progress"}'::jsonb,
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  )
on conflict (id) do update
set
  action = excluded.action,
  details = excluded.details,
  created_by = excluded.created_by;

-- Wallets + wallet transactions
insert into wallets (id, user_id, community_id, balance_cents)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1101',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    155000
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1102',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    0
  )
on conflict (user_id, community_id) do update
set
  balance_cents = excluded.balance_cents;

insert into wallet_transactions (
  id,
  wallet_id,
  community_id,
  type,
  amount_cents,
  currency,
  status,
  payment_intent_id,
  description,
  metadata,
  created_at
)
values
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1401',
    (select id from wallets where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575' and community_id = 'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62' limit 1),
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'topup'::wallet_tx_type,
    200000,
    'MXN',
    'succeeded',
    'pi_demo_topup_001',
    'Recarga inicial de demo',
    '{"source":"demo-seed"}'::jsonb,
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1402',
    (select id from wallets where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575' and community_id = 'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62' limit 1),
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'payment'::wallet_tx_type,
    45000,
    'MXN',
    'succeeded',
    'pi_demo_booking_001',
    'Pago de reserva de salon social',
    '{"booking_id":"29a6f26f-c825-4eb1-a42f-0f9584ac1201"}'::jsonb,
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1403',
    (select id from wallets where user_id = 'fa0402d5-cd9f-432c-940b-100587b88030' and community_id = 'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62' limit 1),
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'deposit'::wallet_tx_type,
    30000,
    'MXN',
    'succeeded',
    null,
    'Deposito de garantia administrativo',
    '{"source":"demo-seed"}'::jsonb,
    now()
  )
on conflict (id) do update
set
  wallet_id = excluded.wallet_id,
  type = excluded.type,
  amount_cents = excluded.amount_cents,
  status = excluded.status,
  description = excluded.description,
  metadata = excluded.metadata;

-- Access passes
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
    '29a6f26f-c825-4eb1-a42f-0f9584ac1301',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'visitor'::access_pass_type,
    'Visita familiar Rivera',
    'PASS-BISALOM-001',
    '{"token":"PASS-BISALOM-001","type":"visitor","community_id":"f7fd88d8-64bd-4fa1-b5a0-bf96038fef62"}',
    'active'::access_pass_status,
    now(),
    '2026-12-31 23:59:59+00'::timestamptz,
    3,
    1,
    now(),
    '{"vehicle_plate":"ABC1234","note":"Demo pass"}'::jsonb,
    now()
  ),
  (
    '29a6f26f-c825-4eb1-a42f-0f9584ac1302',
    'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'service'::access_pass_type,
    'Mantenimiento elevador',
    'PASS-BISALOM-002',
    '{"token":"PASS-BISALOM-002","type":"service","community_id":"f7fd88d8-64bd-4fa1-b5a0-bf96038fef62"}',
    'active'::access_pass_status,
    now(),
    '2026-12-31 23:59:59+00'::timestamptz,
    10,
    0,
    null,
    '{"provider":"LiftCo","contact":"support@binai.pro"}'::jsonb,
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

-- Stripe events demo
insert into payments_stripe_events (id, community_id, type, payload, received_at)
values (
  'evt_demo_0001',
  'f7fd88d8-64bd-4fa1-b5a0-bf96038fef62',
  'payment_intent.succeeded',
  '{"id":"pi_demo_booking_001","amount":45000,"currency":"mxn","status":"succeeded"}'::jsonb,
  now()
)
on conflict (id) do update
set
  type = excluded.type,
  payload = excluded.payload,
  community_id = excluded.community_id;
