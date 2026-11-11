# Launch & cutover checklist

## Before DNS switch

- [ ] `npm run build` succeeds locally and on Vercel
- [ ] Set production env: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, enquire emails
- [ ] Optional: Sanity project IDs + `/studio` smoke test
- [ ] Spot-check EN / ZH-TW / JA / VI home, services, contact form, locations map
- [ ] Confirm `/sitemap.xml` and `/robots.txt`
- [ ] Confirm `/news` is 200 (empty state OK)
- [ ] Confirm legal pages have no `[Your Jurisdiction]` placeholders

## DNS / hosting

1. Deploy `northgo-web` to Vercel (or preferred Node host).
2. Add domain `www.northgo.com` (+ apex) to the project.
3. Lower TTL on current Webflow DNS records a day ahead.
4. Point DNS to Vercel; keep Webflow project as fallback until SEO settles.
5. `vercel.json` already 301s legacy root legal paths to `/legal/*`.

## Search & analytics

- [ ] Google Search Console: add property, submit `https://www.northgo.com/sitemap.xml`
- [ ] Set `NEXT_PUBLIC_GA_ID` (or replace with Plausible) after cutover
- [ ] Monitor 404s for `/news` and locale prefixes for 1–2 weeks

## Content ops

- Local typed content in `src/content` ships fully translated for launch.
- When Sanity is connected, migrate offices / posts / services; keep file content as fallback via `isSanityConfigured()`.
