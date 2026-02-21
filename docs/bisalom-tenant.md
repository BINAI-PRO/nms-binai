# Tenant Bisalom

## Activos de marca

- Logo y favicons: `apps/user/public/bisalom` y `apps/admin/public/bisalom`
- Colores base:
  - `#69C9C7` (primary accent)
  - `#1C5C66` (primary)
  - `#39A082` (success)
  - `#FFFFFF` (background/card)

## Env local del tenant

- Plantilla versionable: `apps/user/tenants/bisalom/env.local.example`
- Archivo local (no versionado): `apps/user/.env.local.bisalom`
- Comunidad seed: `f7fd88d8-64bd-4fa1-b5a0-bf96038fef62` (migracion `apps/user/supabase/migrations/0003_seed_bisalom_tenant.sql`)

Para activarlo:

```powershell
Copy-Item apps/user/.env.local.bisalom apps/user/.env.local
```

## Modo de branding de user app

- `NEXT_PUBLIC_USER_BRANDING_MODE=tenant`
  - La app de usuario usa siempre marca Bisalom.
- `NEXT_PUBLIC_USER_BRANDING_MODE=community`
  - La app de usuario usa marca por comunidad (si hay override), y fallback a Bisalom.

## Overrides por comunidad

Definir en `NEXT_PUBLIC_COMMUNITY_BRANDING_JSON` un JSON con llave `community_id`:

```json
{
  "community-uuid": {
    "name": "Residencial Norte",
    "logo": "/branding/res-norte/logo.png",
    "palette": {
      "primary": "#0F4A5A",
      "primaryAccent": "#7ED9CF",
      "success": "#39A082",
      "background": "#FFFFFF"
    }
  }
}
```

La marca de `admin app` se mantiene en Bisalom; los overrides aplican para `user app`.
