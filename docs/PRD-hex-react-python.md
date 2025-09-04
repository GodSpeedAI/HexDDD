# Product Requirements Document (PRD)

Based on `docs/types-spec.md` and `docs/react-python-hex-migration.md`.

## PRD-001: Hexagonal/DDD Scaffolding
- EARS: The system shall generate domain, application, and infrastructure layers per domain, including entities, value objects, aggregates, services, ports, adapters, UoW, and event bus (ADR-001, ADR-006, ADR-011).
- Acceptance: Running the generator creates the three-layer structure with tagged Nx projects and example files.
- Success Metric: 100% of new domains created via generator; boundaries enforced by ESLint tags.

## PRD-002: React Frontends (Next.js/Remix)
- EARS: The system shall provide templates to create Next.js or Remix apps that consume the application layer via typed clients and zod validation (ADR-004).
- Acceptance: New apps boot with example route and typed API call with guards.
- Success Metric: App compilations succeed; example page fetches and validates data.

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

MVP Scope: PRD-001, PRD-002, PRD-003, PRD-004, PRD-005, PRD-006, PRD-007, PRD-009.

Out of Scope (Phase 2): Optional event bus adapters (Redis/SNS); advanced performance tuning.
