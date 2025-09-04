# React + Python Hexagonal Migration Plan

## Overview

This document proposes how to evolve this Nx plugin and workspace to support React frontends (Next.js or Remix) and Python (FastAPI) backends while embracing a Hexagonal/DDD architecture. It integrates the unified type framework defined in `docs/types-spec.md`, aims for idempotent generators, and avoids technical debt by enforcing boundaries and consistency.

## Current State: Findings

- Plugin scope is Angular-centric.
  - Generators use `@nx/angular` and NgRx (e.g., feature scaffolds, Angular module AST edits).
  - Domain scaffolding is minimal and not hex-oriented; no explicit entities/value objects/ports/adapters/UoW/event bus scaffolds.
  - Dependency rules exist via tags (type:ui, type:util, type:domain-logic; domain:*), but oriented to Angular modules.
- No React/Next/Remix support. No Python/FastAPI support.
- No built-in link to Supabase or the unified type system from the spec.

Implication: We’ll keep existing Angular generators intact but add parallel, framework-agnostic hex generators plus React and FastAPI adapters.

## Target Architecture (Hexagon + DDD)

- Layers
  - Domain: entities, value objects, domain events, aggregates, domain services (pure, framework-free, no IO).
  - Application: use cases, ports (TS interfaces / Python typing.Protocol), DTO contracts, UoW, event/message bus interface, mapping to domain.
  - Infrastructure: adapters that implement ports (persistence, HTTP, messaging), DI wiring, mappers, config.
  - Interface: React apps (Next.js/Remix), FastAPI routers/controllers; strictly depend on application layer.
- Cross-cutting
  - Type system: generated TS/Python types from DB schema and API contracts.
  - Validation: zod (TS) and pydantic (Python) at boundaries.
  - Eventing: in-memory bus default; pluggable adapters (e.g., Redis, SQS) later.
  - Transactions: UoW pattern per request (SQLAlchemy Session in Python, transactional unit in TS where applicable).

### Proposed Monorepo Structure

```
apps/
  web-next/            # Next.js app (or web-remix/)
  backend-api/         # FastAPI app
libs/
  shared/
    type-system/       # schemas, generators, validators (from spec)
    database-types/    # generated DB types (TS)
    api-types/         # generated API types (TS)
    domain-types/      # branded/shared domain types (TS)
    backend/type_utils # Python validators, helpers (mirrors spec)
  <domain>/
    domain/            # entities, value-objects, aggregates, events, services (pure)
    application/       # use-cases, ports (abstracts), dto, uow, event-bus interfaces
    infrastructure/    # adapters (db/http/messaging), DI wiring, mappers
  frontend/
    type-utils/        # TS guards and helpers
tools/
  type-generator/      # Nx type generator hub (TS/Python outputs)
```

This aligns with the spec’s directory layout while adding hex-specific subfolders.

## Unified Type Framework Integration

- Source of truth: Supabase/Postgres schema.
- Generation hub: `tools/type-generator` stays responsible for producing:
  - TypeScript: `libs/shared/database-types`, `libs/shared/api-types`, `libs/shared/domain-types`.
  - Python: `libs/backend/type_utils` (pydantic models, SQLModel/typing stubs, validators, Protocol interfaces).
- Application DTOs reference generated types to ensure consistency with DB/API contracts.
- Validators
  - TS: zod schemas live under `libs/shared/type-system/validators/ts/*` and are used in API clients/server.
  - Python: pydantic models under `libs/backend/type_utils` are used in FastAPI request/response models.

## Nx Plugin Enhancements

Add new generators to `libs/ddd` (or introduce `libs/hex` and soft-deprecate Angular-only naming). Keep existing Angular generators but add framework-agnostic + React/Python capabilities.

1) hex-domain (framework-agnostic)
- Inputs: domain name, shared? (bool), withEvents? (bool), withVO? (bool)
- Output: libs/<domain>/{domain,application,infrastructure}
  - domain: entities/, value-objects/, aggregates/, events/, services/
  - application: use-cases/, ports/, uow/, event-bus/, dto/
    - Ports: generate abstract port base classes/interfaces and test doubles (in-memory).
  - infrastructure: adapters/, mappers/, di/
- Tags: domain:<name>, type:domain|application|infrastructure
- Idempotent: create-if-missing, update DI/mappers with AST or marker sections.

