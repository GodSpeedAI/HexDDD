# Technical Specifications

Complementary details with traceability to ADR, PRD, and SDS.

## Tech Stack (ADR-004, ADR-010)
- Frontend: React 18, Next.js 14 (App Router) or Remix, TypeScript strict, zod.
- Backend: FastAPI, Python 3.11+, pydantic v2, SQLAlchemy 2.x, mypy strict.
- Types/Build: Nx, custom type generator (TS), CI with GitHub Actions.
- Database: Supabase/PostgreSQL.

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
- ADR: ADR-001/2/3/5/6/7/8/9/10/11
- PRD: PRD-001/2/3/4/5/6/7/9
- SDS: SDS-001..SDS-012, SDS-016..SDS-017

Unresolved/Deferred
- Non-in-memory event/messaging adapters; advanced caching strategies.
