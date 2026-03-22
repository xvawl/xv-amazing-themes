# Flexoki (Upstream Notes)

## Upstream

- Name: Flexoki
- Author: Steph Ango
- Homepage: stephango.com/flexoki
- Canonical repo: `kepano/flexoki` on GitHub

## License

Flexoki is MIT licensed (see upstream `LICENSE`). This permits redistribution and modification, provided the copyright
notice and license text are included with copies or substantial portions.

This repo stores:
- A YAML transcription of the upstream palette values (with extra commentary).
- Our own semantic-role layer and tool mappings.

## Palette Notes

Flexoki defines:
- A warm base scale from `paper` (lightest) to `black` (darkest), with intermediate `base-*` steps.
- Eight accent hues (red/orange/yellow/green/cyan/blue/purple/magenta).
- In the **standard** palette, accents are provided at `400` and `600`.
  - `600` series: darker accents that work well on light backgrounds.
  - `400` series: lighter accents that work well on dark backgrounds.

For a **light** UI/editor theme, the usual starting point is:
- background: `paper`
- primary text: `black` (or `base-950` for slightly softer text)
- syntax accents: mainly the `*-600` values

