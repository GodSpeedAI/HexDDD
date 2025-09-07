# Technical Specifications

Complementary details with traceability to ADR, PRD, and SDS.

## Tech Stack (ADR-004, ADR-010)
- Frontend: React 18, Next.js 14 (App Router) or Remix, TypeScript strict, zod.
- Backend: FastAPI, Python 3.11+, pydantic v2, SQLAlchemy 2.x, mypy strict.
- Types/Build: Nx, custom type generator (TS), CI with GitHub Actions.
- Database: Supabase/PostgreSQL.

## Upgrade Plan (ADR-013, ADR-014, PRD-010, PRD-011)
- Preconditions:
  - Confirm no business-critical Angular apps remain; archive or port any necessary examples.
  - Ensure Node version satisfies target Nx release support policy.
- Step 1 — Angular Decommission:
  - Remove Angular projects (`apps/*`, `libs/*`) and Angular-specific packages (`@angular/*`, `@nx/angular`).
  - Clean up tsconfigs, eslint configs, and tags referencing Angular.
- Step 2 — Nx + Plugin Upgrade:
  - Run `nx migrate latest`.
  - Review and commit migration.json and updated files.
  - Update first-party plugins: `@nx/js`, `@nx/jest`, `@nx/linter`, `@nx/next`, `@nx/workspace`.
  - Add or update community Python plugin if adopted.
- Step 3 — Validation:
  - npm ci, nx graph build, nx format:check, nx affected -t lint,test,build.
  - End-to-end smoke: run `@angular-architects/ddd:web-app` for both Next and Remix into temp dirs; ensure idempotency.
  - CI green on branch and main.
- Rollback:
  - Keep a branch with pre-migration state; if issues arise, revert via git and re-run in a smaller scope.

## Plugin Matrix (targeted, version-agnostic policy)
- Nx core: Nx latest stable (or LTS) and matching `@nx/*` packages.
- Web: `@nx/next` (Next.js), `@nx/remix` when Nx version supports it.
- Testing: `@nx/jest`.
- Lint: `@nx/linter` with ESLint latest supported.
- Python: community plugin (optional) or `run-commands` for serve/test/type-check.

## Integration Requirements (ADR-002, ADR-003, PRD-004, SDS-007)
- Type generator reads Supabase schema and outputs:
  - TS `libs/shared/database-types`, `libs/shared/api-types`, `libs/shared/domain-types`.
  - Python `libs/backend/type_utils` (validators/models, Protocol interfaces where applicable).
- Verify target ensures structure parity; CI workflow runs on schema changes.

## Security Considerations (SDS-015)
- Validate at boundaries: zod (TS) and pydantic (Python).
- Secrets via environment variables and Nx project.json not containing secrets.
- Enforce least privilege for DB connections; audit logging on sensitive operations.

## Performance Considerations (spec metrics)
- Type generation target time: < 30s.
- Validation time: < 1ms/object on average.
- Bundle size for generated type definitions: < 50KB.

## Generator Idempotency Mechanics (ADR-007, PRD-006, SDS-017)
- Pre-check file existence; avoid overwrite.
- Use AST or marker blocks for DI and index updates (`// <hex-di-bindings>`), deterministic formatting.
- Tests: double-run asserts no diff; focused unit tests per generator.

## Dependency Rules (ADR-008, PRD-007, SDS-012)
- ESLint tag policies:
  - domain → cannot import application/infrastructure/ui.
  - application → may import domain and shared.
  - infrastructure → may import application and externals; apps may not import infrastructure directly.
  - apps → may import application only.

## Universal Web App Generator (ADR-012, PRD-002)
- Purpose: Single generator scaffolds web app using Next.js or Remix based on `--framework` option while reusing a shared API client and validation layer.
- Options:
  - `name`: project name (required)
  - `framework`: `next` | `remix` (required)
  - `apiClient`: boolean (default true) – create shared client if missing
  - `includeExamplePage`: boolean (default true)
  - `routerStyle`: (Next.js only) `app` | `pages` (default `app`)
- Shared Artifacts Location: `libs/shared/web` (client.ts, errors.ts, schemas.ts, env.ts)
- Idempotency Strategy: Pre-existence checks per file; import insertion via marker `// <hex-web-client-exports>`; no duplication when generating both frameworks.
- Testing Strategy: Framework-specific e2e specs reuse shared fixtures; idempotency double-run test per framework.
- Error Handling: Normalized error types (ValidationError, NetworkError, UnexpectedError) with zod parse integration.
- Extensibility: Future frameworks add template directory + schema extension without changing base logic.

## Traceability Matrix
- ADR → PRD
  - ADR-001 → PRD-001
  - ADR-002 → PRD-004
  - ADR-003 → PRD-004
  - ADR-004 → PRD-002, PRD-003
  - ADR-005 → PRD-005
  - ADR-006 → PRD-001, PRD-005
  - ADR-007 → PRD-006
  - ADR-008 → PRD-007
  - ADR-009 → PRD-008
  - ADR-010 → PRD-009
  - ADR-011 → PRD-001
  - ADR-012 → PRD-002
- PRD → SDS
  - PRD-001 → SDS-001..SDS-006, SDS-011, SDS-012
  - PRD-002 → SDS-006, SDS-014, SDS-015
  - PRD-003 → SDS-006, SDS-009, SDS-014, SDS-015
  - PRD-004 → SDS-001, SDS-007, SDS-013, SDS-014, SDS-016
  - PRD-005 → SDS-004, SDS-008..SDS-010
  - PRD-006 → SDS-017
  - PRD-007 → SDS-012
  - PRD-009 → SDS-016

## MVP Scope Summary
- ADR: ADR-001/2/3/5/6/7/8/9/10/11/12
- PRD: PRD-001/2/3/4/5/6/7/9
- SDS: SDS-001..SDS-012, SDS-016..SDS-017

Unresolved/Deferred
- Non-in-memory event/messaging adapters; advanced caching strategies.
