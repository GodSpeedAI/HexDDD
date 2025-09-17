# Nx DDD Hexagonal Architecture Plugin

> A comprehensive Nx plugin for building scalable applications with Domain-Driven Design and Hexagonal Architecture patterns.

[![CI Status](https://github.com/SPRIME01/nx-ddd-hex-plugin/actions/workflows/smoke.yml/badge.svg)](https://github.com/SPRIME01/nx-ddd-hex-plugin/actions/workflows/smoke.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is this?

This plugin brings enterprise-grade architectural patterns to Nx monorepos. It scaffolds applications following Domain-Driven Design (DDD) and Hexagonal Architecture principles, ensuring clean separation of concerns and maintainable codebases at scale.

**Key Benefits:**
- 🏗️ **Structured Architecture**: Enforced domain/application/infrastructure layers
- 🔄 **Type Safety**: End-to-end type generation from database to UI
- 🚀 **Multi-Framework**: Supports React (Next.js), Remix, Expo, and FastAPI
- 📊 **Dependency Rules**: ESLint constraints prevent architectural violations
- 🧪 **Battle-Tested**: Comprehensive test coverage and CI validation

## Quick Start

```bash
# Install the plugin
npm install @ddd-plugin/ddd

# Generate a domain
nx g @ddd-plugin/ddd:hex-domain user-management

# Generate applications
nx g @ddd-plugin/ddd:web-app admin-portal --framework=next
nx g @ddd-plugin/ddd:web-app mobile-app --framework=expo
```

## Architecture Overview

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Interface     │  │   Application   │  │     Domain      │
│  (Next/Remix)   │──│   Use Cases     │──│   Entities      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                      │                      │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Infrastructure  │  │     Ports       │  │   Value Objects │
│  (FastAPI/DB)   │──│  (Interfaces)   │──│   Domain Events │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Generators Reference

### Web Applications

#### Next.js Application

```bash
nx g @ddd-plugin/ddd:web-app my-app --framework=next
```

**Generated Structure:**
```
my-app/
├── src/
│   └── app/
│       ├── layout.tsx           # Root layout with providers
│       ├── page.tsx             # Home page with shared client
│       ├── globals.css          # Global styles
│       └── api/
│           └── health/
│               └── route.ts     # Health check endpoint
├── public/
│   └── favicon.ico
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS setup
├── tsconfig.json               # TypeScript configuration
└── project.json                # Nx project configuration

libs/shared/web/                 # Shared client (auto-generated)
├── src/
│   ├── client.ts               # Typed API client
│   ├── schemas.ts              # Zod validation schemas
│   ├── errors.ts               # Error handling utilities
│   └── env.ts                  # Environment configuration
```

#### Remix Application

```bash
nx g @ddd-plugin/ddd:web-app my-app --framework=remix
```

**Generated Structure:**
```
my-app/
├── app/
│   ├── root.tsx                # Root component with providers
│   ├── entry.client.tsx        # Client entry point
│   ├── entry.server.tsx        # Server entry point
│   └── routes/
│       ├── _index.tsx          # Home route with loader
│       └── health.ts           # Health check route
├── public/
│   └── favicon.ico
├── remix.config.js             # Remix configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── project.json                # Nx project configuration

libs/shared/web/                 # Shared client (reused if exists)
└── (same structure as above)
```

#### Expo Application

```bash
nx g @ddd-plugin/ddd:web-app my-app --framework=expo
```

**Generated Structure:**
```
my-app/
├── src/
│   └── app/
│       ├── App.tsx             # Main app component
│       ├── screens/
│       │   └── HomeScreen.tsx  # Home screen with API integration
│       └── components/
│           └── HealthCheck.tsx # Health status component
├── assets/
│   ├── images/
│   │   ├── icon.png
│   │   └── splash.png
│   └── fonts/
├── app.json                    # Expo configuration
├── metro.config.js             # Metro bundler config
├── babel.config.js             # Babel configuration
├── tsconfig.json               # TypeScript configuration
└── project.json                # Nx project configuration

libs/shared/web/                 # Shared client (reused if exists)
└── (same structure as above)
```

### Domain Architecture

#### Hexagonal Domain

```bash
nx g @ddd-plugin/ddd:hex-domain user-management
```

**Generated Structure:**
```
libs/user-management/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts      # User aggregate root
│   │   └── profile.entity.ts   # Profile entity
│   ├── value-objects/
│   │   ├── email.vo.ts         # Email value object
│   │   └── user-id.vo.ts       # User ID value object
│   ├── events/
│   │   └── user-created.event.ts # Domain event
│   └── index.ts                # Domain exports
├── application/
│   ├── use-cases/
│   │   ├── create-user.use-case.ts
│   │   └── update-user.use-case.ts
│   ├── ports/
│   │   ├── user.repository.ts  # Repository interface
│   │   └── event-bus.ts        # Event bus interface
│   ├── services/
│   │   └── user.service.ts     # Application service
│   └── index.ts                # Application exports
├── infrastructure/
│   ├── repositories/
│   │   └── user.repository.impl.ts # Repository implementation
│   ├── adapters/
│   │   └── event-bus.adapter.ts    # Event bus adapter
│   ├── di/
│   │   └── bindings.ts         # Dependency injection
│   └── index.ts                # Infrastructure exports
└── project.json                # Nx project configuration
```

## Development Workflow

### 1. Environment Setup

```bash
# Clone and install
git clone <repository-url>
cd nx-ddd-hex-plugin
npm install

# Set up environment variables
export NX_API_URL=http://localhost:8000  # For API integration
```

### 2. Generate Type-Safe Schema

```bash
# Generate types from database schema
nx run type-generator:generate

# Verify type parity between TypeScript and Python
nx run type-generator:verify
```

### 3. Create Domain

```bash
# Generate a new bounded context
nx g @ddd-plugin/ddd:hex-domain payment-processing

# Add ports and adapters
nx g @ddd-plugin/ddd:port payment-gateway --domain=payment-processing
nx g @ddd-plugin/ddd:uow payment-uow --domain=payment-processing
```

### 4. Create Applications

```bash
# Admin dashboard (Next.js)
nx g @ddd-plugin/ddd:web-app admin-dashboard --framework=next

# Customer portal (Remix)
nx g @ddd-plugin/ddd:web-app customer-portal --framework=remix

# Mobile app (Expo)
nx g @ddd-plugin/ddd:web-app mobile-app --framework=expo

# API backend (FastAPI)
nx g @ddd-plugin/ddd:api payment-api
```

## Running Applications

### Frontend Applications

```bash
# Next.js
nx serve admin-dashboard
# → http://localhost:4200

# Remix
nx serve customer-portal
# → http://localhost:4200

# Expo
nx start mobile-app
# → Opens Expo DevTools
```

### Backend Services

```bash
# FastAPI
nx serve payment-api
# → http://localhost:8000
# → API docs: http://localhost:8000/docs
```

### Health Checks

All generated applications include health check endpoints:

- **Next.js**: `GET /api/health`
- **Remix**: `GET /health`
- **Expo**: Built-in health status component
- **FastAPI**: `GET /health`

## Quality Assurance

### Testing

```bash
# Run all tests
nx run-many --target=test --all

# Test specific domain
nx test user-management

# E2E testing
nx e2e admin-dashboard-e2e
```

### Type Checking

```bash
# TypeScript strict mode
nx run-many --target=type-check --all

# Python mypy strict mode
npm run type-check:py
```

### Linting

```bash
# ESLint with architectural constraints
nx run-many --target=lint --all

# Dependency rule violations will fail the build
```

## Advanced Features

### Type Generation Pipeline

The plugin automatically generates type-safe schemas across languages:

1. **Database Schema** → PostgreSQL/Supabase definitions
2. **TypeScript Types** → Zod schemas, interface definitions
3. **Python Types** → Pydantic models, protocol definitions
4. **Validation** → Cross-language parity verification

### Architectural Constraints

ESLint rules enforce clean architecture:

```typescript
// ❌ Violates dependency rules
import { DatabaseUserRepository } from '@app/infrastructure';

// ✅ Follows dependency inversion
import { UserRepository } from '@app/application/ports';
```

### Dependency Injection

Built-in DI container setup:

```typescript
// Automatic binding generation
container.bind<UserRepository>('UserRepository')
  .to(DatabaseUserRepository);
```

## Project Structure

```
workspace/
├── apps/                       # Interface layer applications
│   ├── admin-dashboard/        # Next.js admin interface
│   ├── customer-portal/        # Remix customer interface
│   ├── mobile-app/            # Expo mobile application
│   └── payment-api/           # FastAPI backend service
├── libs/                      # Domain and shared libraries
│   ├── payment-processing/    # Payment domain
│   ├── user-management/       # User domain
│   └── shared/               # Cross-cutting concerns
│       ├── database-types/   # Generated DB types
│       ├── api-types/        # Generated API types
│       └── web/             # Shared web utilities
├── tools/                    # Build and development tools
│   └── type-generator/       # Schema-to-code generator
└── tests/                   # Integration and E2E tests
```

## Contributing

1. **Follow TDD**: Write tests first, implement features second
2. **Respect Architecture**: Maintain clean dependency directions
3. **Generate Types**: Use the type generator for schema changes
4. **Lint Clean**: Ensure all architectural constraints pass

## License

MIT - see [LICENSE](LICENSE) for details.
