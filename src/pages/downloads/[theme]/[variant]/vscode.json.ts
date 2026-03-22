import type { APIRoute } from "astro";
import { renderVsCodeTheme } from "../../../../lib/exporters/vscode";
import { getThemeVariantPaths, getThemeVariant } from "../../../../lib/theme-model";

export const prerender = true;

export function getStaticPaths() {
  return getThemeVariantPaths().map((entry) => ({ params: entry }));
}

export const GET: APIRoute = ({ params }) => {
  const theme = params.theme;
  const variant = params.variant;
  if (!theme || !variant) {
    return new Response("Missing theme or variant", { status: 400 });
  }
  const model = getThemeVariant(theme, variant);
  if (!model) {
    return new Response("Theme variant not found", { status: 404 });
  }
  return new Response(renderVsCodeTheme(model), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${theme}-${variant}.vscode-theme.json"`,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

