# DDD/Hex Architecture Plugin for Nx Monorepos

This repository provides a plugin for Nx monorepos that facilitates the implementation of Domain-Driven Design (DDD) and Hexagonal Architecture principles. It includes tools for type generation, dependency management, and project structuring to help developers build scalable and maintainable applications.

## Nx Project Graph (Offline)

- An offline Nx project graph is checked into the repo for convenience: `nx-graph.html` at the workspace root.
- Open `nx-graph.html` in a browser to view the dependency graph. Supporting assets are in `static/`.

## Web Next App

- Env var: set `NX_API_URL` for server-side routes and clients consuming the API.
  - Option A (shell): `export NX_API_URL=http://localhost:8000`
  - Option B (file): create `apps/web-next/.env.local` with `NX_API_URL=http://localhost:8000`
- Serve: run `nx serve web-next` (pass `--port` to override the port if needed).
- Health route: `apps/web-next/app/api/health/route.ts:1` reads `ENV.API_URL` from `libs/shared/web/src/lib/env.ts:1` and:
  - If `NX_API_URL` is absolute (e.g., `http://localhost:8000`), proxies to `<NX_API_URL>/health`.
  - If relative or unset (defaults to `/api`), returns a local `{ ok: true, mode: 'local' }` response.

## Web Remix App

- Install plugins and deps:
  - `npm i -D @nx/remix@21.4.1`
  - `npm i react react-dom @remix-run/react @remix-run/node @remix-run/serve`
- Serve: `nx serve web-remix`
- Health route: `apps/web-remix/app/routes/health.ts:1` mirrors Next health behavior using `ENV.API_URL`.

## Expo App

- Install plugins and deps:
  - `npm i -D @nx/expo@21.4.1`
  - `npm i expo react react-dom react-native react-native-web react-native-svg` (plus any Expo presets you prefer)
- Start (dev): `nx run web-expo:start`
- App: `apps/web-expo/App.tsx` shows sample schema usage and a simple health indicator that probes `<NX_API_URL>/health` when absolute, or assumes local ok for relative/unset.
