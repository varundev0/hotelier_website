// -----------------------------------------------------------------------------
// Shared client-side helpers: demand colour scale, seasonal generator, the
// teaser demand model, a reduced-motion flag, and a run-once "in view" hook.
// Imported by the Hero, Walkthrough and PricingPlayground client scripts.
// -----------------------------------------------------------------------------

export const reduce =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Demand ramp: green-slate, quiet -> full. Mirrors --demand-1…5 in global.css.
// Deliberately a different hue from --signal so demand data never reads as a
// HotelierOS recommendation. v in [0, 1].
const STOPS: [number, number, number, number][] = [
  [0, 231, 238, 234],    // #E7EEEA
  [0.35, 181, 207, 195], // #B5CFC3
  [0.6, 111, 160, 139],  // #6FA08B
  [0.8, 51, 112, 90],    // #33705A
  [1, 18, 63, 49],       // #123F31
];
export function demandColor(v: number): string {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i], b = STOPS[i + 1];
    if (v >= a[0] && v <= b[0]) {
      const t = (v - a[0]) / (b[0] - a[0]);
      const ch = (k: number) => Math.round(a[k] + (b[k] - a[k]) * t);
      return `rgb(${ch(1)},${ch(2)},${ch(3)})`;
    }
  }
  return 'rgb(18,63,49)';
}

// Teaser demand model (see PRICING in config.ts).
export function occAt(price: number, p: { a: number; b: number; maxOcc: number }): number {
  return Math.max(0, Math.min(p.maxOcc, p.a - p.b * price));
}

// Illustrative Indian-market seasonality: peaks Oct–Feb, monsoon dip around Jul.
export function seasonal(dayOfYear: number): number {
  const x = (dayOfYear / 365) * Math.PI * 2;
  const base = 0.62 + 0.26 * Math.cos(x - 0.6);
  const monsoon = -0.18 * Math.exp(-Math.pow((dayOfYear - 200) / 45, 2));
  return Math.max(0.12, Math.min(0.99, base + monsoon));
}

// Add `.on` to each element the first time it enters view. Data animations
// (heatmap sweep, bar fill, line draw) key off `.on`; nothing else animates.
export function onFirstView(els: Element[], threshold = 0.25): void {
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('on'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('on');
      io.unobserve(en.target);
    });
  }, { threshold });
  els.forEach((el) => io.observe(el));
}
