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

- Build context: `frontend`
- Dockerfile: `frontend/Dockerfile`
- Port: `3000`

المتغيرات الكاملة فـ `.env.example`. المهم: `GOOGLE_SHEETS_WEBHOOK_URL` runtime، و `NEXT_PUBLIC_*` خاصهم يكونو موجودين فالـ build.
