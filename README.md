# BInAI Community OS (Next.js)

Plataforma para comunidad residencial en `Next.js` con:
- app de residentes (`/app/*`)
- panel admin (`/admin/*`)
- APIs internas (auth local, accesos QR, Stripe, Drive, auth bridge)
- modelo de datos Supabase

La app activa vive en `app/`.

## Correr en local

Requisitos:
- Node.js 20+
- npm 10+

Comandos:
```bash
npm run install:app
npm run dev
```

Rutas:
- `http://127.0.0.1:3000/sign-in`
- `http://127.0.0.1:3000/app/home`
- `http://127.0.0.1:3000/admin/dashboard`

## Login simple (temporal)

Se habilito login local por `usuario/password`:
- API: `POST /api/auth/local-login`
- Logout: `POST /api/auth/local-logout`
- Cookies: `binai_session`, `binai_role`, `binai_user`
- Middleware protege `/app/*` y `/admin/*`

Credenciales configurables en `app/.env.local`:
- `LOCAL_ADMIN_USER` / `LOCAL_ADMIN_PASS`
- `LOCAL_RESIDENT_USER` / `LOCAL_RESIDENT_PASS`

## Modulo de accesos QR/token

Incluye:
- Generacion de pases para `visitor` y `service` desde `app/passes`
- Token + QR
- Historial de pases
- Control admin para revocar/reactivar desde `admin/access`

APIs:
- `GET /api/access/passes`
- `POST /api/access/passes`
- `PATCH /api/access/passes/[id]`

## Migraciones Supabase

Ejecutar en orden:
1. `app/supabase/migrations/0001_init.sql`
2. `app/supabase/migrations/0002_access_passes.sql`

## Produccion local

```bash
npm run build
npm run start
```

## Deploy en Vercel

1. Importar repo en Vercel.
2. Configurar `Root Directory = app`.
3. Cargar variables de `app/.env.local` en Vercel.
4. Deploy.

## Cobertura funcional

Plan por modulo:
- `docs/feature-coverage-next.md`
