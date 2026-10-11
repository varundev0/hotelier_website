# HotelierOS — Marketing Site

The public landing page for **HotelierOS**. It is intentionally a **separate
project from the app** (the React/FastAPI dashboard). This repo is static
marketing content; the app lives on its own subdomain.

- Marketing site → `hotelieros.com` (this repo)
- App → `app.hotelieros.com` (existing repo)

The "Log in" and "Request access → already onboarded" buttons link across to
the app's login page.

---

## Stack

- [Astro](https://astro.build) — fast, static-first, ships almost no JS
- Vanilla TypeScript for the small interactive bits (heatmap, scroll
  walkthrough, pricing slider)
- The app's Swiss Modernism design tokens, ported to `src/styles/global.css`

No UI framework, no CSS framework — deliberately light so the page is quick to
load and easy to reason about.

---

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
```

Build a production bundle:

```bash
npm run build      # outputs static site to ./dist
npm run preview    # serve the built ./dist locally
```

Requires Node 18.20+ / 20.3+ / 22+ (standard Astro requirement).

---

## Project structure

```
src/
  config.ts                 # ⭐ edit this: login URL, brand, demo numbers, pricing model
  styles/global.css         # design tokens + all styles
  scripts/demo.ts           # shared client helpers (colour scale, seasonal curve, count-up)
  layouts/Base.astro        # <html> shell, fonts, generic scroll-reveal
  components/
    Nav.astro
    Hero.astro              # animated demand heatmap + count-up stats
    MeetProperty.astro      # the sample hotel that threads through the page
    Walkthrough.astro       # sticky-scroll: KPIs → channels → seasonality → corridor
    PricingPlayground.astro # interactive demand → rate corridor slider
    HowItWorks.astro
    RequestAccess.astro     # front-end-only form stub (see below)
    Footer.astro
  pages/index.astro         # composes the sections
```

## Where to edit things

- **Login URL, wordmark, sample-hotel numbers, the pricing model** → `src/config.ts`.
  Everything reads from here; you rarely need to touch component markup.
- **Copy / headlines** → the relevant `.astro` component.
- **Colours, spacing, typography** → `src/styles/global.css` (`:root` tokens at the top).
- **The heatmap's seasonal shape / colour scale** → `src/scripts/demo.ts`.

## Two things still stubbed (intentional)

1. **Request Access form** (`RequestAccess.astro`) is front-end only — on submit
   it just shows a thank-you. Wire it to a real destination: a
   [Cloudflare Pages Function](https://developers.cloudflare.com/pages/functions/),
   Formspree, or a `POST` to your backend.
2. **Pricing slider** uses a simple illustrative elasticity curve (`PRICING` in
   `config.ts`). If you want it to mirror your real PED output, replace the
   linear model with sampled points from the engine.

All on-page numbers are labelled **"illustrative data"** — matching the app's
own "Demo Data" badge convention. Nothing that's still mocked in the product
(F&B/Spa targets, automatic competitor scraping, the Reports tab) is advertised.

---

## Deploy on Cloudflare Pages

### 1. Create the Pages project

1. Push this repo to GitHub/GitLab.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick this repo. Set:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. You'll get a `*.pages.dev` preview URL to verify.

### 2. Point the apex domain at it

1. Add `hotelieros.com` to Cloudflare (nameservers pointed to Cloudflare).
2. Pages project → **Custom domains → Set up a domain** → add `hotelieros.com`.
   Cloudflare writes the DNS record for you.
3. Add `www.hotelieros.com` too, then create a **Redirect Rule**:
   `www.hotelieros.com/*` → `https://hotelieros.com/$1` (301). Keeps one
   canonical host.

### 3. Keep the app on its own subdomain

Your existing app deploy owns `app.hotelieros.com` (its own Pages project or
current host). Nothing in this repo touches it — the cross-links in
`src/config.ts` (`APP_LOGIN_URL`) just point at it. Update that constant to match
the real login path.

### Result

```
hotelieros.com        → this marketing site (Astro, Cloudflare Pages)
www.hotelieros.com    → 301 → hotelieros.com
app.hotelieros.com    → the HotelierOS app (unchanged)
```

Update `site` in `astro.config.mjs` to your final apex domain so canonical URLs
are correct.
