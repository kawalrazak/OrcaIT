# Orca IT Legacy Site (PHP)

Server-rendered PHP pages for older browsers such as Safari 11–12 on macOS High Sierra. Modern browsers still use the Next.js site.

## Pages

- `/` home and contact form
- `/book` booking request (also `/booking` and `/book-now`)
- `/what-we-do` home IT support
- `/business-it` business services
- `/services/{slug}` individual service pages
- `/why-orca-it`
- `/about`
- `/industries`

Forms post as normal HTML (no JavaScript or JSON). Leads are forwarded to the CRM.

## Test on a modern browser

Open `https://orcait.com.au/?legacy=1`

## Deploy

From the repo root on the server:

```bash
docker compose build legacy nginx
docker compose up -d
```
