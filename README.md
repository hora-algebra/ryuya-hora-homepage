# Ryuya Hora Homepage Draft

This is a static first draft for migrating the current Google Sites homepage to an independent site.

## Files

- `index.html`: profile overview and top-level entry page
- `papers/index.html`: papers, preprints, works in preparation, and miscellaneous writing
- `talks/index.html`: talk archive
- `notes/index.html`: notes and slides
- `activities/index.html`: academic activities by year
- `cv/index.html`: CV, awards, positions, and education/outreach
- `problems/index.html`: open problem reference trails
- `links/index.html`: external links
- `assets/papers/`: paper card thumbnails generated from public arXiv PDFs
- `styles.css`: visual design and responsive layout
- `scripts/site.js`: structured content and rendering logic

The site has no build step. It can be opened directly in a browser, hosted by GitHub Pages, or imported into Vercel as a static project.

Most links that were present on Google Sites have been added to the structured data. Note and slide cards currently point back to the old public Google Sites Notes page because the embedded Google Drive file URLs are not exposed as ordinary direct links in the public page HTML. Once the PDF files are copied into this repository, update each note record to point to its local file.

## Suggested next step

The current draft keeps content arrays in `scripts/site.js`. For automated updates, move those arrays to data files:

- `data/papers.json` or `data/papers.yml`
- `data/talks.json` or `data/talks.yml`
- `data/notes.json` or `data/notes.yml`
- `data/activities.json` or `data/activities.yml`

Then add a GitHub Actions workflow that:

1. Pulls selected Overleaf Git remotes using an Overleaf Git token stored in GitHub Secrets.
2. Builds PDFs with `latexmk` when needed.
3. Copies public PDFs into `public/papers/` or `public/slides/`.
4. Updates the corresponding metadata file.
5. Commits changes to `main`.
6. Lets Vercel deploy the latest commit automatically.

Use a `publish: true` flag for each paper or slide so private drafts do not become public accidentally.

## Content status

Most visible Profile, Papers, Talks, Activities, Notes, CV/Awards, Problems, and Links content was migrated from the public Google Sites page in April 2026. Downloadable files should be checked manually before production launch.
