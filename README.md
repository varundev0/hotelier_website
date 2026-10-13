# HotelierOS — Marketing Site

The public landing page for **HotelierOS**. It is intentionally a **separate
project from the app** (the React/FastAPI dashboard). This repo is static
marketing content; the app lives on its own subdomain.

- Marketing site → `hotelieros.tattvalabs.io` (this repo)
- App → `app.hotelieros.tattvalabs.io` (existing repo)

The "Log in" and "Request access → already onboarded" buttons link across to
the app's login page.

---

## Stack

- [Astro](https://astro.build) — fast, static-first, ships almost no JS
- Vanilla TypeScript for the small interactive bits (heatmap, bar/line
  reveals, pricing slider)
- A 7-column Swiss grid and its own tokens in `src/styles/global.css`
  (see the "HotelierOS Marketing Site — Design Language Spec" doc)

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
  scripts/demo.ts           # shared client helpers (demand ramp, seasonal curve, run-once reveal)
  layouts/Base.astro        # <html> shell, fonts
  components/
    Nav.astro
    Hero.astro              # headline + sample-property strip + 52-week demand heatmap
    MeetProperty.astro      # unused (merged into Hero) — safe to delete
    Walkthrough.astro       # 5 rows: upload → KPIs → channels → seasonality → corridor
    PricingPlayground.astro # interactive demand → rate corridor slider
    HowItWorks.astro        # unused (now the walkthrough's Day 0 row) — safe to delete
    RequestAccess.astro     # request form → Web3Forms
    Footer.astro            # numbered footnotes + footer
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

### 2. Point the subdomain at it

`tattvalabs.io` is already on Cloudflare DNS, so this is one step:

1. Worker `hotelier-website` → **Domains → Add Domain** → add
   `hotelieros.tattvalabs.io`. Cloudflare creates the DNS record (type
   "Worker") and issues SSL automatically. Don't add a CNAME by hand.

### 3. Keep the app on its own subdomain

The app owns `app.hotelieros.tattvalabs.io` (its own Pages project or current
host). Nothing in this repo touches it — the cross-links in `src/config.ts`
(`APP_LOGIN_URL`) just point at it. Update that constant if the login path
changes.

### Result

```
hotelieros.tattvalabs.io       → this marketing site (Astro, Cloudflare Workers)
app.hotelieros.tattvalabs.io   → the HotelierOS app
```

`site` in `astro.config.mjs` is set to `https://hotelieros.tattvalabs.io` so
canonical URLs are correct.
