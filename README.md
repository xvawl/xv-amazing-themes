# amazing-themes

Theme workspace for keeping a single set of color decisions consistent across the tools I use daily.

This repo is meant to be:
- A place to collect upstream themes (with attribution), then tweak them into my own palettes.
- A place to document *why* each color exists and where it is used.
- A place to export those same colors into multiple "targets" (terminal, editors, etc).

## Goals

- One source of truth for colors (not "N copies of the same palette").
- Clear commentary: names, intent, contrast constraints, and usage rules.
- Repeatable exports for:
  - iTerm2
  - JetBrains IDEs
  - VS Code
  - Zed
  - (Maybe) Linux desktop theming

## Non-goals (for now)

- A fully automated generator for every target on day one.
- Supporting every theme format under the sun.

## Repo Layout

- `themes/`
  - Canonical theme definitions (source of truth).
  - One folder per theme.
  - Usually split into `light` and `dark`.
- `src/`
  - Root Astro app.
  - Preview pages + playground + prerendered download routes.
- `src/lib/theme-model.ts`
  - Single typed loader/normalizer for YAML themes.
- `src/lib/exporters/`
  - Tool-specific generators that consume the same normalized model.
- `docs/`
  - Notes on color systems, contrast, and mapping conventions.
- `.github/workflows/pages.yml`
  - GitHub Pages build/deploy pipeline (static Astro output).

## Canonical Format

Canonical theme files in `themes/` are **YAML** (comment-friendly).

Conventions (to keep YAML readable and predictable):
- 2-space indent (no tabs)
- Always quote hex colors: `"#RRGGBB"`
- Avoid YAML anchors/aliases and non-obvious YAML types (keep it plain data)
- Prefer explicit keyed maps over long arrays

See `docs/theme-format.md` for the detailed format notes.

## Theme Model (Recommended)

I’m treating a theme as two layers:

1. **Palette tokens** (physical colors)
   - Example: `bg.0`, `fg.0`, `accent.blue`, `red.500`
   - These should be stable and well-commented.
2. **Semantic roles** (meaning / usage)
   - Example: `editor.background`, `editor.foreground`, `diff.added`, `error`, `warning`
   - This is where cross-tool mapping becomes tractable.

The canonical format in `themes/` is currently YAML so files can carry inline comments.

Single source of truth rule:
- Only YAML in `themes/` is canonical.
- Preview pages, playground, and export downloads all read through `src/lib/theme-model.ts`.
- Exporters do not read raw files directly.

## Adding A New Theme

1. Copy `themes/_skeleton/` to `themes/<theme-name>/`.
2. Fill in `light.yml` and/or `dark.yml`.
3. Write down where the palette came from (URL, author, license) in `themes/<theme-name>/NOTES.md`.
4. Start by mapping to one target in `targets/` to keep scope tight.

## Attribution And Licenses

If you pull colors from an upstream theme, record:
- Where it came from (URL)
- License (MIT, Apache-2.0, etc.)
- Whether the exported artifact is a derivative work of that theme

This repo is intended to respect upstream licensing. When in doubt, keep the upstream theme as a reference and treat exports as your own mapping layer rather than redistributing upstream files verbatim.

## Status

This is an actively evolving workspace. Expect conventions to change as more targets are added.

## Theme Lab (Local)

1. Install deps and run Astro:

```sh
npm install
npm run dev
```

2. Build static output:

```sh
npm run build
```

## Download Endpoints

These are prerendered static files, generated at build time from canonical YAML themes:

- `/downloads/<theme>/<variant>/itermcolors.xml`
- `/downloads/<theme>/<variant>/vscode.json`

Example:
- `/downloads/flexoki/light/itermcolors.xml`

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys `dist/`.
Set GitHub Pages source to **GitHub Actions** in repository settings.
