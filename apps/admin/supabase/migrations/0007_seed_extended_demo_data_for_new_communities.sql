-- Extends demo root data for the new Bisalom communities (idempotent)
-- Requires: 0001..0006

-- Constants:
-- country community: 7c5c828c-f95a-4c31-a5c7-1b338df82001
-- valle community:   7c5c828c-f95a-4c31-a5c7-1b338df82002
-- resident user:     3f9c153a-d8a1-4f10-b81a-ef08764f9575 (contacto@binai.pro)
-- admin user:        fa0402d5-cd9f-432c-940b-100587b88030 (support@binai.pro)
-- staff user:        8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001
-- supplier user:     8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002

-- 1) Extra demo users (non-auth demo actors)
insert into users (id, email, full_name, created_at)
values
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    'staff.demo@binai.pro',
    'Staff Demo Bisalom',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002',
    'supplier.demo@binai.pro',
    'Supplier Demo Bisalom',
    now()
  )
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name;

-- 2) Memberships for staff/supplier in both communities
insert into memberships (id, user_id, community_id, role, created_at)
values
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5101',
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'staff'::role_enum,
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5102',
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'staff'::role_enum,
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5103',
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'supplier'::role_enum,
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5104',
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'supplier'::role_enum,
    now()
  )
on conflict (user_id, community_id, role) do nothing;

-- 3) Groups + group members
insert into groups (id, community_id, name, created_at)
values
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6001',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Comite Seguridad CLA',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6002',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Comite Eventos CLA',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6003',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'Comite Seguridad VLS',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6004',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'Comite Deportes VLS',
    now()
  )
on conflict (id) do update
set
  name = excluded.name,
  community_id = excluded.community_id;

insert into group_members (group_id, user_id, community_id)
values
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6001','fa0402d5-cd9f-432c-940b-100587b88030','7c5c828c-f95a-4c31-a5c7-1b338df82001'),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6001','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001','7c5c828c-f95a-4c31-a5c7-1b338df82001'),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6002','3f9c153a-d8a1-4f10-b81a-ef08764f9575','7c5c828c-f95a-4c31-a5c7-1b338df82001'),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6003','fa0402d5-cd9f-432c-940b-100587b88030','7c5c828c-f95a-4c31-a5c7-1b338df82002'),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6003','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001','7c5c828c-f95a-4c31-a5c7-1b338df82002'),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6004','3f9c153a-d8a1-4f10-b81a-ef08764f9575','7c5c828c-f95a-4c31-a5c7-1b338df82002')
on conflict (group_id, user_id) do update
set
  community_id = excluded.community_id;

-- 4) Announcements
insert into announcements (id, community_id, title, body, status, audience, created_by, created_at)
values
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6101',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Junta vecinal CLA',
    'Junta general el jueves 20:00 en Casa Club Lomas.',
    'published',
    array['all'],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6102',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Mantenimiento alberca CLA',
    'La alberca familiar estara cerrada por limpieza profunda.',
    'published',
    array['amenities'],
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6103',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'Asamblea mensual VLS',
    'Se revisara presupuesto de seguridad y mejoras de amenidades.',
    'published',
    array['all'],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6104',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'Gimnasio VLS horario extendido',
    'Durante marzo el gimnasio operara 24/7 con acceso por QR.',
    'published',
    array['residentes'],
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

