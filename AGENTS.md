# AGENTS.md - AI Agent Guidelines for nx-ddd-hex-plugin

This document provides AI agents and developers with essential context, patterns, and guidelines for working effectively with this hexagonal architecture + DDD Nx plugin project.

## Project Overview

This is an Nx plugin that generates React + Python applications following Domain-Driven Design (DDD) and Hexagonal Architecture principles. The project has migrated away from Angular to focus on modern React/Python full-stack development.

### Core Architecture Principles

- **Hexagonal Architecture (Ports & Adapters)**: Clean separation between business logic and external concerns
- **Domain-Driven Design**: Rich domain models with clear bounded contexts
- **Type Safety**: Unified type generation from Supabase schema to TypeScript and Python
- **Technology Agnostic Domain**: Pure business logic with no framework dependencies

## Project Structure

```
apps/
├── backend-api/           # FastAPI application (Python)
├── web-next/             # Next.js frontend (React)
├── web-remix/            # Remix frontend (React)
└── web-expo/             # Expo mobile app (React Native)

libs/
├── shared/
│   ├── database-types/   # Generated TS types from Supabase
│   ├── api-types/        # Generated API contract types
│   ├── domain-types/     # Generated domain model types
│   ├── web/             # Shared web client, schemas, errors
│   └── type_system/     # Python type utilities
├── backend/
│   └── type_utils/      # Generated Python types and utilities
└── <domain>/
    ├── domain/          # Pure business logic (entities, value objects)
    ├── application/     # Use cases, ports, services
    └── infrastructure/  # Adapters, repositories, external integrations

tools/
└── type-generator/      # Custom type generation from Supabase schema
```

## Key Architectural Decisions (ADRs)

### ADR-001: Hexagonal + DDD Architecture
- Use Hexagonal (Ports & Adapters) with DDD layers
- Domain → Application → Infrastructure → Interface (apps)
- Strict dependency direction enforcement via ESLint tags

### ADR-002: Supabase Schema as Single Source of Truth
- PostgreSQL/Supabase schema drives all type generation
- Prevents type drift between languages and layers
- CI pipeline maintains type synchronization

### ADR-005: Protocol-Based Ports (Python) + Interface Ports (TS)
- Python ports use `typing.Protocol` for structural typing
- TypeScript ports use interfaces for maximum flexibility
- Enables easy testing with in-memory implementations

### ADR-007: Idempotent Generators
- All generators must be safe to run multiple times
- Use AST parsing and marker-based insertions
- Include comprehensive idempotency tests

## Layer Responsibilities & Dependency Rules

### Domain Layer (`libs/<domain>/domain/`)
- **Purpose**: Pure business logic, entities, value objects, domain events
- **Dependencies**: None (no framework imports)
- **Exports**: Domain models, business rules, domain services
- **ESLint Tags**: `type:domain`, `domain:<domain-name>`

### Application Layer (`libs/<domain>/application/`)
- **Purpose**: Use cases, application services, ports (interfaces/protocols)
- **Dependencies**: Domain layer only
- **Exports**: Use case handlers, port definitions, DTOs
- **ESLint Tags**: `type:application`, `domain:<domain-name>`

### Infrastructure Layer (`libs/<domain>/infrastructure/`)
- **Purpose**: Adapters, repositories, external service integrations
- **Dependencies**: Application + Domain layers, external packages
- **Exports**: Port implementations, adapters, DI configuration
- **ESLint Tags**: `type:infrastructure`, `domain:<domain-name>`

### Interface Layer (`apps/`)
- **Purpose**: UI (React), API controllers (FastAPI), presentation logic
- **Dependencies**: Application layer only (no direct infrastructure imports)
- **ESLint Tags**: `type:ui` or `type:api`

## Type Generation Workflow

### Source of Truth
- Supabase/PostgreSQL schema definitions
- API contract specifications
- Domain model requirements

### Generated Artifacts
- **TypeScript**: `libs/shared/database-types/`, `libs/shared/api-types/`
- **Python**: `libs/backend/type_utils/`
- **Validation**: zod schemas (TS), pydantic models (Python)

### Verification Process
- Structural parity checking between TS and Python types
- CI pipeline validates type consistency
- Auto-PR creation on schema changes

## Generator Patterns

### Core Generators
- `@ddd-plugin/ddd:domain` - Creates new domain with all layers
- `@ddd-plugin/ddd:feature` - Adds feature to existing domain
- `@ddd-plugin/ddd:api` - Creates FastAPI backend
- `@ddd-plugin/ddd:web-app` - Creates React frontend (Next.js/Remix/Expo)
- `@ddd-plugin/ddd:util` - Creates utility library

### Generator Options
```typescript
// Universal web app generator
{
  name: string;           // Project name (required)
  framework: 'next' | 'remix' | 'expo'; // Framework choice (required)
  apiClient: boolean;     // Generate shared API client (default: true)
  includeExamplePage: boolean; // Include example route/page (default: true)
  routerStyle?: 'app' | 'pages'; // Next.js only (default: 'app')
}
```

