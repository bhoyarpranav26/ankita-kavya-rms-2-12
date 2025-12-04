KavyaResto — Deployment & Local Run Guide

This README collects concise, copy/paste-ready steps to deploy the monorepo to Railway (or similar platforms), plus local testing steps. Follow the Railway section to configure 2 services (frontend and backend).

---

Quick summary

- Frontend lives in: `Frontend`
  - Build: `npm run build` (produces `dist/`)
  - Start (serves `dist`): `npm start` (runs `vite preview` via added script)
  - Vite env var at build time: `VITE_API_URL` — must be set in your host before building.
- Backend lives in: `Backend`
  - Start: `npm start` (runs `node index.js`)
  - Important env: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `SKIP_EMAIL`.

---

Railway (or Railpack) example setup

You can create TWO services in Railway (recommended): `frontend` and `backend`.

1) Frontend service
- Root directory: `Frontend`
- Build command: npm install && npm run build
- Start command: npm start
- Env variables (set these in Railway environment settings):
  - RAILPACK_SPA_OUTPUT_DIR = dist
  - VITE_API_URL = https://<your-backend-service>.onrailway.app (or your backend public URL)
- Notes:
  - Vite injects `import.meta.env.VITE_API_URL` at build time. Make sure `VITE_API_URL` is set before the build step.
  - If Railway allows, set the Build command to `npm install && npm run build` and Start command to `npm start`.

2) Backend service
- Root directory: `Backend`
- Build command: npm install
- Start command: npm start
- Env variables (set these in Railway environment settings):
  - PORT = 5000
  - MONGO_URI = <your MongoDB connection string>
  - JWT_SECRET = <a secure secret>
  - CORS_ORIGIN = https://<your-frontend-service>.onrailway.app
  - EMAIL_USER = <smtp username, e.g. gmail address>
  - EMAIL_PASS = <smtp password or Gmail app password>
  - EMAIL_FROM = <from email shown to users>
  - SKIP_EMAIL = false (set to true only for dev where you don't want real emails)
- Notes:
  - If using Gmail SMTP: create an App Password (Google Account → Security → App passwords) and use that in `EMAIL_PASS`.
  - As an alternative you may use SendGrid: set `SENDGRID_API_KEY` and `EMAIL_FROM` instead of SMTP.

3) One-repo flow
- Railway will run the Build and Start commands from the service settings; ensure Frontend build runs before Frontend start.
- Example: the repo contains `railway.example.json` with recommended commands — use that as a copy/paste reference.

---

Local testing (PowerShell)

1) Start backend locally

Open a terminal and run:

```powershell
cd "c:\ankita-kavya-rms-2-12\kavyaresto\kavyaresto\Backend"
npm install
# ensure .env has MONGO_URI, JWT_SECRET, CORS_ORIGIN=http://localhost:5173 (dev)
node index.js
# or for dev (needs nodemon installed): npm run dev
```

2) Start frontend locally (dev)

```powershell
cd "c:\ankita-kavya-rms-2-12\kavyaresto\kavyaresto\Frontend"
npm install
# set local Vite env in .env file: VITE_API_URL=http://localhost:5000
npm run dev
# open http://localhost:5173/admin or http://localhost:5173 to test
Start-Process chrome "http://localhost:5173/admin"
```

3) Test production build locally (serve dist)

```powershell
cd "c:\ankita-kavya-rms-2-12\kavyaresto\kavyaresto\Frontend"
npm install
npm run build
$env:PORT=5173; npm start
Start-Process chrome "http://localhost:5173/admin"
```

---

Email (OTP) notes & troubleshooting

- Backend chooses transporter in this priority:
  1) If `SKIP_EMAIL=true` -> no emails are sent (mock logger)
  2) If `EMAIL_USER` & `EMAIL_PASS` present -> use Gmail SMTP (nodemailer)
  3) Else if `SENDGRID_API_KEY` present -> use SendGrid
  4) Else -> falls back to logging the email object to server console

- Gmail: use an App Password (recommended) for `EMAIL_PASS`. Regular Gmail passwords are commonly blocked.
- SendGrid: ensure `EMAIL_FROM` is a verified sender in your SendGrid account.
- When emails don’t arrive: check backend logs (they will print errors from nodemailer/sendgrid). Common causes: bad credentials, account not verified, or emails flagged as spam.

---

Railway-specific quick checklist (copy/paste)

- Frontend service settings:
  - Root directory: Frontend
  - Build command: npm install && npm run build
  - Start command: npm start
  - Env: RAILPACK_SPA_OUTPUT_DIR=dist, VITE_API_URL=https://<your-backend-url>

- Backend service settings:
  - Root directory: Backend
  - Build command: npm install
  - Start command: npm start
  - Env: MONGO_URI, JWT_SECRET, CORS_ORIGIN=https://<your-frontend-url>, EMAIL_USER, EMAIL_PASS, EMAIL_FROM

After setting env vars, trigger a redeploy for both services.

---

If you want, I can:
- Add a small `README-deploy.md` with screenshots/step-by-step instructions for Railway or Render UI.
- Help you trigger a test send right now (I can run `tmp_post.js` locally to attempt an email send with current `.env` values).  

If you deploy to Railpack and it complains about missing `start.sh`, this repo now includes a root-level `start.sh` that:

- Builds the frontend (`Frontend`) with `npm ci && npm run build`.
- Installs backend deps (`Backend`) and starts the backend server which will serve the built frontend from `Frontend/dist` if present.

Railway/Railpack settings should still set env vars per service; the combined `start.sh` is intended for single-process deployments where you want the backend to host the built frontend.

If you'd like that, tell me which action to do next.
