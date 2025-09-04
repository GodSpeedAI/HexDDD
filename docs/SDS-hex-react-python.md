# Software Design Specification (SDS)

Technical design derived from `docs/types-spec.md` and `docs/react-python-hex-migration.md`.

## SDS-001: System Architecture (PRD-001, PRD-004)
- Layers: Domain (pure), Application (use-cases, ports, UoW, EventBus), Infrastructure (adapters, DI), Interface (React/FastAPI).
- Type flow: Supabase → Type Generator Hub → TS/Python types → validators and models.

## SDS-002: Repository Structure (PRD-001)
- apps/
  - web-next/ or web-remix/
  - backend-api/
- libs/
  - shared/{type-system,database-types,api-types,domain-types,backend/type_utils}
  - <domain>/{domain,application,infrastructure}
  - frontend/type-utils
- tools/type-generator/

## SDS-003: Domain Layer (PRD-001)
- Entities, Value Objects, Aggregates, Domain Events, Domain Services (TS classes; Python dataclasses/pydantic optional).
- No framework imports; pure logic and invariants.

## SDS-004: Application Layer (PRD-001, PRD-005)
- Use-cases inject ports and UoW; raise/publish domain events via EventBus.
- TS: Ports as interfaces; Python: Ports/UoW/EventBus as Protocols.
- DTOs reference generated types (TS) and pydantic models (Python) at boundaries.

## SDS-005: Infrastructure Layer (PRD-001, PRD-005)
- Adapters implement ports: persistence (Supabase/SQLAlchemy), messaging, external APIs.
- DI wiring binds ports to adapters; provide in-memory defaults for tests.

## SDS-006: Interface Layer (PRD-002, PRD-003)
- React apps call application layer via typed clients and zod guards.
- FastAPI routers/controllers use pydantic models, inject UoW and ports via Depends/container.

## SDS-007: Type Generation Hub (PRD-004)
- Generator inputs: database/api/schema; outputs TS and Python artifacts.
- Verify task compares structures and ensures parity; CI runs generate + verify.

## SDS-008: Ports and Protocols (PRD-005)
- Example TS port:
  - `interface UserRepositoryPort { getById(id: string): Promise<User|null>; save(user: User): Promise<void>; }`
- Example Python port (Protocol):
  - `class UserRepositoryPort(Protocol): async def get_by_id(self, user_id: str) -> Optional[User]: ...; async def save(self, user: User) -> None: ...`

## SDS-009: Unit of Work (PRD-005)
- TS: `UnitOfWork.withTransaction<T>(work) -> Promise<T>` with in-memory default.
- Python: `UnitOfWork.with_transaction(work) -> Awaitable[T]` with SQLAlchemy Session per request; transactional context management.

## SDS-010: Event Bus (PRD-005)
- TS: EventBus interface + in-memory implementation; pluggable adapters.
- Python: EventBus Protocol + in-memory dispatcher; pydantic events.

## SDS-011: Dependency Injection (PRD-001)
- TS: factory functions or tsyringe; DI in infrastructure/di.
- Python: FastAPI Depends + optional dependency-injector; container config in infrastructure/di.

## SDS-012: ESLint/Rules and Tags (PRD-007)
- Configure tag-based restrictions preventing cross-layer/domain violations.

## SDS-013: Data Models & Database Schema (PRD-004)
- DB schema is canonical; generated TS `Database` types and Python SQLModel/typing map columns:
  - bigint → TS string, Python int; timestamp → TS string ISO, Python datetime.

## SDS-014: API Specifications (PRD-002, PRD-003, PRD-004)
- TS API contracts generated under `libs/shared/api-types`; Python pydantic models mirror.
- FastAPI routers import pydantic models; frontend clients import TS API types.

## SDS-015: Error Handling (PRD-002, PRD-003)
- TS: zod parse errors converted to typed error responses at boundaries.
- Python: pydantic ValidationError mapped to HTTP 422/400; internal type errors → 500 with logging.

## SDS-016: Testing Strategy (PRD-006, PRD-009)
- TS: unit tests (domain, use-cases), contract tests for ports, generator idempotency tests.
- Python: pytest for adapters/use-cases, mypy strict; validation parity tests between TS and Python (as per spec).
- CI: run type generation + verify; lint + typecheck gates.

## SDS-017: Idempotent Generators (PRD-006)
- Read-before-write; AST-aware edits; marker regions; deterministic formatting.

## SDS-018: Security & Performance Hooks (PRD-002, PRD-003)
- Security: input validation at edges; secrets via env; least-privilege DB roles.
- Performance: caching where safe; target generation < 30s; validation < 1ms/object (per spec metrics).

---

MVP: SDS-001..SDS-012, SDS-016..SDS-017.

Unresolved: Non-in-memory event bus adapters (defer to phase 2).