### Idempotency Requirements
- Read before write - check existing files
- Use AST parsing for code modifications
- Marker-based insertions: `// <hex-di-bindings>`, `// <hex-web-client-exports>`
- Deterministic output ordering
- Comprehensive double-run tests

## Tech Stack & Standards

### Frontend (React)
- **Frameworks**: Next.js 14 (App Router), Remix, Expo
- **Language**: TypeScript (strict mode)
- **Validation**: zod for runtime type checking
- **State**: Framework-native patterns, shared API client

### Backend (Python)
- **Framework**: FastAPI with async/await
- **Language**: Python 3.11+ with mypy strict mode
- **Validation**: pydantic v2 models
- **ORM**: SQLAlchemy 2.x with asyncio support
- **Testing**: pytest with Protocol-based mocking

### Database
- **Primary**: Supabase (PostgreSQL)
- **Types**: Auto-generated from schema
- **Migrations**: Supabase migrations with type sync

## Development Workflow

### Creating a New Domain
```bash
# Generate complete domain structure
nx g @ddd-plugin/ddd:domain --name=user-management

# This creates:
# - libs/user-management/domain/
# - libs/user-management/application/
# - libs/user-management/infrastructure/
# - Proper ESLint tags and project configuration
```

### Adding a React Frontend
```bash
# Generate Next.js app with shared client
nx g @ddd-plugin/ddd:web-app --name=admin-portal --framework=next

# Generate Remix app reusing shared client
nx g @ddd-plugin/ddd:web-app --name=customer-portal --framework=remix
```

### Type Generation & Sync
```bash
# Generate types from Supabase schema
nx run type-generator:generate

# Verify type parity
nx run type-generator:verify

# CI automatically creates PRs on schema changes
```

## Testing Strategy

### Domain Layer
- Pure unit tests with no mocking required
- Business rule validation
- Domain event testing

### Application Layer
- Use case testing with Protocol/interface mocks
- In-memory port implementations for fast tests
- Event bus verification

### Infrastructure Layer
- Integration tests with real adapters
- Contract tests ensuring port compliance
- Database migration testing

### End-to-End
- Full stack testing through the UI
- API contract validation
- Type safety verification across boundaries

## AI Agent Guidelines

### When Working with This Codebase

1. **Respect Layer Boundaries**: Never import infrastructure directly into domain or application layers
2. **Use Generated Types**: Always reference types from `libs/shared/` rather than creating custom ones
3. **Follow Nx Conventions**: Use proper project tags and follow the established workspace structure
4. **Maintain Idempotency**: When modifying generators, ensure they can be run multiple times safely
5. **Test Coverage**: Include unit tests for business logic and integration tests for boundaries

### Common Patterns to Follow

```typescript
// Domain Entity (pure, no framework dependencies)
export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly profile: UserProfile
  ) {}

  updateProfile(newProfile: UserProfile): UserProfileUpdated {
    // Business logic here
    return new UserProfileUpdated(this.id, newProfile);
  }
}

// Application Use Case
export class UpdateUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(request: UpdateProfileRequest): Promise<void> {
    const user = await this.userRepository.findById(request.userId);
    const event = user.updateProfile(request.profile);
    await this.userRepository.save(user);
    await this.eventBus.publish(event);
  }
}

// Infrastructure Adapter
export class SupabaseUserRepository implements UserRepository {
  async findById(id: UserId): Promise<User> {
    // Database implementation
  }
}
```

### Code Generation Best Practices

1. **AST-Based Modifications**: Use TypeScript compiler API for safe code modifications
2. **Marker Comments**: Use consistent marker patterns for insertions
3. **Template Organization**: Keep templates in `src/generators/<name>/files/`
4. **Schema Validation**: Validate all generator options with proper TypeScript types

### Architecture Compliance

- Domain code should have no `import` statements for external frameworks
- Use dependency injection consistently across all layers
- Implement ports as Protocols (Python) or interfaces (TypeScript)
- Maintain strict typing with no `any` types in production code

## Migration Notes

This project has recently migrated from Angular to React. Key changes:
- Removed all Angular dependencies and generators
- Updated to latest Nx version with React/Python focus
- Consolidated type generation into unified system
- Established hexagonal architecture patterns

When working with this codebase, focus on the current React + Python architecture rather than any legacy Angular patterns that might remain in documentation or comments.

## Support & Resources

- **Documentation**: See `docs/` for detailed ADRs, PRDs, and technical specifications
- **Examples**: Check `apps/` for reference implementations
- **Testing**: Follow patterns in `tests/` directory
- **Type Definitions**: Refer to generated types in `libs/shared/`

For questions about architectural decisions, consult the ADR documents in the `docs/` folder.

**Save all generated comprehensive summaries in the docs/workdocs/ folder for future reference**