2) port generator
- Inputs: domain, port name, kind (repository|service|gateway|message), language (ts|py|both)
- Output:
  - TS: interface and optional abstract base class in application/ports; default in-memory adapter in infrastructure/adapters; unit test harness.
  - Python: Protocol-based ports in application/ports (typing.Protocol); concrete adapters (e.g., SQLAlchemy/Supabase) in infrastructure; pytest fixture for in-memory fake adapter. Prefer structural typing for testability and minimal inheritance coupling.
- Updates DI wiring to bind port → adapter.

3) use-case generator
- Inputs: domain, name, input/output types (link to generated types), emitsEvents? (bool)
- Output: app/use-cases/<name>.ts with constructor-injected ports and UoW; corresponding Python use case optional.

4) uow generator
- TS: interface + in-memory implementation.
- Python: Protocol for `UnitOfWork` in application; SQLAlchemy-backed implementation integrating Session lifecycle per request.

5) event-bus generator
- TS: interface, in-memory bus; optional adapter stubs (Redis/SNS) behind configurable port.
- Python: Protocol for `EventBus` in application; pydantic-based event contracts and in-memory dispatcher; DI ready.

6) react-app wrappers
- next-app and remix-app presets that:
  - Add app boilerplate, wire `frontend/type-utils`, route-based data loaders (Remix) or app router (Next) examples using typed queries/guards.
  - Provide examples for calling application layer through adapters (HTTP client) with zod validation.

7) fastapi-app generator
- Scaffolds `apps/backend-api` with FastAPI, dependencies, typed routers/controllers, DI container, and UoW per request.
- Creates routers using pydantic models generated by the type system.

8) type-system tasks
- Add Nx targets: type-system:generate-all, type-system:verify (from the spec), and wire GitHub workflow and optional pre-commit hooks.

## Hex Patterns: Scaffolding Conventions

- Entities & Value Objects (TS)
```ts
export class UserId {
  private constructor(private readonly value: string) {}
  static create(v: string) { /* validate uuid */ return new UserId(v); }
  toString() { return this.value; }
}

export class User { /* fields, invariants, behavior */ }
```

- Ports (TS)
```ts
export interface UserRepositoryPort {
  getById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export abstract class AbstractUserRepository implements UserRepositoryPort {}
```

- Adapters (TS)
```ts
export class SupabaseUserRepository extends AbstractUserRepository { /* implements calls using generated types */ }
export class InMemoryUserRepository extends AbstractUserRepository { /* for tests */ }
```

- UoW (TS)
```ts
export interface UnitOfWork {
  withTransaction<T>(work: (ctx: { repos: ... }) => Promise<T>): Promise<T>;
}
```

- Events (TS)
```ts
export interface DomainEvent { type: string; occurredAt: string }
export interface UserCreated extends DomainEvent { userId: string }
```

- Event Bus (TS)
```ts
export interface EventBus { publish<T extends DomainEvent>(evt: T): Promise<void>; subscribe(...) }
export class InMemoryEventBus implements EventBus { /* simple pub/sub */ }
```

- Python mirrors these with Protocol-based ports, SQLAlchemy UoW implementation, and pydantic event models.

## Dependency Injection

- TypeScript: prefer lightweight DI (tsyringe or simple factory functions). Keep domain free of DI; DI lives in infrastructure/di, binding ports to adapters and wiring use cases.
- Python: FastAPI’s Depends for request-scoped resources; optionally use `dependency-injector` for explicit containers. Provide a per-request UoW with SQLAlchemy Session. Prefer structural typing (Protocol) injection over inheritance-based ABCs to reduce coupling and improve test doubles.

## Strict Typing & Modern Language Features

- TypeScript
  - Enable strict mode across TS projects ("strict": true). Use `satisfies` operator for DTOs to ensure excess property checks and maintainability.
  - Prefer branded types for IDs and constrained primitives (see `domain-types`).
  - Use `zod` schemas as the single runtime validator and infer types from schemas where possible to avoid divergence.