-- 5) Documents + Drive files
insert into documents (id, community_id, folder, name, visibility, group_ids, created_by, created_at)
values
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6201',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Reglamentos',
    'Reglamento CLA 2026.pdf',
    'public'::document_visibility,
    '{}'::uuid[],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6202',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Administracion',
    'Contrato proveedor jardineria CLA.pdf',
    'private'::document_visibility,
    '{}'::uuid[],
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6203',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'Comites',
    'Minuta seguridad CLA - Febrero.pdf',
    'group'::document_visibility,
    array['8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6001'::uuid],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6204',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'Reglamentos',
    'Reglamento VLS 2026.pdf',
    'public'::document_visibility,
    '{}'::uuid[],
    'fa0402d5-cd9f-432c-940b-100587b88030',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6205',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'Administracion',
    'Poliza mantenimiento VLS.pdf',
    'private'::document_visibility,
    '{}'::uuid[],
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6206',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'Comites',
    'Minuta deportes VLS - Febrero.pdf',
    'group'::document_visibility,
    array['8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6004'::uuid],
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
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6301','7c5c828c-f95a-4c31-a5c7-1b338df82001','drv-cla-reglamento-2026','drv-cla-reglamentos','Reglamento CLA 2026.pdf','application/pdf',255110,'fa0402d5-cd9f-432c-940b-100587b88030','document','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6201',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6302','7c5c828c-f95a-4c31-a5c7-1b338df82001','drv-cla-contrato-jardineria','drv-cla-admin','Contrato proveedor jardineria CLA.pdf','application/pdf',188020,'8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001','document','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6202',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6303','7c5c828c-f95a-4c31-a5c7-1b338df82001','drv-cla-minuta-seguridad-feb','drv-cla-comites','Minuta seguridad CLA - Febrero.pdf','application/pdf',163840,'fa0402d5-cd9f-432c-940b-100587b88030','document','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6203',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6304','7c5c828c-f95a-4c31-a5c7-1b338df82002','drv-vls-reglamento-2026','drv-vls-reglamentos','Reglamento VLS 2026.pdf','application/pdf',261230,'fa0402d5-cd9f-432c-940b-100587b88030','document','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6204',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6305','7c5c828c-f95a-4c31-a5c7-1b338df82002','drv-vls-poliza-mantenimiento','drv-vls-admin','Poliza mantenimiento VLS.pdf','application/pdf',192560,'8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001','document','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6205',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6306','7c5c828c-f95a-4c31-a5c7-1b338df82002','drv-vls-minuta-deportes-feb','drv-vls-comites','Minuta deportes VLS - Febrero.pdf','application/pdf',156780,'fa0402d5-cd9f-432c-940b-100587b88030','document','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6206',now())
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

-- 6) Bookings (covering pending/confirmed/cancelled)
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
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6401','7c5c828c-f95a-4c31-a5c7-1b338df86001','7c5c828c-f95a-4c31-a5c7-1b338df82001','3f9c153a-d8a1-4f10-b81a-ef08764f9575','confirmed'::booking_status,'2026-04-05 20:00:00+00'::timestamptz,'2026-04-06 01:00:00+00'::timestamptz,150000,'MXN',50000,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6402','7c5c828c-f95a-4c31-a5c7-1b338df86002','7c5c828c-f95a-4c31-a5c7-1b338df82001','3f9c153a-d8a1-4f10-b81a-ef08764f9575','pending'::booking_status,'2026-04-12 13:00:00+00'::timestamptz,'2026-04-12 15:00:00+00'::timestamptz,0,'MXN',0,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6403','7c5c828c-f95a-4c31-a5c7-1b338df86003','7c5c828c-f95a-4c31-a5c7-1b338df82001','3f9c153a-d8a1-4f10-b81a-ef08764f9575','cancelled'::booking_status,'2026-04-18 19:00:00+00'::timestamptz,'2026-04-18 21:00:00+00'::timestamptz,35000,'MXN',0,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6404','7c5c828c-f95a-4c31-a5c7-1b338df86008','7c5c828c-f95a-4c31-a5c7-1b338df82002','3f9c153a-d8a1-4f10-b81a-ef08764f9575','confirmed'::booking_status,'2026-04-07 21:00:00+00'::timestamptz,'2026-04-08 00:00:00+00'::timestamptz,110000,'MXN',25000,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6405','7c5c828c-f95a-4c31-a5c7-1b338df86006','7c5c828c-f95a-4c31-a5c7-1b338df82002','3f9c153a-d8a1-4f10-b81a-ef08764f9575','pending'::booking_status,'2026-04-15 14:00:00+00'::timestamptz,'2026-04-15 16:00:00+00'::timestamptz,0,'MXN',0,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6406','7c5c828c-f95a-4c31-a5c7-1b338df86007','7c5c828c-f95a-4c31-a5c7-1b338df82002','3f9c153a-d8a1-4f10-b81a-ef08764f9575','cancelled'::booking_status,'2026-04-20 10:00:00+00'::timestamptz,'2026-04-20 11:30:00+00'::timestamptz,20000,'MXN',0,now())
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

