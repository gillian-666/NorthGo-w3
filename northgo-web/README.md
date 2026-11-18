# Northgo Web

Next.js rebuild of [northgo.com](https://www.northgo.com/) (marketing site): App Router, `next-intl` (en / zh-tw / ja / vi), Sanity-ready CMS schemas, Leaflet locations map, and structured enquire API.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Content

- UI chrome: `messages/*.json`
- Page copy / services / legal / offices: `src/content/*` (works offline without Sanity)
- CMS schemas: `sanity/schemas/*` — connect via `.env.local` then open `/studio`
- Admin console: `/admin/login` (set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`)

## Admin

1. Copy `.env.example` → `.env.local` and set the three `ADMIN_*` values.
2. Run `npm run dev` and open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
3. Use **詢問管理** (`/admin/enquiries`) to filter, edit, annotate, change status, or delete front-end contact submissions.
4. Open `/studio` for Sanity CMS when configured.

> Admin, API routes, and Studio require a Node host (local / Vercel). They are excluded from the GitHub Pages static export.

## Cloudflare (Workers + D1)

Enquiry storage uses Cloudflare D1 when the Worker binding `DB` is present; local `next dev` falls back to `data/enquiries.json` if D1 is unavailable.

```bash
npx wrangler login
npx wrangler d1 create northgo-enquiries
# paste database_id into wrangler.jsonc
npm run db:migrate:remote
npm run deploy
```

| Command | Purpose |
|---------|---------|
| `npm run db:migrate:local` | Apply SQL migrations to local D1 |
| `npm run db:migrate:remote` | Apply SQL migrations to remote D1 |
| `npm run preview` | OpenNext build + local Workers preview |
| `npm run deploy` | OpenNext build + deploy to Cloudflare Workers |

## Launch checklist

1. Set `NEXT_PUBLIC_SITE_URL`, Resend keys, and Sanity project IDs.
2. Deploy to Cloudflare Workers (`npm run deploy`) or Vercel; verify `/sitemap.xml` and `/robots.txt`.
3. Point DNS from Webflow to the chosen host; keep `vercel.json` 301s for legacy legal paths.
4. Submit sitemap in Google Search Console; add `NEXT_PUBLIC_GA_ID` if needed.
5. Hide social links until real URLs exist (already omitted).

## Prototype reference

Sibling HTML IA prototypes live in the parent folder (`sitemap.html`, `locations-map.html`).
