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
- Vanilla TypeScript for the interactive bits (the lit building, live panels,
  on-the-books heatmap, pricing slider)
- Dark by default: follows the visitor's system setting, with a toggle that
  remembers their choice. Tokens for both themes live at the top of
  `src/styles/global.css`.

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

## How the page works

The page is one continuous story: an evening at a sample hotel. A building with
48 windows (48 rooms — it is the HotelierOS logo, scaled up) stays pinned beside
the copy. Each chapter that scrolls past lights more windows, and tonight's
occupancy and recommended rate update with it:

reservation lands → room grid → housekeeping → live numbers → on the books →
rate moves → full house.

Chapter timestamps run on the visitor's own clock ("This evening at…").

## Project structure

```
src/
  config.ts                 # ⭐ edit this: login URL, brand, sample-hotel numbers,
                            #    pricing model, Diwali dates, rooms lit per chapter
  styles/global.css         # theme tokens (dark + light) + all styles
  scripts/demo.ts           # shared client helpers (occupancy ramp, seasonal curve, run-once reveal)
  layouts/Base.astro        # <html> shell, fonts, theme set before first paint
  components/
    brand/HotelierMark.astro  # the logo mark (same art as public/favicon.svg)
    brand/TattvaMark.astro    # Tattva Labs mark (as on tattvalabs.io)
    Nav.astro                 # logo, links, theme toggle
    Story.astro               # hero + the pinned building + every product chapter
    PricingPlayground.astro   # interactive rate → RevPAR slider
    RequestAccess.astro       # request form → Web3Forms
    Footer.astro              # notes + "HotelierOS by Tattva Labs" footer
  pages/index.astro         # composes the page
public/og.png               # link-preview image (1200×630)
```

## Where to edit things

- **Login URL, wordmark, sample-hotel numbers, the pricing model, how full the
  building is at each chapter** → `src/config.ts`.
- **Copy / headlines** → the relevant `.astro` component (most of it is in `Story.astro`).
- **Colours, spacing, typography** → `src/styles/global.css` (dark and light tokens at the top).
- **Diwali flag on the heatmap** → add next year's date to `DIWALI_DATES` in `src/config.ts`.

## Still illustrative (intentional)

1. **Pricing slider** uses a simple illustrative elasticity curve (`PRICING` in
   `config.ts`). If you want it to mirror your real PED output, replace the
   linear model with sampled points from the engine.

Every number on the page belongs to a sample property, and footnote 1 says so. Nothing that's still mocked in the product
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
