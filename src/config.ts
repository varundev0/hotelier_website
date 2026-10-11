// -----------------------------------------------------------------------------
// Central config for the HotelierOS marketing site.
// Edit these values in one place — every component reads from here.
// -----------------------------------------------------------------------------

// Where the "Log in" / "Request access → already onboarded" buttons point.
// This is the separate app subdomain (see README for the domain split).
export const APP_LOGIN_URL = 'https://app.hotelieros.tattvalabs.io/login';

// Product wordmark shown in nav + footer (rendered as "Hotelier" + accented "OS").
export const BRAND = { pre: 'Hotelier', accent: 'OS' } as const;

// The sample property that threads through the whole page.
// All numbers are illustrative — clearly labelled as such on-page.
export const DEMO = {
  hotelName: 'The Grand Cascade',
  location: 'Udaipur, Rajasthan',
  rooms: 48,
  occupancyPct: 78.4,
  adr: 7020,
  revpar: 5504,
  historyYears: 3,
  channels: [
    { name: 'OTAs', pct: 54, color: 'var(--accent-blue)' },
    { name: 'Direct', pct: 26, color: 'var(--success)' },
    { name: 'Corporate', pct: 14, color: 'var(--warning)' },
    { name: 'Travel Agent', pct: 6, color: '#9CA3AF' },
  ],
  anomaly: 'Diwali week down 18% vs last year',
  corridorLabel: '₹6,800–₹7,400',
} as const;

// Illustrative pricing model used by the interactive slider.
// The real product controls for season, day-of-week, lead time and logged
// competitor rates — this is a teaser curve only.
export const PRICING = {
  scaleMin: 4000,
  scaleMax: 10000,
  // target ADR at 50% occ .. target ADR at 98% occ (linear between)
  rateAtLowOcc: 5200,
  rateAtHighOcc: 9400,
  floorMult: 0.94,
  ceilingMult: 1.07,
} as const;
