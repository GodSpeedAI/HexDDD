# Product Requirements Document (PRD)

Based on `docs/types-spec.md` and `docs/react-python-hex-migration.md`.

## PRD-001: Hexagonal/DDD Scaffolding
- EARS: The system shall generate domain, application, and infrastructure layers per domain, including entities, value objects, aggregates, services, ports, adapters, UoW, and event bus (ADR-001, ADR-006, ADR-011).
- Acceptance: Running the generator creates the three-layer structure with tagged Nx projects and example files.
- Success Metric: 100% of new domains created via generator; boundaries enforced by ESLint tags.

## PRD-002: React Frontends (Next.js/Remix/Expo)
- EARS: The system shall provide a single universal generator to create a Next.js, Remix, or Expo app (selected via `--framework=next|remix|expo`) that consumes the application layer via a shared typed API client and zod validation (ADR-004, ADR-012).
- Generator Options: `name` (required), `framework` (required: next|remix|expo), `apiClient` (boolean default true), `includeExamplePage` (boolean default true), `routerStyle` (next only: app|pages, default app).
- Acceptance: Running the generator creates an app with an example route/page (or screen for Expo) using the shared API client and validation guards. Re-running with identical options yields no file changes. Invoking for alternate frameworks adds additional apps while reusing shared code without duplication.
- Success Metric: App build passes; example route/screen fetches and validates data; invalid/malformed data path produces typed validation error surfaced in tests; double-run idempotency test passes.

## PRD-003: FastAPI Backend
- EARS: The system shall generate a FastAPI app with typed routers/controllers, DI setup, and a per-request UoW (ADR-004, ADR-006).
- Acceptance: App starts with a health endpoint; example route uses pydantic models and UoW.
- Success Metric: Liveness and example endpoints pass tests; mypy passes in strict mode.

## PRD-004: Unified Type Generation (TS/Python)
- EARS: The system shall generate synchronized TS and Python types from the Supabase schema and API contracts (ADR-002, ADR-003).
- Acceptance: Running type generation produces TS database/api/domain types and Python type_utils; verify task passes.
- Success Metric: CI verify stage passes; diffs are auto-PR’d when types change.

## PRD-005: Python Ports/UoW/Event Bus via Protocol
- EARS: The system shall define Python ports, UoW, and EventBus using typing.Protocol with in-memory implementations (ADR-005, ADR-006).
- Acceptance: Generated application code uses Protocols; adapters implement them; tests use in-memory fakes.
- Success Metric: mypy strict passes; contract tests pass.

## PRD-006: Idempotent Generators
- EARS: The system shall implement idempotent generators (read-before-write, AST/markers) with tests (ADR-007).
- Acceptance: Running a generator twice causes no changes; tests cover idempotency.
- Success Metric: CI proves no-diff on double-run in example workspace.

## PRD-007: Dependency Constraints and Tagging
- EARS: The system shall enforce ESLint tag rules preventing forbidden dependencies between layers and domains (ADR-008).
- Acceptance: Violating imports produce lint errors; rules are part of Nx lint targets.
- Success Metric: CI fails on violations; local lint prevents merges.

## PRD-008: CI/CD Type Sync and Local Hooks
- EARS: The system shall provide a GitHub workflow to regenerate and verify types and an optional pre-commit hook to regenerate types locally (ADR-009).
- Acceptance: Workflow runs on schema changes; hook regenerates types on staged schema changes.
- Success Metric: PRs contain synchronized type updates; no type drift detected.

## PRD-009: Strict Typing Policies
- EARS: The system shall enable TypeScript strict mode and mypy strict and use modern features (`satisfies`, branded types, Protocols) (ADR-010).
- Acceptance: Strict settings are configured; example code compiles/passes type checks.
- Success Metric: Zero type-check warnings/errors in templates.

---

## PRD-012: Supabase Development Stack Automation
- EARS: The system shall provide a ready-to-run Supabase stack (Docker Compose) exposed through Nx targets so developers can start/stop/reset local infrastructure and configure env files for hosted or local Supabase usage (ADR-002, ADR-015).
- Acceptance: `tools/supabase/project.json` registers `supabase-devstack:start|stop|reset|status`; `docker/docker-compose.supabase.yml`, `example.env`, and app-specific `.env.example` files exist with documented variables.
- Success Metric: New developers can run `cp example.env .env.supabase.local` and `nx run supabase-devstack:start` to obtain a working stack; docs and tests verify presence of targets and env scaffolding.

## PRD-010: Angular Decommissioning
- EARS: The system shall remove Angular applications, libraries, and Angular-specific Nx packages from the repository.
- Acceptance: No Angular projects remain under `apps/` or `libs/`; package.json has no `@angular/*` or `@nx/angular`; CI passes.
- Success Metric: Zero Angular-related dependencies; all generators/tests unaffected.

## PRD-011: Nx and Plugin Upgrades
- EARS: The system shall upgrade Nx and first-party plugins to the latest stable (or LTS) and align community plugins (e.g., Python) accordingly.
- Acceptance: `nx migrate` changes are applied; code compiles; lint/typecheck/tests pass; generator e2e smoke runs.
- Success Metric: CI green on main; no deprecated executor warnings.

MVP Scope: PRD-001, PRD-002, PRD-003, PRD-004, PRD-005, PRD-006, PRD-007, PRD-009.

Out of Scope (Phase 2): Optional event bus adapters (Redis/SNS); advanced performance tuning.
