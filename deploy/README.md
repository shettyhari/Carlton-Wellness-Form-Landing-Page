# Deployment

## 1. Build the release

From the repo root:

```bash
npm run build
```

This refreshes `release/frontend` (the static page) and `release/backend` (the lead API).

## 2. Option A: Vercel (simplest)

Import the GitHub repo in Vercel and deploy. No settings to change: `vercel.json` serves `frontend/` as the site and runs the backend as a function for `/api/*`.

Until the database is connected in `backend/src/leadStore.js`, leads only appear in the Vercel function logs (Project > Logs).

## 3. Option B: one Node.js server

The backend serves the page and the API together.

1. Upload `release/backend` and `release/frontend` side by side, e.g. `/var/www/carlton-wellness/backend` and `/var/www/carlton-wellness/frontend`.
2. In the backend folder: `npm ci --omit=dev`, then copy `.env.example` to `.env` and edit it (`SERVE_FRONTEND=true`).
3. Start it with PM2: `pm2 start ecosystem.config.js && pm2 save && pm2 startup`.
4. Put Nginx in front for HTTPS (see `nginx.conf.example`).

When the page is served by the backend, the backend sets the form endpoint to `/api/leads` automatically.

## 4. Option C: static hosting + separate API

1. Upload `release/frontend` to the web root (cPanel `public_html`, S3, Vercel, Netlify, etc.).
2. Run `release/backend` on a Node.js host with `SERVE_FRONTEND=false` and `CORS_ORIGINS` set to the page's domain.
3. In `frontend/config.js`, change `formEndpoint` from `/api/leads` to the full API URL, e.g. `https://api.example.com/api/leads`.

## Settings in `frontend/config.js`

| Setting | Purpose |
|---|---|
| `formEndpoint` | Where leads are sent. Default `/api/leads` (Vercel or the Node.js server). Empty = the thank-you screen still shows but leads are NOT sent |
| `metaPixelId` | Meta Pixel ID for PageView and Lead events |

## Check it works

- `GET /api/health` returns `{ "ok": true }`.
- Submit the form once and check the server log (`pm2 logs carlton-wellness-backend`). Until the database is connected in `backend/src/leadStore.js`, leads only appear there.
