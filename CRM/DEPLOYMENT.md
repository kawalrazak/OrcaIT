# CareIT CRM — Server Deployment Guide

This guide explains how to put the app on a server so your client can open it in a browser (e.g. `http://your-server-ip:3001` or `https://crm.yourdomain.com`).

---

## What gets deployed

| Part | Description |
|------|-------------|
| **Frontend** | React app (built into `dist/`) |
| **Backend** | Node.js server for SMS API + serving the website |
| **Data** | Stored in each user's **browser** (localStorage). No database required for this version. |

**Default login:** `admin` / `admin123` (Administrator)

---

## Option A — Windows Server (simple)

### 1. Install Node.js
Download and install **Node.js 20 LTS** from https://nodejs.org/

### 2. Copy project to server
Copy the whole `CRM` folder to the server, e.g. `C:\CareIT-CRM`

### 3. Configure environment
```powershell
cd C:\CareIT-CRM
copy .env.example .env
notepad .env
```
Set at minimum:
```
NODE_ENV=production
PORT=3001
TWILIO_MOCK_MODE=true
```
(`TWILIO_MOCK_MODE=true` lets SMS buttons work in demo mode without Twilio.)

### 4. Install, build, and start
```powershell
npm install
npm run build
npm start
```

### 5. Open firewall port
Allow **TCP port 3001** in Windows Firewall.

### 6. Client opens in browser
```
http://YOUR-SERVER-IP:3001
```

### 7. Keep running after logout (recommended)
Install PM2 globally and use it:
```powershell
npm install -g pm2
npm install -g pm2-windows-startup
pm2 start ecosystem.config.cjs
pm2 save
pm2-startup install
```

---

## Option B — Linux VPS (Ubuntu)

### 1. Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Upload project
Use SCP, SFTP, or Git to put files in `/var/www/careit-crm`

### 3. Configure and build
```bash
cd /var/www/careit-crm
cp .env.example .env
nano .env   # set NODE_ENV=production, PORT=3001
npm install
npm run build
```

### 4. Run with PM2
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow the command it prints
```

### 5. Firewall
```bash
sudo ufw allow 3001/tcp
sudo ufw enable
```

Client URL: `http://YOUR-SERVER-IP:3001`

---

## Option C — Docker

On any server with Docker installed:

```bash
cp .env.example .env
# edit .env — set NODE_ENV=production, TWILIO_MOCK_MODE=true if needed
docker compose up -d --build
```

App runs at `http://YOUR-SERVER-IP:3001`

---

## Option D — Domain + HTTPS (production)

Use **Nginx** as reverse proxy and **Let's Encrypt** for free SSL.

Example Nginx site (`/etc/nginx/sites-available/careit`):

```nginx
server {
    listen 80;
    server_name crm.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:
```bash
sudo ln -s /etc/nginx/sites-available/careit /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d crm.yourdomain.com
```

Client opens: `https://crm.yourdomain.com`

---

## SMS (Send Quote / Technician)

To send real SMS, set in `.env`:
```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+61...
TWILIO_MOCK_MODE=false
```

Restart the server after changing `.env`.

---

## Handoff checklist for client

- [ ] Server URL shared (IP or domain)
- [ ] Default admin login: `admin` / `admin123` — **change password** via Manage Users after first login
- [ ] Create user accounts for Support Associate, Service Coordinator, Technicians
- [ ] SMS: Twilio configured OR mock mode enabled for demo
- [ ] PM2/Docker set to auto-restart on reboot

---

## Important notes

1. **Data is per browser** — leads and users are saved in localStorage. Clearing browser data removes them. For shared multi-user database storage, a future backend upgrade would be needed.
2. **Build after code changes** — run `npm run build` then restart the server.
3. **Do not commit `.env`** — it contains secrets.

---

## Quick commands reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run build` | Build frontend for production |
| `npm start` | Run production server |
| `npm run dev` | Local development only |
| `pm2 restart careit-crm` | Restart after updates |
