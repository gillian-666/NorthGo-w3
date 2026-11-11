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

## Launch checklist

1. Set `NEXT_PUBLIC_SITE_URL`, Resend keys, and Sanity project IDs.
2. Deploy to Vercel; verify `/sitemap.xml` and `/robots.txt`.
3. Point DNS from Webflow to Vercel; keep `vercel.json` 301s for legacy legal paths.
4. Submit sitemap in Google Search Console; add `NEXT_PUBLIC_GA_ID` if needed.
5. Hide social links until real URLs exist (already omitted).

## Prototype reference

Sibling HTML IA prototypes live in the parent folder (`sitemap.html`, `locations-map.html`).
