# Safraskin

متجر COD للمغرب. أربعة منتجات للمرأة: الكلف، القوام الأنثوي، سقوط الشعر، والإشراق من الداخل.

## التشغيل

```bash
cd frontend
npm install
npm run dev
```

افتح http://localhost:3000

## الصور

المساحات خاويين عن قصد. حط الصور فـ `public/products/` حسب `public/products/README.txt`، ومن بعد حوّل `ASSETS_READY` لـ `true` فـ `data/brand.ts`.

## الطلبات

الطلبات كيمشيو لـ Google Sheet عبر `GOOGLE_SHEETS_WEBHOOK_URL` (Apps Script `/exec`).

## Easypanel

خدمتين:

**Frontend:** context `frontend` · Dockerfile `frontend/Dockerfile` · port `3000`  
**Backend:** context `backend` · Dockerfile `backend/Dockerfile` · port `8000` + Postgres

المتغيرات فـ `frontend/.env.example` و `backend/.env.example`.