-- 7) Incidents + comments + timeline
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
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6501','7c5c828c-f95a-4c31-a5c7-1b338df82001','Puerta vehicular no abre','La pluma de acceso principal tarda en responder.','Seguridad','high'::incident_priority,'acknowledged'::incident_status,'Acceso principal CLA','3f9c153a-d8a1-4f10-b81a-ef08764f9575','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6502','7c5c828c-f95a-4c31-a5c7-1b338df82001','Riego jardin fuera de horario','Se detecto riego nocturno excesivo en jardin norte.','Servicios','medium'::incident_priority,'waiting'::incident_status,'Jardin norte CLA','fa0402d5-cd9f-432c-940b-100587b88030','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6503','7c5c828c-f95a-4c31-a5c7-1b338df82002','Iluminacion tenue en andador','Varias luminarias presentan baja intensidad.','Mantenimiento','low'::incident_priority,'open'::incident_status,'Andador oriente VLS','3f9c153a-d8a1-4f10-b81a-ef08764f9575','fa0402d5-cd9f-432c-940b-100587b88030',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6504','7c5c828c-f95a-4c31-a5c7-1b338df82002','Fuga en cuarto de bombas','Se reparo una fuga menor en la instalacion principal.','Mantenimiento','critical'::incident_priority,'resolved'::incident_status,'Cuarto tecnico VLS','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002',now())
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
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6511','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6501','7c5c828c-f95a-4c31-a5c7-1b338df82001','Se levanto ticket con proveedor de acceso.',false,'8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6512','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6502','7c5c828c-f95a-4c31-a5c7-1b338df82001','Nota interna: validar programador de riego.',true,'fa0402d5-cd9f-432c-940b-100587b88030',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6513','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6503','7c5c828c-f95a-4c31-a5c7-1b338df82002','Se solicitara reemplazo de focos LED.',false,'fa0402d5-cd9f-432c-940b-100587b88030',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6514','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6504','7c5c828c-f95a-4c31-a5c7-1b338df82002','Trabajo concluido y validado por proveedor.',false,'8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002',now())
on conflict (id) do update
set
  body = excluded.body,
  is_private = excluded.is_private,
  created_by = excluded.created_by;

insert into incident_timeline (id, incident_id, community_id, action, details, created_by, created_at)
values
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6521','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6501','7c5c828c-f95a-4c31-a5c7-1b338df82001','created','{"source":"app","channel":"resident"}'::jsonb,'3f9c153a-d8a1-4f10-b81a-ef08764f9575',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6522','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6501','7c5c828c-f95a-4c31-a5c7-1b338df82001','assigned','{"assigned_to":"8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001"}'::jsonb,'fa0402d5-cd9f-432c-940b-100587b88030',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6523','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6501','7c5c828c-f95a-4c31-a5c7-1b338df82001','status_changed','{"from":"open","to":"acknowledged"}'::jsonb,'8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6524','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6504','7c5c828c-f95a-4c31-a5c7-1b338df82002','created','{"source":"staff-console","channel":"ops"}'::jsonb,'8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6525','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6504','7c5c828c-f95a-4c31-a5c7-1b338df82002','assigned','{"assigned_to":"8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002"}'::jsonb,'8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001',now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6526','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6504','7c5c828c-f95a-4c31-a5c7-1b338df82002','resolved','{"resolution":"replacement-completed"}'::jsonb,'8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002',now())
on conflict (id) do update
set
  action = excluded.action,
  details = excluded.details,
  created_by = excluded.created_by;

