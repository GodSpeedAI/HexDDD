# DDD/Hex Architecture Plugin for Nx Monorepos

This repository provides a plugin for Nx monorepos that facilitates the implementation of Domain-Driven Design (DDD) and Hexagonal Architecture principles. It includes tools for type generation, dependency management, and project structuring to help developers build scalable and maintainable applications.

## CI Status

[![Example Apps Smoke](https://github.com/SPRIME01/nx-ddd-hex-plugin/actions/workflows/smoke.yml/badge.svg)](https://github.com/SPRIME01/nx-ddd-hex-plugin/actions/workflows/smoke.yml)

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
  - `npm i` (package.json already pins @nx/remix and Remix runtime packages)
  - Serve: `nx serve web-remix`
  - Health route: `apps/web-remix/app/routes/health.ts:1` mirrors Next health behavior using `ENV.API_URL`.

## Expo App

- Install plugins and deps:
  - `npm i` (package.json already pins @nx/expo and required Expo/React Native deps)
- Start (dev): `nx run web-expo:start`
- App: `apps/web-expo/App.tsx` shows sample schema usage and a simple health indicator that probes `<NX_API_URL>/health` when absolute, or assumes local ok for relative/unset.

## CI Smoke

- Run `npm run ci:smoke` to smoke-check examples:
  - Next: `nx run web-next:build`
  - Remix: `nx run web-remix:build`
  - Expo: `nx run web-expo:type-check` and `nx run web-expo:lint` (start skipped for CI portability)
