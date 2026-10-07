# Hololive connections atlas

A static Cytoscape.js relationship atlas, prepared for GitHub Pages or Vercel. This release contains the retained Cytoscape app, evidence, local portraits and deployment configuration. No server, database or secrets are required.

## Build and check

Use Node.js 22. From this directory:

```sh
npm ci
npm run check
npm run preview
```

`check` runs the model/layout regressions, validates research references and portraits, builds minified content-hashed scripts/styles, and checks public files and links. `preview` serves only `dist/` on loopback port 8766. Set `PORT` to change the port; `BASE_PATH=/atlas/` simulates a GitHub Pages project subpath. This preview server is for local verification, not public hosting.

Deploy **only `dist/`**. The source and assets needed to reproduce it are included here; `node_modules/` and `dist/` are ignored by Git. Dependencies are pinned in `package-lock.json`.

## GitHub Pages

1. Put the contents of this project at the root of a GitHub repository.
2. In repository **Settings → Pages**, select **GitHub Actions** as the build source.
3. Run **Publish atlas to GitHub Pages** manually from the Actions tab. The separate Check atlas workflow runs on pushes and pull requests.
4. Open the URL reported by the deploy job. Verify a shared link such as `#cohort=gen-3&layout=circle`.

Relative asset URLs support both `https://account.github.io/repository/` and a custom domain. The deploy workflow deliberately requires a manual dispatch. [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Vercel

Import the repository into Vercel with this directory as the project root and select Node.js 22. `vercel.json` configures the install, validation/build, output directory and response headers. The framework preset is Other. No environment variables are required.

A CLI deployment can be reviewed first with `vercel`; use `vercel --prod` when ready to publish. This directory is linked to the `hololive-connections-atlas` project under `kriss-spys-projects`. [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json).

The Vercel configuration caches hashed JavaScript/CSS immutably and revalidates the downloadable research snapshot. GitHub Pages manages its own response headers; both platforms serve the same files.

## Updating research

Edit `data/hololive-relations.json`, preserve the primary evidence and dates, add portraits to `public/assets/`, then run `npm run check`. The build uses this same snapshot for the graph and data download. Do not add private filesystem paths or personal vault links: validation rejects them. The roster date and relationship date in `src/index.html`, unit count in its directory tabs, and counts in `public/about.html` should be updated with a new snapshot.

Cross-agency units can reference `external_participants` with `external:` IDs, credited names, optional evidenced agency, performer-owned profile and primary source IDs. These guests appear in complete source-panel lineups without adding portraits or changing the selected Hololive roster. Every group retains its full `member_ids` and membership edges; a filtered graph labels how many members are shown, including groups with one Hololive portrait. Never replace a group with a Hololive-only duo.

`research/holodex-name-audit.json` retains discovery routes and primary verification for the selected Holodex expansion, alongside the Japanese-name audit. Both are downloadable from About.

The [6 October connection completion audit](research/connection-completion.md) records 38 accepted additions across issues #3–#8 and explicit reasons for the remaining candidates. Preserve Japanese names and searchable aliases under a single canonical record. `reading_aids` supplies searchable romanizations separately from performer-attested aliases.

The [7 October Japanese wiki audit](research/wiki-name-audit.md) follows those gaps and audits recoverable wiki tables for issue #10. Its [candidate ledger](research/wiki-name-audit.json) retains complete memberships, primary citations, verification methods and unsupported alias claims. Its 65 selected candidates now have primary support, including one explicitly provisional trio. The build includes this labelled discovery audit as an About-page download. The legacy index remains inaccessible, so this is a partial audit rather than an exhaustive census.

Historical roster and cohort work for issues #2 and #9 is documented in [historical roster evidence](research/historical-roster.md) and [cohort context](research/cohort-context.md). Mel and Rushia use `former` status with contract-termination dates; the former-member filter includes alumni and terminated contracts. The legacy `alumni=0` URL parameter remains supported. Secondary affiliations share one canonical talent record, and Council/Promise links provide navigation without changing membership.

Topics are defined in `src/atlas.js`; all talents remains the first view. Layout helpers and pure URL/scope logic are separate modules. Unit membership stays a group rather than implied pairwise friendships.

## Release scope

- Fullscreen map with source details; 44px search-clear target; head-focused portraits.
- Automatic fCoSE, circular and cohort-grid layouts with collision spacing for small neighborhoods.
- Cohort, talent and unit deep links, browser Back/Forward, shareable layout/alumni filters.
- Source-backed Gen 1 and Gen 3 additions; explicit partial-unit and research coverage labels.
- Local bundled assets, startup failure message, image-load-aware PNG export and mobile controls.

Evidence coverage remains incomplete; a missing edge does not mean no relationship exists. Force-directed layout reduces crowding but cannot guarantee a crossing-free dense graph. The data is a dated snapshot, not a live roster.

This is an unofficial fan project. Portraits © COVER Corp.; artwork rights remain with their owners. Vendor license files ship with the site. Published on Vercel on 4 October 2026: https://hololive-connections-atlas.vercel.app/ . See `DEPLOYMENT.md` for the deployment record.