-- 8) Wallets + wallet transactions
insert into wallets (id, user_id, community_id, balance_cents)
values
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6601','3f9c153a-d8a1-4f10-b81a-ef08764f9575','7c5c828c-f95a-4c31-a5c7-1b338df82001',220000),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6602','fa0402d5-cd9f-432c-940b-100587b88030','7c5c828c-f95a-4c31-a5c7-1b338df82001',15000),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6603','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001','7c5c828c-f95a-4c31-a5c7-1b338df82001',5000),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6604','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002','7c5c828c-f95a-4c31-a5c7-1b338df82001',0),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6605','3f9c153a-d8a1-4f10-b81a-ef08764f9575','7c5c828c-f95a-4c31-a5c7-1b338df82002',190000),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6606','fa0402d5-cd9f-432c-940b-100587b88030','7c5c828c-f95a-4c31-a5c7-1b338df82002',25000),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6607','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001','7c5c828c-f95a-4c31-a5c7-1b338df82002',12000),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6608','8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002','7c5c828c-f95a-4c31-a5c7-1b338df82002',3000)
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
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6701',(select id from wallets where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575' and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001' limit 1),'7c5c828c-f95a-4c31-a5c7-1b338df82001','topup'::wallet_tx_type,250000,'MXN','succeeded','pi_demo_cla_topup_001','Recarga inicial CLA','{"source":"demo-seed"}'::jsonb,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6702',(select id from wallets where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575' and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001' limit 1),'7c5c828c-f95a-4c31-a5c7-1b338df82001','payment'::wallet_tx_type,50000,'MXN','succeeded','pi_demo_cla_booking_001','Pago reserva Casa Club CLA','{"booking_id":"8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6401"}'::jsonb,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6703',(select id from wallets where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575' and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001' limit 1),'7c5c828c-f95a-4c31-a5c7-1b338df82001','refund'::wallet_tx_type,10000,'MXN','succeeded',null,'Reembolso parcial cancelacion','{"booking_id":"8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6403"}'::jsonb,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6704',(select id from wallets where user_id = 'fa0402d5-cd9f-432c-940b-100587b88030' and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82001' limit 1),'7c5c828c-f95a-4c31-a5c7-1b338df82001','deposit'::wallet_tx_type,15000,'MXN','succeeded',null,'Deposito operativo CLA','{"source":"demo-seed"}'::jsonb,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6705',(select id from wallets where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575' and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82002' limit 1),'7c5c828c-f95a-4c31-a5c7-1b338df82002','topup'::wallet_tx_type,200000,'MXN','succeeded','pi_demo_vls_topup_001','Recarga inicial VLS','{"source":"demo-seed"}'::jsonb,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6706',(select id from wallets where user_id = '3f9c153a-d8a1-4f10-b81a-ef08764f9575' and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82002' limit 1),'7c5c828c-f95a-4c31-a5c7-1b338df82002','payment'::wallet_tx_type,45000,'MXN','succeeded','pi_demo_vls_booking_001','Pago reserva salon VLS','{"booking_id":"8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6404"}'::jsonb,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6707',(select id from wallets where user_id = '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5001' and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82002' limit 1),'7c5c828c-f95a-4c31-a5c7-1b338df82002','deposit'::wallet_tx_type,12000,'MXN','succeeded',null,'Deposito caja chica staff VLS','{"source":"demo-seed"}'::jsonb,now()),
  ('8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6708',(select id from wallets where user_id = '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f5002' and community_id = '7c5c828c-f95a-4c31-a5c7-1b338df82002' limit 1),'7c5c828c-f95a-4c31-a5c7-1b338df82002','refund'::wallet_tx_type,5000,'MXN','succeeded',null,'Reembolso proveedor VLS','{"source":"ops"}'::jsonb,now())
on conflict (id) do update
set
  wallet_id = excluded.wallet_id,
  type = excluded.type,
  amount_cents = excluded.amount_cents,
  status = excluded.status,
  description = excluded.description,
  metadata = excluded.metadata;