- Python
  - Use `typing.Protocol` for ports, UoW, EventBus, and service contracts. This supports structural typing and simpler testing.
  - Configure mypy in strict mode (`warn_unused_ignores`, `warn_redundant_casts`, `disallow_any_generics`, etc.) in `pyproject.toml`.
  - Prefer `pydantic` models for boundary validation and typed serialization; use `TypedDict` or `dataclasses` where lighter structures suffice.
  - Consider PEP 695 `type` statement or `typing.TypeAlias` for shared aliases. Use `Annotated[...]` for metadata like validators when appropriate.
  - Keep domain layer free of I/O; use pure dataclasses or pydantic models with `arbitrary_types_allowed=False` as needed.

Example (Python Protocol port):

```python
from typing import Protocol, Optional

class User: ...  # domain entity

class UserRepositoryPort(Protocol):
    async def get_by_id(self, user_id: str) -> Optional[User]:
        ...

    async def save(self, user: User) -> None:
        ...
```

Example (Python UoW Protocol):

```python
from typing import Protocol, TypeVar, Awaitable, Callable

T = TypeVar('T')

class UnitOfWork(Protocol):
    async def with_transaction(self, work: Callable[[], Awaitable[T]]) -> T:
        ...
```

## Dependency Constraints (ESLint)

- Enforce hex boundaries with tags:
  - type:domain can’t depend on application/infrastructure/ui
  - type:application can depend on domain and shared types only
  - type:infrastructure can depend on application and external libs
  - ui/apps depend on application; never on infrastructure directly
- Keep domain:* constraints to avoid cross-domain coupling except `shared`.

## Idempotent Generators: Strategy

- Read-before-write: don’t overwrite files; create on missing; append via AST or marker comments (e.g., `// <hex-di-bindings>` blocks) when updating DI, index barrels, or router registries.
- Content-aware edits: existing utilities like `fileContains` and AST edits should be generalized for framework-agnostic TS. For Python, use marker regions in files for safe re-insertion; avoid brittle string appends.
- Deterministic templates: generate the same output given the same inputs; use stable ordering and formatting.
- Retry-safe: generators detect prior runs (files, tags, and markers) and exit no-op.
- Tests: unit tests for generators asserting idempotency (run twice → no diff) and boundary rules.

## Migration Steps (Low Debt)

1) Introduce the shared type system as specified; generate initial TS/Python types from your current schema; enable CI type-sync and optional pre-commit regeneration.
2) Add `hex-domain` libraries for each domain (e.g., `libs/checkin/{domain,application,infrastructure}`) and migrate domain logic into entities/VOs/aggregates; keep framework code out.
3) Add ports for persistence and messaging; create in-memory adapters for tests and initial Supabase/HTTP adapters where needed.
4) Implement UoW and event bus (start with in-memory). Wire DI in infrastructure.
5) Add a FastAPI app with typed routers using the generated Python models; adopt UoW per request.
6) Add a Next.js or Remix app front-end; interact via application layer through typed clients and zod guards.
7) Lock in ESLint dependency constraints for the new tags and layers.
8) Expand coverage with tests: unit tests for domain/use-cases, contract tests for ports, and smoke tests for adapters.

## Testing & Quality Gates

- Build/lint/typecheck for TS libs and apps.
- Python: mypy + pytest; enforce pydantic validation parity tests mirrored from TS.
- Generator tests: expect idempotency and correct tagging/paths.
- Drift detection: reuse the spec’s `type-system:verify` to fail CI if generated types diverge from code expectations.

## Risks and Mitigations

- Mixed-language orchestration: Prefer clear boundaries and minimal cross-language coupling; share only generated schemas/types and API contracts.
- AST edits in Python: sidestep by using marker regions and clearly documented DI files.
- Supabase precision: map bigint to string in TS and int in Python as in the spec; provide explicit converter utilities.

## Acceptance Criteria

- New generators scaffold hex layers for TS and Python, including abstract ports and in-memory adapters.
- React (Next/Remix) and FastAPI examples compile and run using generated types and validators.
- ESLint constraints enforce hex boundaries.
- Generators are idempotent and covered by tests.
- CI syncs and verifies types using the unified type framework.

## Next Steps

- Implement the `hex-domain`, `port`, `use-case`, `uow`, and `event-bus` generators with idempotency.
- Add `next-app`, `remix-app`, and `fastapi-app` wrappers.
- Wire the type generator tasks and CI as per the spec.
- Provide a `MIGRATION.md` cookbook for moving existing Angular domains incrementally.
