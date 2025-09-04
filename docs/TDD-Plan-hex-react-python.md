# TDD Implementation Plan: React + Python Hex Architecture

Grounded in ADR, PRD, SDS, and Technical Specifications. All tasks follow the Red-Green-Refactor-Regression cycle and maintain strict traceability.

Legend: [ADR-XXX], [PRD-XXX], [SDS-XXX]

## Phase 1: Foundation & Infrastructure

<del>
### Task 1.1: Type Generator Hub — Database → TS/Python
References: [ADR-002], [ADR-003], [PRD-004], [SDS-007], [SDS-013]
- Red (tests)
  - tests/ts/unit/typegen/db-to-ts.spec.ts: should map postgres types (uuid, bigint, timestamptz) to TS targets with transforms.
  - tests/py/unit/typegen/test_db_to_python.py: should map postgres types to Python (UUID, int, datetime) correctly.
  - tests/e2e/typegen/generate_all.spec.ts: should write outputs to libs/shared/database-types and libs/backend/type_utils.
- Green (impl)
  - TS: tools/type-generator/src/generators/types/generator.ts
  - Python: libs/shared/type_system/generators/db_to_python.py
  - Core: mapping tables, file writes, formatters.
- Refactor
  - Extract shared maps/constants; normalize naming; add deterministic file ordering.
- Regression
  - Run generator twice → no diff; verify task passes.
</del>
<del>
### Task 1.2: Verify Target — Structural Parity
References: [ADR-003], [PRD-004], [SDS-007], [SDS-016]
- Red
  - tests/ts/unit/typegen/verify.spec.ts: should detect mismatched nullability and type drift.
- Green
  - Add verify command that parses TS/Python artifacts and compares structures.
- Refactor
  - Improve error messages and diff output; add ignore list for known exceptions.
- Regression
  - CI job: generate + verify passes.
</del>

###  Task 1.3: ESLint Dependency Constraints
References: [ADR-008], [PRD-007], [SDS-012]
- Red
  - tests/ts/unit/lint/dependency-rules.spec.ts: importing infrastructure from domain triggers lint error; importing application from ui passes.
- Green
  - Configure eslint rules and tags across workspace; add example violating file in fixtures to assert failure.
- Refactor
  - Extract reusable ESLint config presets.
- Regression
  - Nx lint target fails for violations in CI.

### Task 1.4: CI/CD Type Sync Workflow
References: [ADR-009], [PRD-008], [SDS-007]
- Red
  - tests/ci/workflow.test.ts: simulate changed schema → workflow triggers generate + verify → PR created when diffs exist (mock).
- Green
  - Add .github/workflows/type-sync.yml and optional .husky/pre-commit as per spec.
- Refactor
  - Parameterize Node/Python versions; cache dependencies.
- Regression
  - CI dry run; pre-commit hook behaves idempotently.

## Phase 2: Core Domain Implementation

### Task 2.1: Hex Domain Scaffold Generator
References: [ADR-001], [ADR-011], [PRD-001], [SDS-002..SDS-006]
- Red
  - tests/ts/unit/generators/hex-domain.spec.ts: generates domain/application/infrastructure folders with tags; includes marker regions.
- Green
  - Implement generator under libs/ddd (or libs/hex); ensure idempotent writes.
- Refactor
  - Extract file templates; ensure stable casing and naming.
- Regression
  - Double-run produces no changes.

### Task 2.2: Port Generator (TS + Python Protocol)
References: [ADR-005], [PRD-005], [SDS-004], [SDS-008]
- Red
  - tests/ts/unit/generators/port.spec.ts: generates TS interface and in-memory adapter; DI binding markers added.
  - tests/py/unit/generators/test_port_generator.py: generates Protocol and fake adapter; mypy strict passes.
- Green
  - Implement generator with language=ts|py|both; add DI marker block updates.
- Refactor
  - Normalize DI binding insertions; de-duplicate on re-run.
- Regression
  - Re-run no-diff; lint/typecheck green.

### Task 2.3: UoW Generator (TS interface, Python Protocol + SQLAlchemy impl)
References: [ADR-006], [PRD-005], [SDS-009]
- Red
  - tests/ts/unit/generators/uow.spec.ts: interface emission and in-memory impl supports withTransaction.
  - tests/py/integration/test_uow_sqlalchemy.py: transactional behavior (commit/rollback) with SQLAlchemy Session.
- Green
  - Implement interface/Protocol and adapters; Python impl with context management.
- Refactor
  - Extract session factory; improve error handling.
- Regression
  - Unit + integration pass; idempotent generator checks.

### Task 2.4: Event Bus Generator (TS interface, Python Protocol)
References: [ADR-006], [PRD-005], [SDS-010]
- Red
  - tests/ts/unit/generators/event-bus.spec.ts: in-memory pub/sub; handlers invoked in order.
  - tests/py/unit/test_event_bus_inmemory.py: publish/subscription works; async handlers supported.
- Green
  - Implement in-memory EventBus; typed events (TS zod types; Python pydantic models).
- Refactor
  - Add simple filtering by event type; backpressure TODOs for future adapters.
- Regression
  - Full test suite remains green.

## Phase 3: Interface Layer Apps

### Task 3.1: FastAPI App Scaffold
References: [ADR-004], [PRD-003], [SDS-006], [SDS-014], [SDS-015]
- Red
  - tests/py/integration/test_health_endpoint.py: GET /health → 200 OK.
  - tests/py/integration/test_user_route.py: request/response models validated; UoW used; 422 on invalid payload.