-- 9) Access passes (cover active/revoked/expired/used_up)
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
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6801',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'visitor'::access_pass_type,
    'Visita familiar CLA',
    'PASS-CLA-001',
    '{"token":"PASS-CLA-001","type":"visitor","community_id":"7c5c828c-f95a-4c31-a5c7-1b338df82001"}',
    'active'::access_pass_status,
    now(),
    '2026-12-31 23:59:59+00'::timestamptz,
    4,
    1,
    now(),
    '{"vehicle_plate":"CLA123","note":"Demo active pass"}'::jsonb,
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6802',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'service'::access_pass_type,
    'Proveedor jardineria CLA',
    'PASS-CLA-002',
    '{"token":"PASS-CLA-002","type":"service","community_id":"7c5c828c-f95a-4c31-a5c7-1b338df82001"}',
    'revoked'::access_pass_status,
    '2026-02-01 08:00:00+00'::timestamptz,
    '2026-12-31 23:59:59+00'::timestamptz,
    20,
    3,
    '2026-02-21 10:00:00+00'::timestamptz,
    '{"provider":"GreenPro","reason":"Credential replacement"}'::jsonb,
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6803',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    '3f9c153a-d8a1-4f10-b81a-ef08764f9575',
    'visitor'::access_pass_type,
    'Visita evento VLS',
    'PASS-VLS-001',
    '{"token":"PASS-VLS-001","type":"visitor","community_id":"7c5c828c-f95a-4c31-a5c7-1b338df82002"}',
    'used_up'::access_pass_status,
    '2026-02-05 08:00:00+00'::timestamptz,
    '2026-12-31 23:59:59+00'::timestamptz,
    1,
    1,
    '2026-02-05 12:00:00+00'::timestamptz,
    '{"event":"Cumpleanos","note":"Single use consumed"}'::jsonb,
    now()
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6804',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'fa0402d5-cd9f-432c-940b-100587b88030',
    'service'::access_pass_type,
    'Mantenimiento bombas VLS',
    'PASS-VLS-002',
    '{"token":"PASS-VLS-002","type":"service","community_id":"7c5c828c-f95a-4c31-a5c7-1b338df82002"}',
    'expired'::access_pass_status,
    '2026-01-01 08:00:00+00'::timestamptz,
    '2026-01-31 23:59:59+00'::timestamptz,
    30,
    7,
    '2026-01-30 14:30:00+00'::timestamptz,
    '{"provider":"PumpCare","note":"Expired at end of January"}'::jsonb,
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

-- 10) Extra blackout windows
insert into facility_blackouts (id, facility_id, community_id, starts_at, ends_at, reason)
values
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6901',
    '7c5c828c-f95a-4c31-a5c7-1b338df86002',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    '2026-04-10 06:00:00+00'::timestamptz,
    '2026-04-10 12:00:00+00'::timestamptz,
    'Limpieza profunda de alberca'
  ),
  (
    '8a7b1d1c-4f5e-4b11-9f3a-1c2d3e4f6902',
    '7c5c828c-f95a-4c31-a5c7-1b338df86008',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    '2026-04-11 14:00:00+00'::timestamptz,
    '2026-04-11 22:00:00+00'::timestamptz,
    'Evento privado de mantenimiento'
  )
on conflict (id) do update
set
  facility_id = excluded.facility_id,
  community_id = excluded.community_id,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  reason = excluded.reason;

-- 11) Stripe event log demo
insert into payments_stripe_events (id, community_id, type, payload, received_at)
values
  (
    'evt_demo_cla_0001',
    '7c5c828c-f95a-4c31-a5c7-1b338df82001',
    'payment_intent.succeeded',
    '{"id":"pi_demo_cla_booking_001","amount":50000,"currency":"mxn","status":"succeeded"}'::jsonb,
    now()
  ),
  (
    'evt_demo_vls_0001',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'payment_intent.succeeded',
    '{"id":"pi_demo_vls_booking_001","amount":45000,"currency":"mxn","status":"succeeded"}'::jsonb,
    now()
  ),
  (
    'evt_demo_vls_0002',
    '7c5c828c-f95a-4c31-a5c7-1b338df82002',
    'charge.refunded',
    '{"id":"ch_demo_vls_refund_001","amount_refunded":5000,"currency":"mxn"}'::jsonb,
    now()
  )
on conflict (id) do update
set
  type = excluded.type,
  payload = excluded.payload,
  community_id = excluded.community_id;

