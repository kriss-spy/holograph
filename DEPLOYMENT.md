# Production deployment

Published and verified on **4 October 2026**.

- Public site: https://hololive-connections-atlas.vercel.app/
- Vercel project: `kriss-spys-projects/hololive-connections-atlas`
- Deployment: `dpl_9pyokvmZaCpE6ZhQpfyt4VHXD4c2`
- Immutable URL: https://hololive-connections-atlas-j7q79k4q4-kriss-spys-projects.vercel.app/
- Runtime: Node.js 22; static output from `npm run check`.

Public HTTP checks confirmed the home page, downloadable data, a portrait, About page and compiled assets all return 200. Security headers and immutable caching of hashed assets are present. The browser loaded Ayame's six talents and three ties without console errors.

To publish an update from this directory:

```sh
vercel deploy --prod --yes --scope kriss-spys-projects
```

The deployment runs regression tests and data/build validation before publishing. No application secrets are required. The CLI's automatically generated local OIDC environment file was removed after deployment; environment files are excluded from uploads and release archives.
