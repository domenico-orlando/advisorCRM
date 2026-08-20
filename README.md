# advisorCRM

advisorCRM is a React + Vite application.

## Development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages deployment

This repository is configured for GitHub Pages deployment from the `main` branch using the workflow at:

`.github/workflows/deploy-pages.yml`

To publish:

1. In GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push changes to `main` (or run the workflow manually from Actions).

The Vite `base` path is set to `/advisorCRM/` to match the repository name.
