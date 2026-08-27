# CRM-Site — Deployment Instructions

Two apps deployed together behind one nginx reverse proxy, for a single EC2 instance.

| App          | Folder              | Stack                                | Internal port |
| ------------ | ------------------- | ------------------------------------ | ------------- |
| Marketing    | `OrcaITWeb/`        | Next.js 16 (standalone output)       | 3000          |
| CRM          | `CRM/`              | Vite SPA + Express API (Twilio SMS)  | 3001          |
| Facebook bot | `FacebookChatbot/`  | Express Messenger webhook            | 3002          |
| Reverse proxy| `nginx/`            | nginx 1.27                           | 80 (public)   |

```
CRM-Site/
├── docker-compose.yml      # run this
├── INSTRUCTIONS.md         # this file
├── nginx/nginx.conf        # host-based routing
├── OrcaITWeb/              # Dockerfile + .env
└── CRM/                    # Dockerfile + .env
```

Only nginx's **port 80/443** is exposed publicly. The apps use internal Docker ports
(`expose`, not `ports`), so **3000/3001 are never reachable from your public IP**.

### Local development (Windows / Mac)

**Option A — fastest (no Docker):**
```bash
cd OrcaITWeb
npm install
npm run dev
```
Open **http://localhost:3000**

**Option B — full stack via Docker (localhost only):**
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```
| App | URL |
|-----|-----|
| Marketing | http://localhost:3000 or http://localhost:8080 |
| CRM | http://localhost:3001 |
| Via nginx | http://localhost:8080 |

### Production (VPS)

| App | URL |
|-----|-----|
| Marketing | https://orcait.com.au |
| CRM | https://crm.orcait.com.au |
| Raw IP | http://YOUR-VPS-IP/ (marketing via nginx port 80) |

Do **not** use `http://IP:3000` or `http://IP:3001` — those ports are closed on purpose.

After changing `nginx/nginx.conf` on the VPS:
```bash
git pull
docker compose restart nginx
```

---

## 1. Prerequisites on the EC2 host

- Docker Engine + the Compose plugin.

  Amazon Linux 2023:
  ```bash
  sudo dnf install -y docker
  sudo systemctl enable --now docker
  sudo usermod -aG docker $USER   # log out / back in afterwards
  # Compose plugin:
  sudo dnf install -y docker-compose-plugin || \
    (sudo mkdir -p /usr/local/lib/docker/cli-plugins && \
     sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
       -o /usr/local/lib/docker/cli-plugins/docker-compose && \
     sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose)
  ```

- **Instance size:** `t3.small` (2 GB RAM) minimum — the Next.js build can spike memory.
  On a smaller box, add a swapfile before building:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && \
  sudo mkswap /swapfile && sudo swapon /swapfile
  ```

- **Security group inbound rules:** allow `80` (and `443` after TLS), plus `22` for SSH.
  Do **not** open 3000 or 3001.

---

## 2. Configure secrets

Edit the two env files (never commit them):

- `OrcaITWeb/.env` — SMTP settings for booking-confirmation emails.
- `FacebookChatbot/.env` — Messenger tokens (`FACEBOOK_VERIFY_TOKEN`,
  `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_APP_SECRET`, `FACEBOOK_PAGE_ID`).
  Webhook URL: `https://orcait.com.au/facebook-webhook/webhook`
- `CRM/.env` — `PORT`, `NODE_ENV=production`, and Twilio credentials.
  Set `TWILIO_MOCK_MODE=true` to simulate SMS without real Twilio keys.

---

## 3. Point DNS at the instance

Create A-records pointing at the instance's Elastic IP:

- `orcait.com.au`, `www.orcait.com.au`  → marketing site
- `crm.orcait.com.au`                    → CRM

The hostnames are configured in `nginx/nginx.conf` — change them there if your
domains differ.

> **No domain yet / IP-only testing:** in `nginx/nginx.conf`, temporarily set one
> server block's `server_name` to `_` (catch-all). Then `http://<EC2-IP>/` serves
> that app. Only one app can be the catch-all at a time.

---

## 4. Build and run

```bash
cd CRM-Site
docker compose build
docker compose up -d
docker compose ps
```

Verify:
```bash
curl http://localhost/                               # marketing site (via nginx port 80)
curl -H "Host: orcait.com.au" http://localhost/      # marketing site HTML
curl -H "Host: crm.orcait.com.au" http://localhost/api/health # {"ok":true,...}
```

Public URLs (ports 3000/3001 are **not** exposed):
- Marketing: `http://orcait.com.au` or `https://orcait.com.au`
- CRM: `http://crm.orcait.com.au` or `https://crm.orcait.com.au`
- Raw IP: `http://YOUR-VPS-IP/` (marketing site via nginx on port 80)

---

## 5. Operations

```bash
docker compose logs -f            # all logs
docker compose logs -f web        # one service (web | crm | nginx)
docker compose restart crm        # restart one service
docker compose down               # stop everything (volumes preserved)
docker compose up -d --build web  # rebuild + redeploy after a code change
```

**Data persistence:** the marketing site writes lead/booking CSVs to `/app/data`,
backed by the named Docker volume `orca_data` (survives rebuilds and `down`).
Back it up with:
```bash
docker run --rm -v crm-site_orca_data:/data -v "$PWD":/backup alpine \
  tar czf /backup/orca_data-backup.tar.gz -C /data .
```
(The volume name is prefixed with the project directory, e.g. `crm-site_orca_data`;
confirm with `docker volume ls`.)

---

## 6. TLS (recommended before going live)

Two options:

1. **Terminate TLS at nginx (Certbot).** Obtain certs on the host, mount them into
   the nginx container (uncomment the `443` port and `./nginx/certs` volume in
   `docker-compose.yml`), and add a `listen 443 ssl;` server block with
   `ssl_certificate` / `ssl_certificate_key` plus an HTTP→HTTPS redirect.

2. **Terminate TLS at an AWS ALB / CloudFront** in front of the instance, keeping
   this nginx as the plain-HTTP origin on port 80. Simplest if you already use AWS
   certificates (ACM).

---

## Notes / gotchas

- `OrcaITWeb/next.config.ts` has `output: "standalone"` — required for the small
  runtime image. Keep it.
- The CRM's own `Dockerfile` and `docker-compose.yml` inside `CRM/` are the
  standalone (single-app) versions. For the combined deployment, use the top-level
  `docker-compose.yml` in this directory.
- Path-based routing (`/` → site, `/crm` → CRM on one domain) is possible but needs
  the CRM's Vite `base` and React Router `basename` set to `/crm`. The current setup
  uses subdomains instead.
