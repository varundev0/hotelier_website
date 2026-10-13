// -----------------------------------------------------------------------------
// Central config for the HotelierOS marketing site.
// Edit these values in one place — every component reads from here.
// -----------------------------------------------------------------------------

// Where the "Log in" / "Request access → already onboarded" buttons point.
// This is the separate app subdomain (see README for the domain split).
// The app (hotelier_dash) shows its login screen at the root.
export const APP_LOGIN_URL = 'https://app.hotelieros.tattvalabs.io/';

// Request Access form → emailed to you via Web3Forms (https://web3forms.com).
// Get a free access key there by entering the inbox you want submissions sent to.
// The key is safe to ship in client code: it can only send mail to that inbox.
export const WEB3FORMS_ACCESS_KEY = '594a215b-a6fc-45c6-9424-f45769a8fe92';

// Product wordmark shown in nav + footer (rendered as "Hotelier" + accented "OS").
export const BRAND = { pre: 'Hotelier', accent: 'OS' } as const;

// The sample property that threads through the whole page.
// All numbers are illustrative — footnote 1 on the page says so.
export const DEMO = {
  hotelName: 'The Grand Cascade',
  location: 'Udaipur, Rajasthan',
  rooms: 48,
  occupancyPct: 78.4,
  adr: 7020,
  revpar: 5504,
  historyYears: 3,
  channels: [
    // OTA is the point of the channel panel, so it is the only bar in full ink.
    { name: 'OTAs', pct: 54, color: 'var(--ink)' },
    { name: 'Direct', pct: 26, color: 'var(--ink-55)' },
    { name: 'Corporate', pct: 14, color: 'var(--ink-35)' },
    { name: 'Travel Agent', pct: 6, color: 'var(--ink-20)' },
  ],
  anomaly: 'Diwali week down 18% vs last year',
} as const;

// Illustrative pricing model used by the walkthrough and the interactive slider.
// The real product controls for season, day-of-week, lead time and logged
// competitor rates — this is a teaser curve only.
//
// Demand is linear in price: occupancy(p) = a − b·p, capped at `maxOcc`.
// RevPAR(p) = p · occupancy(p) peaks at `target`. `a` is chosen so the sample
// hotel's current ADR gives exactly its current occupancy — so the slider's
// starting point, the KPI tiles and the hero stats all show the same numbers.
const target = 7100;
const a = (DEMO.occupancyPct / 100) / (1 - DEMO.adr / (2 * target));
export const PRICING = {
  scaleMin: 4000,
  scaleMax: 10000,
  step: 20, // fine enough that the sample ADR (₹7,020) is a valid slider position
  target,
  floor: 6800,
  ceiling: 7400,
  maxOcc: 0.98,
  a,
  b: a / (2 * target),
} as const;

export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const CORRIDOR_LABEL = `${inr(PRICING.floor)}–${inr(PRICING.ceiling)}`;
export const OTA_SHARE = DEMO.channels.find((c) => c.name === 'OTAs')!.pct;
