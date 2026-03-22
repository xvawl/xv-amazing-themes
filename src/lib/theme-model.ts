import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { z } from "zod";

const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
const themeFileSchema = z
  .object({
    meta: z.record(z.string(), z.any()).optional(),
    palette: z.record(z.string(), z.any()),
    semantic: z.record(z.string(), z.any()).optional(),
  })
  .passthrough();

const variantSchema = z.enum(["light", "dark"]);
export type ThemeVariantName = z.infer<typeof variantSchema>;

export type Swatch = {
  key: string;
  value: string;
};

export type ThemeVariant = {
  theme: string;
  variant: ThemeVariantName;
  meta: Record<string, unknown>;
  palette: Record<string, unknown>;
  semantic: Record<string, unknown>;
  semanticResolved: Record<string, unknown>;
  swatches: Swatch[];
};

export type ThemeRecord = {
  name: string;
  variants: Partial<Record<ThemeVariantName, ThemeVariant>>;
  notesPath: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function getByPath(root: Record<string, unknown>, dottedPath: string): unknown {
  let current: unknown = root;
  for (const segment of dottedPath.split(".")) {
    if (!isRecord(current) || !(segment in current)) return undefined;
    current = current[segment];
  }
  return current;
}

function resolveRefs(value: unknown, root: Record<string, unknown>, depth = 0): unknown {
  if (depth > 10) return value;
  if (typeof value === "string" && value.startsWith("$")) {
    const resolved = getByPath(root, value.slice(1));
    if (typeof resolved === "string" && resolved.startsWith("$")) {
      return resolveRefs(resolved, root, depth + 1);
    }
    return resolved ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveRefs(item, root, depth + 1));
  }
  if (isRecord(value)) {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      output[key] = resolveRefs(nested, root, depth + 1);
    }
    return output;
  }
  return value;
}

function flattenHexLeaves(value: unknown, prefix = ""): Swatch[] {
  if (!isRecord(value)) return [];
  const entries: Swatch[] = [];
  for (const [key, nested] of Object.entries(value)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (typeof nested === "string" && hexColorRegex.test(nested)) {
      entries.push({ key: nextKey, value: nested });
      continue;
    }
    if (isRecord(nested)) {
      entries.push(...flattenHexLeaves(nested, nextKey));
    }
  }
  return entries;
}

function loadThemeVariant(themeName: string, variant: ThemeVariantName, filePath: string): ThemeVariant {
  const rawFile = readFileSync(filePath, "utf8");
  const parsedYaml = yaml.load(rawFile);
  const parsed = themeFileSchema.parse(parsedYaml);

  const document: Record<string, unknown> = {
    meta: parsed.meta ?? {},
    palette: parsed.palette ?? {},
    semantic: parsed.semantic ?? {},
  };
  const semanticResolved = resolveRefs(document.semantic, document);
  const swatches = flattenHexLeaves(document.palette);

  return {
    theme: themeName,
    variant,
    meta: document.meta as Record<string, unknown>,
    palette: document.palette as Record<string, unknown>,
    semantic: document.semantic as Record<string, unknown>,
    semanticResolved: isRecord(semanticResolved) ? semanticResolved : {},
    swatches,
  };
}

let cache: ThemeRecord[] | null = null;

export function getAllThemes(): ThemeRecord[] {
  if (cache) return cache;

  const repositoryRoot = process.cwd();
  const themesRoot = join(repositoryRoot, "themes");
  const themeDirs = readdirSync(themesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  cache = themeDirs
    .map((themeName) => {
      const variants: Partial<Record<ThemeVariantName, ThemeVariant>> = {};
      for (const variant of variantSchema.options) {
        const filePath = join(themesRoot, themeName, `${variant}.yml`);
        if (!existsSync(filePath)) continue;
        variants[variant] = loadThemeVariant(themeName, variant, filePath);
      }
      if (Object.keys(variants).length === 0) return null;
      return {
        name: themeName,
        variants,
        notesPath: existsSync(join(themesRoot, themeName, "NOTES.md")) ? `themes/${themeName}/NOTES.md` : null,
      };
    })
    .filter((theme): theme is ThemeRecord => !!theme);

  return cache;
}

export function getThemeVariant(themeName: string, variant: string): ThemeVariant | null {
  const parsedVariant = variantSchema.safeParse(variant);
  if (!parsedVariant.success) return null;
  const theme = getAllThemes().find((entry) => entry.name === themeName);
  if (!theme) return null;
  return theme.variants[parsedVariant.data] ?? null;
}

export function getThemeVariantPaths(): Array<{ theme: string; variant: ThemeVariantName }> {
  const output: Array<{ theme: string; variant: ThemeVariantName }> = [];
  for (const theme of getAllThemes()) {
    for (const [variant, data] of Object.entries(theme.variants)) {
      if (!data) continue;
      output.push({ theme: theme.name, variant: variantSchema.parse(variant) });
    }
  }
  return output;
}

export function flattenHexRoles(source: Record<string, unknown>, prefix = ""): Swatch[] {
  return flattenHexLeaves(source, prefix);
}

