// -----------------------------------------------------------------------------
// Shared client-side helpers: occupancy colour scale, seasonal generator, the
// teaser demand model, a reduced-motion flag, and a run-once "in view" hook.
// -----------------------------------------------------------------------------

export const reduce =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Occupancy ramp, v in [0, 1]. Mixes the theme's --occ-0…4 tokens, so cells
// re-colour themselves when the visitor switches between dark and light.
export function demandColor(v: number): string {
  const x = Math.max(0, Math.min(0.9999, v)) * 4;
  const k = Math.floor(x);
  const t = Math.round((x - k) * 100);
  return `color-mix(in srgb, var(--occ-${k + 1}) ${t}%, var(--occ-${k}))`;
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
// (bar fill, line draw, new booking) key off `.on`; nothing else animates.
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
