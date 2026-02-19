# Cobertura Funcional (Next.js)

Estado actual del proyecto migrado a `Next.js` con prioridad en despliegue Vercel.

## Alcance por macro-modulo

| Modulo | Estado | Base tecnica actual | Pendiente clave |
|---|---|---|---|
| 1. Gestion operativa y mantenimiento | Parcial | `incidents`, `incident_comments`, `incident_timeline`, paginas `/app/incidents`, `/admin/incidents` | Asignacion avanzada (empleado/proveedor/aseguradora), bitacora de conserjeria, llaves fisicas |
| 2. Amenidades y reservas inteligentes | Parcial | `facilities`, `facility_blackouts`, `bookings`, paginas `/app/bookings`, `/admin/bookings` | Motor de reglas completo (ventanas, limites por propiedad, pre-reservas justas, aforo) |
| 3. Seguridad y accesos (IoT) | Parcial-alto | `access_passes`, APIs `/api/access/passes*`, UI `/app/passes`, control admin `/admin/access` | Integraciones IoT/LPR/RFID/BLE y registro de validacion en torniquetes/portones |
| 4. Finanzas y wallet comunitario | Parcial | `wallets`, `wallet_transactions`, APIs Stripe (`/api/stripe/*`), UI wallet (`/app/wallet`) | Estado financiero por propiedad, offline payments, presupuestos colaborativos completos |
| 5. Comunicacion y participacion vecinal | Parcial | `announcements`, `groups`, UI comunidad y placeholders de foro/encuestas/notificaciones | Push/email transaccional, mensajes directos, foro y encuestas con datos reales |
| 6. Documentacion y gestion digital | Parcial | `documents`, `drive_files`, APIs Drive (`/api/drive/*`) | Repositorios privados por vecino/grupo con permisos finos y visor enriquecido |
| 7. Procesos y automatizacion | Base | Estructura de pantallas (`/admin/procedures`) | Motor de workflows y automatizaciones por comunidad |
| 8. Propiedades y perfiles | Parcial | `communities`, `buildings`, `units`, `users`, `memberships` + RLS | Roles extendidos por vivienda, preferencias avanzadas, privacidad granular, API externa completa |

## Estado tecnico de plataforma

- Frontend activo: `Next.js app router` en `app/`.
- Backend app interno: routes en `app/src/app/api/*`.
- Base de datos: migraciones en `app/supabase/migrations/*`.
- Seguridad: RLS habilitado + politicas por membresia.
- Auth temporal: login local con cookie de sesion para `/app/*` y `/admin/*`.

## Secuencia recomendada

1. Endurecer autenticacion y sesion (migrar de login local a flujo real).
2. Conectar todos los modulos UI con Supabase real (no mock).
3. Completar reglas de negocio (reservas, accesos, pagos, auditoria).
4. Activar notificaciones push/email y trazabilidad completa.
5. Integraciones externas (IoT, ERP, API publica).
6. Hardening de produccion (observabilidad, rate limits, seguridad de secrets).

## Checklist MVP de salida

- Incidencias E2E con evidencia y timeline.
- Reservas E2E con reglas y bloqueos.
- Wallet + cobro Stripe + conciliacion basica.
- Avisos oficiales + historial.
- Documentos comunitarios con permisos.
- Acceso QR/token temporal y control admin de revocacion.
- Panel admin con metricas operativas minimas.
