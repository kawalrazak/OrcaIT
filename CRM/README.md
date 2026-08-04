# CareIT CRM

A modern Customer Relationship Management system for MSP lead intake, technician assignment, and role-based access.

## Features

- **3-layer RBAC** — Support Associate, Service Coordinator, Administrator + Technicians
- **Dashboard** — Lead overview and stats
- **Add / Manage Leads** — Full lead entry, search, filters, SMS actions
- **Onsite Appointments** — Onsite lead tracking
- **User management** — Create accounts and permissions (Administrator)

## Default login

| Role | Username | Password |
|------|----------|----------|
| Administrator | `admin` | `admin123` |

Change the admin password after first login via **Manage Users**.

## Local development

```bash
npm install
npm run dev          # frontend → http://localhost:5173
npm run server       # SMS API → http://localhost:3001 (separate terminal)
```

## Deploy to server (for client access)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full instructions.

**Quick production start** (after `npm install` and `npm run build`):

```bash
cp .env.example .env    # Linux/Mac
copy .env.example .env    # Windows
# Edit .env — set PORT=3001, TWILIO_MOCK_MODE=true for demo SMS

npm start
```

Client opens: **http://YOUR-SERVER-IP:3001**

## Tech stack

- React 18 + TypeScript + Vite + Tailwind CSS
- Express (SMS API + production static hosting)
- localStorage (no database required for this version)

## Notes for client handoff

- Data is stored in the **browser** (localStorage) — each PC/browser keeps its own copy unless you add a database later.
- For real SMS, configure Twilio in `.env` (see DEPLOYMENT.md).
- Use **PM2** or **Docker** to keep the app running 24/7.
