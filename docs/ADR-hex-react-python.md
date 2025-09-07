# Architectural Decision Record (ADR)

This ADR consolidates final decisions derived from `docs/types-spec.md` and `docs/react-python-hex-migration.md`.

## ADR-001: Adopt Hexagonal + DDD Architecture
- Decision: Use Hexagonal (Ports & Adapters) with DDD layers: Domain, Application, Infrastructure, Interface (apps).
- Rationale: Separation of concerns, testability, technology-agnostic domain.
- Alternatives: Keep Angular-centric architecture; monolithic layering.
- Trade-offs: More scaffolding and boundaries enforcement; initial setup cost.

## ADR-002: Supabase Schema as Single Source of Truth for Types
- Decision: Treat Supabase/PostgreSQL schema as source of truth; auto-generate TypeScript and Python types.
- Rationale: Prevent type drift; ensure parity across languages.
- Alternatives: Handwritten types; manual syncing.
- Trade-offs: Generator complexity; CI pipeline maintenance.

## ADR-003: Unified Type Framework and Generators
- Decision: Centralize generation in an Nx type generator hub outputting TS (database/api/domain) and Python (type_utils) artifacts; add verification task.
- Rationale: Consistent, repeatable type generation and validation.
- Alternatives: Separate ad-hoc scripts per app.
- Trade-offs: Requires shared conventions and directory structure.

## ADR-004: Frontend and Backend Targets
- Decision: Support React (Next.js or Remix) for frontend and FastAPI for backend as first-class templates.
- Rationale: Align with project goals and modern stack.
- Alternatives: Angular-only; other backends.
- Trade-offs: Additional generators and examples to maintain.

## ADR-005: Python Ports with typing.Protocol; TS Ports with Interfaces
- Decision: Define Python ports/UoW/EventBus as `typing.Protocol`. Define TS ports as interfaces (optional abstract base for ergonomics).
- Rationale: Structural typing improves testability; reduces inheritance coupling.
- Alternatives: abc.ABC; concrete base classes everywhere.
- Trade-offs: Protocols are static-only; runtime isinstance checks not applicable.

## ADR-006: UoW and Event Bus as First-Class Abstractions
- Decision: Provide Unit of Work and Event Bus abstractions with in-memory implementations; adapters pluggable (e.g., SQLAlchemy/Supabase, Redis/SNS).
- Rationale: Transactional integrity and event-driven workflows with clear seams.
- Alternatives: Ad-hoc transactions; direct pub/sub coupling.
- Trade-offs: Slight complexity overhead for small features.

## ADR-007: Idempotent Nx Generators
- Decision: Generators must be idempotent (read-before-write, AST/markers, deterministic output) and include tests to prove it.
- Rationale: Safe re-runs and stable CI.
- Alternatives: Overwrite-once generators.
- Trade-offs: More careful implementation.

## ADR-008: Dependency Constraints via Tags
- Decision: Enforce ESLint-based dependency rules by tags: type:domain/application/infrastructure/ui and domain:*.
- Rationale: Maintain strict boundaries.
- Alternatives: Conventional adherence without tooling.
- Trade-offs: Rule configuration upkeep.

## ADR-009: CI/CD Type Synchronization and Local Hooks
- Decision: GitHub Actions workflow regenerates and verifies types; optional Husky pre-commit hook regenerates locally.
- Rationale: Prevents type drift on main branch.
- Alternatives: Manual discipline.
- Trade-offs: Extra CI minutes; hook maintenance.

## ADR-010: Strict Typing Policies
- Decision: TS projects use strict mode; Python uses mypy strict. Use modern features: TS `satisfies`, branded types; Python `Protocol`, `TypeAlias`/PEP 695, `Annotated` as needed.
- Rationale: Maximize correctness and IDE support.
- Alternatives: Looser typing.
- Trade-offs: Higher upfront typing cost.

## ADR-011: Repository Structure Alignment
- Decision: Align directories with the type spec and add hex layer folders per domain.
- Rationale: Consistency across apps and generators.
- Alternatives: Per-team structures.
- Trade-offs: Migration effort.

---

## ADR-012: Universal Web App Scaffold Generator (Next.js & Remix)
- Decision: Provide a single Nx generator that scaffolds a React web application using either Next.js or Remix selected via an option (`--framework=next|remix`) with idempotent behavior, reusable shared web client code, and consistent test scaffolding.
- Rationale: Eliminates duplication between separate framework-specific generators, ensures shared abstractions (typed API client, validation schemas) remain single-sourced, and simplifies maintenance while supporting both frameworks per ADR-004.
- Alternatives: Two distinct generators (next-app, remix-app); manual app setup.
- Trade-offs: Slightly more complex generator logic (conditional templates, option handling) and broader test coverage matrix.
- Implementation Notes: Read-before-write, marker regions for DI/client insertion, reuse or create shared library `libs/shared/web` for API client & schemas, ensure rerun with same args produces no diff, allow multiple invocations to create both frameworks under distinct names (e.g., `web-next`, `web-remix`).
- Consequences: Unified maintenance path; easier extension for future frameworks; clearer traceability to PRD-002 and SDS interface layer specs.

---

MVP ADRs: ADR-001, ADR-002, ADR-003, ADR-005, ADR-006, ADR-007, ADR-008, ADR-009, ADR-010, ADR-011, ADR-012.

Unresolved: None flagged.

---

## ADR-013: Deprecate Angular and Consolidate on React + FastAPI
- Decision: Remove Angular applications, libraries, and Angular-specific Nx plugins from the workspace. Consolidate the frontend strategy on React (Next.js and Remix) and keep FastAPI for backend.
- Rationale: Simplifies stack, reduces plugin upgrade coupling, and aligns with PRD focus on universal React apps. Enables smooth Nx upgrades without Angular migration constraints.
- Alternatives: Maintain Angular in parallel until after Nx upgrade. This adds upgrade complexity and long-lived dual-stack maintenance.
- Trade-offs: One-time migration effort to remove Angular projects and packages; temporary loss of any Angular demo apps.
- Consequences: All new interface-layer work targets Next.js/Remix; documentation and generators reflect React-only.

## ADR-014: Nx Upgrade Policy and Plugin Matrix
- Decision: Adopt an explicit upgrade policy: upgrade Nx to the latest stable (or LTS) along with first-party plugins (@nx/js, @nx/next, @nx/jest, @nx/linter, @nx/workspace) and community Python plugin when used. Upgrades run via `nx migrate`, with code mods reviewed in PR and a defined rollback path.
- Rationale: Keeps developer experience modern and secure; reduces drift across generators and executors.
- Alternatives: Ad-hoc upgrades per-package; increases risk of version skew.
- Trade-offs: Scheduled maintenance windows and CI validation during upgrades.
- Implementation Notes:
  - Use `nx migrate latest` and commit the migration.json.
  - Upgrade Node to a version supported by target Nx release (see TECHSPEC for matrix).
  - Apply plugin matrix updates (Next/Remix/Python) in lockstep.
  - Run workspace-wide lint, typecheck, tests, and sample generator e2e after migration.

Planned: ADR-013 and ADR-014 are enacted in the upgrade initiative.
