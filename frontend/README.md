# Safra Skin — Frontend

Next.js 14 · Arabic RTL · COD checkout (cart drawer + upsell).

**Backend API:** https://github.com/pablomesrouhi-code/backend-safra

## Easypanel deploy

| Setting | Value |
|---------|--------|
| Repo | `https://github.com/pablomesrouhi-code/frontend-safra` |
| Branch | `main` |
| Dockerfile | `Dockerfile` (repo root — **not** `frontend/Dockerfile`) |
| Port | `3000` |

### Environment (build + runtime)

Set these in Easypanel **before** build:

```
NEXT_PUBLIC_SITE_URL=https://safraskin.online
NEXT_PUBLIC_API_URL=https://api.safraskin.online
NEXT_PUBLIC_UPSELL_TIMER_SECONDS=12
```

Optional: `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_SNAP_PIXEL_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_GA4_ID`

## Local dev

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Docker (local)

```bash
docker build -t safra-frontend \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  .
docker run -p 3000:3000 safra-frontend
```
