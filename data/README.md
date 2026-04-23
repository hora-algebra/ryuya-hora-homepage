# Generated researchmap data

This directory stores public metadata generated from the researchmap API.

Run:

```sh
node scripts/sync-researchmap.mjs
```

The script writes:

- `data/researchmap.json`: normalized metadata for inspection and future build tooling
- `data/researchmap.generated.js`: browser-readable data used by the static pages
- `data/overleaf-projects.json`: configuration for Overleaf-backed GitHub repositories
- `data/overleaf-projects.example.json`: example configuration entries
- `data/overleaf.json`: normalized metadata for PDFs built from Overleaf-backed repositories
- `data/overleaf.generated.js`: browser-readable Overleaf artifact metadata used by the static pages

Configuration:

- `RESEARCHMAP_PERMALINK`: researchmap permalink, default `ryuyahora`
- `RESEARCHMAP_BASE_URL`: API base URL, default `https://api.researchmap.jp`
- `RESEARCHMAP_ACCESS_TOKEN`: optional OAuth bearer token if this is moved to an approved institutional WebAPI integration
- `RESEARCHMAP_LANGS`: language preference order, default `en,ja`

The public pages that display this generated data must show the researchmap credit.

## Overleaf artifacts

Run manually:

```sh
node scripts/sync-overleaf-artifacts.mjs
```

Each project entry can contain:

- `id`: stable local identifier
- `title`: display title
- `kind`: `paper`, `preprint`, `slide`, or `note`
- `publish`: only `true` entries are copied into the public site
- `repo`: `github:owner/repo` or a full Git URL
- `branch`: source branch, usually `main`
- `tex`: TeX entry point, usually `main.tex`
- `output`: public PDF path inside this homepage repository
- `match`: title/event strings used to attach `PDF` or `Slides` links to existing cards

Private GitHub repositories require `OVERLEAF_SYNC_TOKEN` in the environment.
