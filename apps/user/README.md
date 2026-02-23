# NMS User App

App independiente para residentes.

## Desarrollo

Desde la raiz del repo:

```bash
npm run dev:user
```

Directamente desde `apps/user`:

```bash
npm run dev
```

Modo mobile (host LAN + comunidad fija por `.env`):

```bash
npx env-cmd -f .env.mobile.residencial-encino npm run dev:mobile
npx env-cmd -f .env.mobile.bisalom-hub npm run dev:mobile
npx env-cmd -f .env.mobile.country-lomas-altas npm run dev:mobile
npx env-cmd -f .env.mobile.valle-la-silla npm run dev:mobile
```

Ruta base local: `http://127.0.0.1:3000`.