- Green
  - Scaffold backend-api app; routers, DI container, UoW per request; wire pydantic models.
- Refactor
  - Extract settings; add error handlers.
- Regression
  - Pytest + mypy strict pass.

### Task 3.2: Next.js App Scaffold (or Remix)
References: [ADR-004], [PRD-002], [SDS-006], [SDS-014], [SDS-015]
- Red
  - tests/ts/e2e/web-next/app.spec.ts: home route renders; data fetching uses typed client; invalid data throws typed error.
- Green
  - Scaffold app; example page uses zod guards and shared types.
- Refactor
  - Extract API client; add runtime error boundary.
- Regression
  - Build + unit tests + simple e2e pass.

## Phase 4: Type System Validators & Parity

### Task 4.1: TS Zod Validators from Types
References: [ADR-002], [PRD-004], [SDS-014], [SDS-015]
- Red
  - tests/ts/unit/validators/user.spec.ts: zod schemas match DB constraints; invalid inputs fail with helpful messages.
- Green
  - Implement base validators and composites; export inferred types.
- Refactor
  - Extract shared email/uuid brands; unify date handling.
- Regression
  - Unit tests pass; no circular deps.

### Task 4.2: Python Pydantic Validators & Parity Tests
References: [ADR-002], [PRD-004], [SDS-016]
- Red
  - tests/py/unit/validators/test_user.py: pydantic models enforce same constraints.
  - tests/cross/test_validation_parity.py: TS vs Python parity on cases.
- Green
  - Implement pydantic models; add cross-language parity harness (subprocess or API simulation).
- Refactor
  - Common fixtures; error normalization.
- Regression
  - Full suite including parity stays green.

## Phase 5: Dependency Rules, Idempotency, and CI Hardening

### Task 5.1: Generator Idempotency Tests
References: [ADR-007], [PRD-006], [SDS-017]
- Red
  - tests/ts/unit/generators/idempotency.spec.ts: double-run equals no diff for each generator.
- Green
  - Implement read-before-write; markers; deterministic formatting.
- Refactor
  - Consolidate utilities.
- Regression
  - CI proves stable outputs on re-runs.

### Task 5.2: Lint/Typecheck Gates & Quality Metrics
References: [ADR-010], [PRD-009], [SDS-016], TECHSPEC
- Red
  - tests/quality/targets.spec.ts: nx run lint/type-check returns success; failing case triggers errors.
- Green
  - Configure TS strict and mypy strict; wire Nx targets.
- Refactor
  - Reduce cyclomatic complexity where hot spots exceed threshold.
- Regression
  - All gates pass in CI.

---

## Dependencies & Parallelization
- Blocking
  - Task 1.1 precedes 1.2; 2.1 precedes 2.2/2.3/2.4; 3.x depends on 2.x.
- Parallelizable
  - 1.3 and 1.4 can run in parallel after 1.1; 4.1 and 4.2 can proceed after 1.1.
- External
  - Supabase CLI/schema; SQLAlchemy; FastAPI.

## Test Categories & Standards
- Unit: < 100ms; Integration: < 1s; E2E: minimal happy paths.
- Assertion messages: "[Component] should [behavior] because [reason]".
- Fixtures: In-memory adapters/fakes; factory functions for entities; sample schema.

## Quality Metrics
- Coverage: ≥ 85% per lib/app; critical paths ≥ 95%.
- Complexity: Function cyclomatic complexity ≤ 10; modules ≤ 50 average.
- Performance: Type generation < 30s; validation < 1ms/object.

## Traceability Matrix (Summary)
- PRD-001 → Tasks 2.1, 2.2, 2.3, 2.4, 5.1
- PRD-002 → Tasks 3.2, 4.1, 5.2
- PRD-003 → Tasks 3.1, 2.3, 5.2
- PRD-004 → Tasks 1.1, 1.2, 4.1, 4.2
- PRD-005 → Tasks 2.2, 2.3, 2.4
- PRD-006 → Tasks 2.1, 2.2, 2.3, 2.4, 5.1
- PRD-007 → Tasks 1.3
- PRD-008 → Tasks 1.4
- PRD-009 → Tasks 5.2

---

## Collapsible Detailed Test Cases

<details>
<summary>Task 2.3: UoW SQLAlchemy tests</summary>

- test_commits_on_success: insert then read in same transaction, commit, row visible.
- test_rolls_back_on_exception: raise inside work; ensure no row persisted.
- test_nested_transactions_supported: inner rollback doesn’t affect outer commit.

</details>

<details>
<summary>Task 2.4: EventBus in-memory tests</summary>

- test_subscribe_and_publish: handler called once per event.
- test_ordering: handlers invoked FIFO; async handlers awaited.
- test_unsubscribe: no invocation after unsubscribe.

</details>

<details>
<summary>Task 1.2: Verify parity tests</summary>

- test_nullable_field_parity: TS '| null' ↔ Python Optional[]
- test_bigint_precision_policy: TS string ↔ Python int mapping
- test_timestamp_iso_policy: TS ISO string ↔ Python datetime isoformat

</details>

---

## Checklists
- [ ] Phase 1 complete (gen + verify + rules + CI)
- [ ] Phase 2 complete (hex scaffolds + ports + UoW + EventBus)
- [ ] Phase 3 complete (apps)
- [ ] Phase 4 complete (validators + parity)
- [ ] Phase 5 complete (idempotency + gates)
