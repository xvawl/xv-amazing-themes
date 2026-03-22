type Rgb = { r: number; g: number; b: number };

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function parseHexColor(hex: string): Rgb | null {
  const cleaned = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  const r = Number.parseInt(cleaned.slice(0, 2), 16);
  const g = Number.parseInt(cleaned.slice(2, 4), 16);
  const b = Number.parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

function srgbToLinear(channel255: number): number {
  const c = clamp01(channel255 / 255);
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number | null {
  const rgb = parseHexColor(hex);
  if (!rgb) return null;
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: string, bg: string): number | null {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  if (l1 === null || l2 === null) return null;
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagBadge(ratio: number | null): { label: string; kind: "ok" | "warn" | "bad" } {
  if (ratio === null || Number.isNaN(ratio)) return { label: "n/a", kind: "bad" };
  if (ratio >= 7) return { label: `${ratio.toFixed(2)} AAA`, kind: "ok" };
  if (ratio >= 4.5) return { label: `${ratio.toFixed(2)} AA`, kind: "ok" };
  if (ratio >= 3) return { label: `${ratio.toFixed(2)} AA Large`, kind: "warn" };
  return { label: `${ratio.toFixed(2)} Low`, kind: "bad" };
}

