# Release verification · 4 October 2026

Prepared release: **1.0.0**. The prepared release was subsequently published and verified on Vercel; see `DEPLOYMENT.md`.

## Automated checks

A clean `npm ci` followed by `npm run check` passed:

- Four regression tests: validated deep-link state, evidenced cohort scopes, alumni filtering, and collision-free finite positions for Ayame’s nine portrait/unit nodes.
- 78 talents, 31 relationship records and 114 source records validated, including unique IDs, member/source references, HTTPS evidence and every local portrait.
- All local HTML links resolve. Public data and output contain no private vault paths or Obsidian links. Build contains no source maps or node_modules.
- `npm audit --omit=dev`: no known vulnerabilities reported at verification time.

The static build has 90 files totaling 12,501,924 bytes, including 78 original profile PNGs. Bundled JavaScript totals 725,721 bytes before hosting compression. Deployment serves only `dist/`.

## Browser verification

Verified the minified build with the Codex Chromium browser under `/atlas/`, simulating a GitHub Pages repository subpath:

- Gen 1: four talents, one evidenced tie. Gen 3: four talents, seven scoped records.
- Circular layout and alumni filters preserved in shared URLs; Back restored the previous cohort view.
- All-talents navigation cleared the inspected unit. Excluding alumni produced 69 talents and 30 visible ties.
- Talent search, clearing, and source details worked. Clear-search target measured 44 × 44 CSS pixels.
- Fullscreen entered/exited and resized the map; the source panel remained accessible.
- Ayame PNG export succeeded: a valid 1966 × 1766 image, 1,204,139 bytes.
- A 390px-wide same-origin test frame exercised mobile CSS (375px content width after scrollbar), with no horizontal overflow. The browser’s viewport override did not apply, so the explicit frame was used instead. The temporary harness is excluded from the release.
- No browser console errors. Cytoscape emits its standard warning about the intentionally increased wheel sensitivity requested during prototype review.

Screenshots: `release-preview.jpg` and `mobile-preview.jpg`.

## Boundaries

Vercel production responses and headers have been checked. The alternative GitHub Pages workflow has not been deployed. Browser verification covered Chromium, not every browser/device. The research is a dated selection with incomplete relationship coverage, and dense graphs can still have edge crossings.
