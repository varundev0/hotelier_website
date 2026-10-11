// -----------------------------------------------------------------------------
// Shared client-side helpers: demand colour scale, seasonal generator,
// count-up animation, and a reduced-motion flag.
// Imported by the Hero, Walkthrough and PricingPlayground client scripts.
// -----------------------------------------------------------------------------

export const reduce =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Green (quiet) -> amber -> red (peak) demand colour scale. v in [0, 1].
export function demandColor(v: number): string {
  const stops: [number, number, number, number][] = [
    [0, 16, 185, 129],   // #10B981
    [0.35, 132, 204, 22],// #84cc16
    [0.6, 245, 158, 11], // #F59E0B
    [0.8, 249, 115, 22], // #f97316
    [1, 239, 68, 68],    // #EF4444
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    if (v >= a[0] && v <= b[0]) {
      const t = (v - a[0]) / (b[0] - a[0]);
      const r = Math.round(a[1] + (b[1] - a[1]) * t);
      const g = Math.round(a[2] + (b[2] - a[2]) * t);
      const bl = Math.round(a[3] + (b[3] - a[3]) * t);
      return `rgb(${r},${g},${bl})`;
    }
  }
  return 'rgb(239,68,68)';
}

// Illustrative Indian-market seasonality: peaks Oct–Feb, monsoon dip around Jul.
export function seasonal(dayOfYear: number): number {
  const x = (dayOfYear / 365) * Math.PI * 2;
  const base = 0.62 + 0.26 * Math.cos(x - 0.6);
  const monsoon = -0.18 * Math.exp(-Math.pow((dayOfYear - 200) / 45, 2));
  return Math.max(0.12, Math.min(0.99, base + monsoon));
}

export function fmt(n: number, dec = 0): string {
  if (dec > 0) return n.toFixed(dec);
  return Math.round(n).toLocaleString('en-IN');
}

// Animate an element's text from 0 to data-count (respects reduced motion).
export function countUp(el: HTMLElement): void {
  const target = parseFloat(el.getAttribute('data-count') || '0');
  const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
  const suffix = el.getAttribute('data-suffix') || '';
  if (reduce) {
    el.textContent = fmt(target, dec) + suffix;
    return;
  }
  const start = performance.now();
  const dur = 1100;
  function step(now: number) {
    const p = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * e, dec) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = fmt(target, dec) + suffix;
  }
  requestAnimationFrame(step);
}
