# BInAI Community OS (Next.js)

Proyecto separado en dos aplicaciones independientes:

- `apps/user`: app para residentes.
- `apps/admin`: app para administradores.

Ambas apps comparten el mismo modelo de datos y API interna, pero se ejecutan y despliegan por separado.

## Correr en local

Requisitos:
- Node.js 20+
- npm 10+

Instalar dependencias:
```bash
npm run install:apps
```

Desarrollo:
```bash
npm run dev:user
npm run dev:admin
```

Rutas por defecto:
- User app: `http://127.0.0.1:3000/sign-in`
- Admin app: `http://127.0.0.1:3001/sign-in`

## Build y start

```bash
npm run build:all
npm run start:user
npm run start:admin
```

## Login por correo/password (Supabase Auth)

- Provider: `supabase-password`
- Login en `/sign-in` dentro de cada app
- User app permite roles de usuario final
- Admin app permite solo roles `admin` o `staff`

## Migraciones Supabase

Ejecutar en orden:
1. `apps/user/supabase/migrations/0001_init.sql`
2. `apps/user/supabase/migrations/0002_access_passes.sql`

## Deploy en Vercel

Configurar un proyecto por app:
1. User app con `Root Directory = apps/user`
2. Admin app con `Root Directory = apps/admin`
3. Variables de entorno segun su `.env.example`

## Cobertura funcional

Plan por modulo:
- `docs/feature-coverage-next.md`
