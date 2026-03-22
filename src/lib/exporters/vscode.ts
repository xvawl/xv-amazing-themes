import type { ThemeVariant } from "../theme-model";
import { pickColor } from "./common";

export function renderVsCodeTheme(theme: ThemeVariant): string {
  const isDark = theme.variant === "dark";
  const bg = pickColor(theme, "semantic.editor.background", "palette.base.paper", "palette.base.black");
  const fg = pickColor(theme, "semantic.editor.foreground", "palette.base.black", "palette.base.paper");
  const panelBg = pickColor(theme, "semantic.ui.panelBackground", "palette.base.50", "palette.base.850");
  const border = pickColor(theme, "semantic.ui.border", "palette.base.150", "palette.base.800");
  const subtle = pickColor(theme, "semantic.ui.subtleText", "palette.base.600", "palette.base.300");
  const error = pickColor(theme, "semantic.syntax.error", "palette.accent.red.600", "palette.accent.red.400");
  const keyword = pickColor(theme, "semantic.syntax.keyword", "palette.accent.purple.600", "palette.accent.purple.400");
  const stringColor = pickColor(theme, "semantic.syntax.string", "palette.accent.cyan.600", "palette.accent.cyan.400");
  const functionColor = pickColor(theme, "semantic.syntax.function", "palette.accent.orange.600", "palette.accent.orange.400");
  const variable = pickColor(theme, "semantic.syntax.variable", "palette.accent.blue.600", "palette.accent.blue.400");

  return JSON.stringify(
    {
      name: `amazing-${theme.theme}-${theme.variant}`,
      type: isDark ? "dark" : "light",
      colors: {
        "editor.background": bg,
        "editor.foreground": fg,
        "editor.selectionBackground": panelBg,
        "editor.lineHighlightBackground": panelBg,
        "editorCursor.foreground": subtle,
        "editorWhitespace.foreground": border,
        "editorIndentGuide.background1": border,
        "sideBar.background": panelBg,
        "panel.background": panelBg,
        "activityBar.background": panelBg,
        "statusBar.background": panelBg,
        "statusBar.foreground": fg,
        "errorForeground": error,
      },
      tokenColors: [
        { scope: ["keyword"], settings: { foreground: keyword } },
        { scope: ["string"], settings: { foreground: stringColor } },
        { scope: ["entity.name.function"], settings: { foreground: functionColor } },
        { scope: ["variable", "identifier"], settings: { foreground: variable } },
        { scope: ["invalid"], settings: { foreground: error } },
      ],
    },
    null,
    2,
  );
}

