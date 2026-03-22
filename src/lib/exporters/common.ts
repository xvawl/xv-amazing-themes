import type { ThemeVariant } from "../theme-model";

function getByPath(source: Record<string, unknown>, dottedPath: string): string | null {
  let current: unknown = source;
  for (const segment of dottedPath.split(".")) {
    if (!current || typeof current !== "object" || Array.isArray(current)) return null;
    if (!(segment in current)) return null;
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === "string" ? current : null;
}

export function pickColor(theme: ThemeVariant, ...paths: string[]): string {
  for (const path of paths) {
    const semanticPath = path.startsWith("semantic.")
      ? path.replace(/^semantic\./, "")
      : path;
    const semanticValue = getByPath(theme.semanticResolved, semanticPath);
    if (semanticValue) return semanticValue;
    const paletteValue = getByPath(theme.palette, path.replace(/^palette\./, ""));
    if (paletteValue) return paletteValue;
  }
  return "#000000";
}

