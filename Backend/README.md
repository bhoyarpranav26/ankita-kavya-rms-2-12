# Backend — RestoM

Quick notes to run the backend locally (Windows PowerShell)

Required environment variables (create a `.env` file in the `Backend` folder):

- `MONGO_URI` — MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/Kavyaresto`)
- `EMAIL_USER` — Gmail address used to send OTP emails
- `EMAIL_PASS` — Gmail App Password (not your account password)
- `JWT_SECRET` — secret for signing JWTs
- `PORT` — optional, defaults to `5000`
- `CORS_ORIGIN` — frontend origin (e.g. `http://localhost:5173`)
# Backend (Kavyaresto)

This backend implements signup with email OTP, OTP verification, login (JWT) and a protected profile route.

Prerequisites
- Node 18+ and npm
- MongoDB accessible (local or remote)

Required environment variables (create `.env` in `Backend/`):

- MONGO_URI (e.g. `mongodb://127.0.0.1:27017/kavyaresto`)
- JWT_SECRET (e.g. a long random string)
- PORT (optional, default 5000)
- CORS_ORIGIN (e.g. `http://localhost:5173`)
- EMAIL_USER and EMAIL_PASS (optional). If not provided the server will log OTP emails to console for development.

Quick start (PowerShell):

```powershell
cd "c:\Users\Administrator\Desktop\kavyaresto\kavyaresto\Backend"
npm install
npm run dev
```

API endpoints

- POST /api/auth/signup
  - body: { name, email, phone, password }
  - Sends OTP to email (or logs to console) and saves OTP + expiry in DB.

- POST /api/auth/verify-otp
  - body: { email, otp }
  - Verifies the account and clears OTP fields.

- POST /api/auth/login
  - body: { email, password }
  - Returns: { token, user }

- GET /api/auth/profile (protected)
  - Requires Authorization: Bearer <token>

Notes
- If you don't want to configure SMTP for development, leave `EMAIL_USER`/`EMAIL_PASS` empty — OTP will be printed to the server console and still stored in the DB.
- Use a Gmail App Password if using Gmail SMTP (enable 2FA and create an App Password).
