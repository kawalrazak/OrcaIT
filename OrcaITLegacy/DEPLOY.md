# Deploy the PHP legacy site on the server

Run these commands **on the production server** after pulling the latest `OrcaIT-PHP` branch:

```bash
cd /path/to/CRM-Site
git pull origin OrcaIT-PHP
docker compose build legacy
docker compose up -d legacy nginx
docker compose ps
```

## Verify it is working

1. **Check legacy container is running:**
   ```bash
   docker compose exec nginx wget -qO- http://legacy/health.php
   ```
   Should print: `Orca IT legacy PHP site is running.`

2. **Check routing from nginx:**
   ```bash
   curl -I "http://localhost/?legacy=1"
   ```
   Response should include header: `X-Orca-Site: legacy-php`

3. **In a browser**, open:
   ```
   https://orcait.com.au/?legacy=1
   ```
   You should see a **yellow banner** at the top:
   *"Orca IT classic view — optimised for older computers and browsers."*

   If you still see star ratings and broken layout, the server has **not** picked up the new nginx config yet.

## Old browsers (iMac / High Sierra)

Safari 11–12 and Firefox 78 and below are detected automatically — no `?legacy=1` needed.

## If you use host nginx (outside Docker)

If your VPS has nginx installed on the host (not Docker), it may be bypassing the Docker nginx container. In that case, add the rules from `nginx/host-legacy.conf.example` to your host nginx config.
