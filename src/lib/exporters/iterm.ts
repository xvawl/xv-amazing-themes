import type { ThemeVariant } from "../theme-model";
import { pickColor } from "./common";

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  const value = hex.replace(/^#/, "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16) / 255,
    g: Number.parseInt(value.slice(2, 4), 16) / 255,
    b: Number.parseInt(value.slice(4, 6), 16) / 255,
  };
}

function colorDictXml(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return [
    "<dict>",
    `<key>Blue Component</key><real>${b}</real>`,
    `<key>Green Component</key><real>${g}</real>`,
    `<key>Red Component</key><real>${r}</real>`,
    "</dict>",
  ].join("");
}

function buildAnsiPalette(theme: ThemeVariant): string[] {
  const red = pickColor(theme, "palette.accent.red.600", "palette.accent.red.400");
  const green = pickColor(theme, "palette.accent.green.600", "palette.accent.green.400");
  const yellow = pickColor(theme, "palette.accent.yellow.600", "palette.accent.yellow.400");
  const blue = pickColor(theme, "palette.accent.blue.600", "palette.accent.blue.400");
  const magenta = pickColor(theme, "palette.accent.magenta.600", "palette.accent.magenta.400");
  const cyan = pickColor(theme, "palette.accent.cyan.600", "palette.accent.cyan.400");
  const white = pickColor(theme, "palette.base.200", "palette.base.100", "palette.base.50");
  const black = pickColor(theme, "palette.base.900", "palette.base.950", "palette.base.black");
  const brightBlack = pickColor(theme, "palette.base.600", "palette.base.700");
  const brightWhite = pickColor(theme, "palette.base.paper", "palette.base.50");
  return [
    black,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white,
    brightBlack,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    brightWhite,
  ];
}

export function renderItermColors(theme: ThemeVariant): string {
  const background = pickColor(theme, "semantic.editor.background", "palette.base.paper", "palette.base.black");
  const foreground = pickColor(theme, "semantic.editor.foreground", "palette.base.black", "palette.base.paper");
  const cursor = pickColor(theme, "semantic.ui.subtleText", "palette.base.600", "palette.base.400");
  const selection = pickColor(theme, "semantic.ui.panelBackground", "palette.base.100", "palette.base.800");

  const ansi = buildAnsiPalette(theme);
  const ansiXml = ansi
    .map((hex, index) => `<key>Ansi ${index} Color</key>${colorDictXml(hex)}`)
    .join("");

  const profileName = `${theme.theme}-${theme.variant}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
<key>Background Color</key>${colorDictXml(background)}
<key>Foreground Color</key>${colorDictXml(foreground)}
<key>Bold Color</key>${colorDictXml(foreground)}
<key>Cursor Color</key>${colorDictXml(cursor)}
<key>Cursor Text Color</key>${colorDictXml(background)}
<key>Selection Color</key>${colorDictXml(selection)}
<key>Selected Text Color</key>${colorDictXml(foreground)}
${ansiXml}
<key>Name</key><string>${profileName}</string>
</dict>
</plist>
`;
}

