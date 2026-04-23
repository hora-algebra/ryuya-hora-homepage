# Ryuya Hora Homepage Draft

This is a static first draft for an independent homepage.

## Files

- `index.html`: profile overview and top-level entry page
- `papers/index.html`: papers, preprints, works in preparation, and miscellaneous writing
- `talks/index.html`: talk archive
- `notes/index.html`: notes and slides
- `activities/index.html`: academic activities by year
- `cv/index.html`: CV, awards, positions, and education/outreach
- `problems/index.html`: open problem reference trails
- `favorite-topoi/index.html`: favorite topoi cabinet
- `links/index.html`: external links
- `styles.css`: visual design and responsive layout
- `scripts/site.js`: structured content and rendering logic
- `scripts/sync-researchmap.mjs`: researchmap API sync script
- `scripts/sync-overleaf-artifacts.mjs`: Overleaf-backed GitHub artifact sync script
- `data/researchmap.json`: normalized generated researchmap metadata
- `data/researchmap.generated.js`: browser-readable generated researchmap metadata
- `data/overleaf-projects.json`: local configuration for Overleaf-backed GitHub repositories
- `data/overleaf.json`: normalized generated Overleaf artifact metadata
- `data/overleaf.generated.js`: browser-readable generated Overleaf artifact metadata
- `.github/workflows/sync-researchmap.yml`: scheduled/manual researchmap metadata sync
- `.github/workflows/sync-overleaf.yml`: manual Overleaf artifact sync

The site has no build step. It can be opened directly in a browser, hosted by GitHub Pages, or imported into Vercel as a static project.

Most links have been added to the structured data. Paper cards use inline SVG diagrams rather than bitmap thumbnails, with TeX math labels rendered by KaTeX on the Papers page and home page. Note and slide cards currently point to a source page because the embedded file URLs are not exposed as ordinary direct links in the public page HTML. Once the PDF files are copied into this repository, update each note record to point to its local file.

## researchmap sync

The site can now pull public metadata from researchmap's API endpoint for `ryuyahora`.

Run locally:

```sh
node scripts/sync-researchmap.mjs
```

This updates `data/researchmap.json` and `data/researchmap.generated.js`. The Papers, Talks, and CV/Awards pages load the generated JavaScript file directly, so they still work from `file://` without a local server.

The GitHub Actions workflow `.github/workflows/sync-researchmap.yml` runs the same sync manually or once per day. It commits only when the generated data changes. If this is later moved to an approved institutional WebAPI integration, set `RESEARCHMAP_ACCESS_TOKEN` as a GitHub secret.

## Overleaf-to-homepage sync

The intended workflow is:

1. Keep each paper, note, or slide deck in its own GitHub repository.
2. Link that repository to the corresponding Overleaf project.
3. Edit normally in Overleaf.
4. In Overleaf, use the GitHub sync menu to push changes to GitHub.
5. In this homepage repository, run the `Sync Overleaf artifacts` GitHub Action manually.

The action clones the configured GitHub repositories, builds the configured TeX files with `latexmk`, copies the resulting PDFs into `assets/overleaf/`, updates `data/overleaf.json` and `data/overleaf.generated.js`, then commits the result. The Papers, Talks, Notes, and home pages load `data/overleaf.generated.js`; matching paper records get a `PDF` link, matching talks get a `Slides` link, and slide/note artifacts appear on the Notes page.

Configure projects in `data/overleaf-projects.json`. Use `data/overleaf-projects.example.json` as the template. Only entries with `"publish": true` are copied to the homepage.

For private Overleaf-backed GitHub repositories, add a GitHub repository secret named `OVERLEAF_SYNC_TOKEN` with read access to those source repositories. The built-in `GITHUB_TOKEN` is still used by the action to commit changes back to this homepage repository.

The same workflow also accepts a `repository_dispatch` event named `overleaf-updated`. If a source repository later gets a small workflow that sends that event after each Overleaf GitHub push, the homepage sync can become automatic without changing this repo again.

## Direct problem comments

The Problems page is wired for direct, per-problem comments through GitHub Discussions and giscus. Visitors sign in with GitHub and comment inside the homepage; it is not an email form. Each selected problem uses a stable discussion term such as `problem:2.0.2`, so the discussion survives title changes.

The current homepage repository is private and has Discussions disabled, so embedded comments are intentionally disabled in `siteData.problemComments` for now. To activate them:

1. Create or choose a public GitHub repository for comment storage.
2. Enable Discussions in that repository and create a category such as `Problem discussions`.
3. Install the giscus GitHub app for that repository.
4. Copy the giscus `repoId` and `categoryId` into `siteData.problemComments` in `scripts/site.js`, then set `enabled: true`.

Comment deletion and moderation happen in GitHub Discussions. Repository owners and moderators can delete comments there; no private GitHub token is exposed in this static site.

Important privacy tradeoff: giscus requires a public GitHub repository, so the discussion threads may be visible on GitHub and may be indexed independently. If comments must remain private, use a Vercel/Supabase/Firebase backend with authentication instead of giscus.

## Suggested next step

The current draft still keeps the curated content arrays in `scripts/site.js`. For broader automated updates, move those arrays to data files:

- `data/papers.json` or `data/papers.yml`
- `data/talks.json` or `data/talks.yml`
- `data/notes.json` or `data/notes.yml`
- `data/activities.json` or `data/activities.yml`

Then extend the GitHub Actions workflow so it also:

1. Updates the corresponding metadata file from TeX-side metadata.
2. Opens a pull request instead of committing directly, if review is wanted.
3. Triggers from repository dispatch events sent by individual source repositories.

Use a `publish: true` flag for each paper or slide so private drafts do not become public accidentally.

## Content status

Most visible Profile, Papers, Talks, Activities, Notes, CV/Awards, Problems, and Links content was drafted in April 2026. Downloadable files should be checked manually before production launch.
