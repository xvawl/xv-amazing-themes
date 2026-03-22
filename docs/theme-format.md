# Theme Format (YAML)

Canonical themes live in `themes/` as YAML files so they can carry inline commentary.

## Style Conventions

- 2-space indent, no tabs
- Quote strings that could be mis-typed by YAML:
  - Colors: `"#RRGGBB"`
  - Values that begin with `$` (e.g. `"$palette.bg0"`)
- Avoid YAML anchors/aliases (`&` / `*`) to keep files grep-friendly
- Keep the data boring: maps and strings; avoid surprising YAML scalars and implicit types

## Shape (Recommended)

Each variant file (e.g. `light.yml`, `dark.yml`) should contain:

- `meta`: identifying info (name, variant, author, upstream attribution pointers)
- `palette`: physical colors (tokens)
- `semantic`: meaning/usage roles, referencing palette tokens

Example skeletons:
- `themes/_skeleton/light.yml`
- `themes/_skeleton/dark.yml`

