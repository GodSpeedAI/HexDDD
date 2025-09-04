# Unified Type Framework Specification

## 1. Overview

### 1.1 Purpose
This specification defines a comprehensive type framework for maintaining type consistency across a polyglot Nx monorepo with TypeScript (frontend) and Python (FastAPI backend) applications sharing a Supabase database.

### 1.2 Goals
- **Single Source of Truth**: Database schema drives all type definitions
- **Automatic Synchronization**: Types update automatically when schema changes
- **Type Safety**: Compile-time type checking in both languages
- **Developer Experience**: Seamless IDE support and autocompletion
- **Runtime Validation**: Consistent validation across frontend and backend

## 2. Architecture

### 2.1 Type Flow Diagram
```
┌─────────────────┐
│ Supabase DB     │ ← Source of Truth
│ (PostgreSQL)    │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Schema  │
    │ Reader  │
    └────┬────┘
         │
┌────────▼────────┐
│ Type Generator  │
│   Hub (Nx)      │
└───┬─────────┬───┘
    │         │
┌───▼───┐ ┌───▼───┐
│  TS   │ │Python │
│ Types │ │Models │
└───────┘ └───────┘
```

### 2.2 Directory Structure
```
workspace/
├── libs/
│   ├── shared/
│   │   ├── type-system/
│   │   │   ├── schemas/           # JSON Schema definitions
│   │   │   ├── generators/        # Type generation scripts
│   │   │   └── validators/        # Runtime validators
│   │   ├── database-types/        # Generated DB types
│   │   ├── api-types/            # Generated API types
│   │   └── domain-types/         # Business logic types
│   ├── frontend/
│   │   └── type-utils/           # TS-specific utilities
│   └── backend/
│       └── type_utils/           # Python-specific utilities
├── tools/
│   └── type-generator/           # Nx plugin for type generation
└── supabase/
    ├── migrations/               # Database migrations
    └── types/                    # Supabase type exports
```

## 3. Type Sources and Hierarchy

### 3.1 Primary Sources
```typescript
// Type Source Priority (highest to lowest):
1. Database Schema (PostgreSQL/Supabase)
2. API Contracts (OpenAPI/FastAPI)
3. Domain Models (Business Logic)
4. UI Models (Frontend-specific)
```

### 3.2 Type Categories

#### Database Types
```typescript
// libs/shared/database-types/src/lib/tables.types.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          updated_at?: string | null;
        };
      };
    };
    Views: { /* ... */ };
    Functions: { /* ... */ };
  };
}
```

#### API Contract Types
```typescript
// libs/shared/api-types/src/lib/endpoints.types.ts
export interface UserResponse {
  id: string;
  email: string;
  profile?: ProfileResponse;
  createdAt: string;  // ISO 8601
  updatedAt: string | null;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  profile?: CreateProfileRequest;
}
```

#### Domain Types
```typescript
// libs/shared/domain-types/src/lib/user.types.ts
export interface User {
  id: UserId;
  email: Email;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date | null;
}

// Branded types for domain modeling
export type UserId = string & { __brand: 'UserId' };
export type Email = string & { __brand: 'Email' };
```

## 4. Generation Pipeline

### 4.1 Nx Generator Configuration
```typescript
// tools/type-generator/src/generators/types/schema.json
{
  "$schema": "http://json-schema.org/schema",
  "cli": "nx",
  "id": "types",
  "title": "Generate Types",
  "type": "object",
  "properties": {
    "source": {
      "type": "string",
      "enum": ["database", "api", "schema"],
      "description": "Source of type generation"
    },
    "target": {
      "type": "string",
      "enum": ["typescript", "python", "both"],
      "default": "both"
    },
    "output": {
      "type": "string",
      "description": "Output directory"
    }
  }
}
```

### 4.2 Generation Workflow
```typescript
// tools/type-generator/src/generators/types/generator.ts
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { TypesGeneratorSchema } from './schema';

export async function typesGenerator(
  tree: Tree,
  options: TypesGeneratorSchema
) {
  switch (options.source) {
    case 'database':
      await generateFromDatabase(tree, options);
      break;
    case 'api':
      await generateFromOpenAPI(tree, options);
      break;
    case 'schema':
      await generateFromJSONSchema(tree, options);
      break;
  }

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}

async function generateFromDatabase(tree: Tree, options: TypesGeneratorSchema) {
  // 1. Fetch Supabase schema
  const schema = await fetchSupabaseSchema();

  // 2. Generate TypeScript types
  if (options.target === 'typescript' || options.target === 'both') {
    const tsTypes = generateTypeScriptTypes(schema);
    tree.write(`${options.output}/database.types.ts`, tsTypes);
  }

  // 3. Generate Python models
  if (options.target === 'python' || options.target === 'both') {
    const pyModels = generatePythonModels(schema);
    tree.write(`${options.output}/database_models.py`, pyModels);
  }
}
```

## 5. Type Transformations

### 5.1 Database to TypeScript
```typescript
// libs/shared/type-system/generators/db-to-ts.ts
interface ColumnMapping {
  postgresql: string;
  typescript: string;
  transform?: (value: any) => any;
}

const TYPE_MAPPINGS: ColumnMapping[] = [
  { postgresql: 'uuid', typescript: 'string' },
  { postgresql: 'text', typescript: 'string' },
  { postgresql: 'integer', typescript: 'number' },
  { postgresql: 'bigint', typescript: 'string' }, // JS number precision
  { postgresql: 'timestamp', typescript: 'string', transform: (v) => v.toISOString() },
  { postgresql: 'jsonb', typescript: 'unknown' },
  { postgresql: 'boolean', typescript: 'boolean' },
];
```

### 5.2 Database to Python
```python
# libs/shared/type_system/generators/db_to_python.py
from typing import Dict, Type, Callable

TYPE_MAPPINGS: Dict[str, Type] = {
    'uuid': 'UUID',
    'text': 'str',
    'integer': 'int',
    'bigint': 'int',
    'timestamp': 'datetime',
    'timestamptz': 'datetime',
    'jsonb': 'Dict[str, Any]',
    'boolean': 'bool',
}

def generate_sqlmodel_field(column_info: dict) -> str:
    """Generate SQLModel field definition from column info"""
    field_type = TYPE_MAPPINGS.get(column_info['type'], 'Any')
    nullable = 'Optional[{}]'.format(field_type) if column_info['nullable'] else field_type

    constraints = []
    if column_info.get('primary_key'):
        constraints.append('primary_key=True')
    if column_info.get('default'):
        constraints.append(f"default={column_info['default']}")

    return f"{column_info['name']}: {nullable} = Field({', '.join(constraints)})"
```

## 6. Validation Framework

### 6.1 TypeScript Validation
```typescript
// libs/shared/type-system/validators/ts/user.validator.ts
import { z } from 'zod';

// Base validators matching database constraints
export const UserIdSchema = z.string().uuid().brand<'UserId'>();
export const EmailSchema = z.string().email().brand<'Email'>();

// Composite validators
export const CreateUserSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8).max(72),
  profile: CreateProfileSchema.optional(),
});

export const UserResponseSchema = z.object({
  id: UserIdSchema,
  email: EmailSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
});

// Type extraction
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;

// Validation function
export function validateCreateUser(data: unknown): CreateUser {
  return CreateUserSchema.parse(data);
}
```

### 6.2 Python Validation
```python
# libs/shared/type_system/validators/python/user_validator.py
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from uuid import UUID

class UserId(str):
    """Branded UserId type"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise TypeError('string required')
        try:
            UUID(v, version=4)
        except ValueError:
            raise ValueError('invalid uuid format')
        return cls(v)

class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    profile: Optional['CreateProfileRequest'] = None

    @validator('password')
    def validate_password_strength(cls, v):
        # Add password strength validation
        return v

class UserResponse(BaseModel):
    id: UserId
    email: EmailStr
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }
```

## 7. Synchronization Mechanisms

### 7.1 CI/CD Pipeline
```yaml
# .github/workflows/type-sync.yml
name: Type Synchronization

on:
  push:
    paths:
      - 'supabase/migrations/**'
      - 'apps/backend/app/models/**'
      - 'libs/shared/type-system/**'

jobs:
  sync-types:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          npm ci
          pip install -r apps/backend/requirements.txt

      - name: Generate types
        run: |
          nx run type-system:generate-all

      - name: Verify type consistency
        run: |
          nx run type-system:verify

      - name: Create PR if types changed
        uses: peter-evans/create-pull-request@v4
        with:
          commit-message: 'chore: sync generated types'
          title: 'Type Synchronization'
          body: 'Automated type synchronization from schema changes'
```

### 7.2 Local Development Hooks
```json
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if schema files changed
if git diff --cached --name-only | grep -E "(migrations|\.sql|models\.py)" > /dev/null; then
  echo "Schema changes detected, regenerating types..."
  nx run type-system:generate-all
  git add libs/shared/database-types
  git add libs/shared/api-types
fi
```

## 8. Runtime Type Safety

### 8.1 Frontend Guards
```typescript
// libs/frontend/type-utils/src/lib/guards.ts
import { Database } from '@myorg/shared/database-types';

export class TypeGuard {
  static isValidUser(data: unknown): data is Database['public']['Tables']['users']['Row'] {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'email' in data &&
      typeof (data as any).id === 'string' &&
      typeof (data as any).email === 'string'
    );
  }

  static assertUser(data: unknown): asserts data is Database['public']['Tables']['users']['Row'] {
    if (!this.isValidUser(data)) {
      throw new TypeError('Invalid user data');
    }
  }
}

// Usage in React components
export function useTypedQuery<T>(
  query: string,
  guard: (data: unknown) => data is T
) {
  const { data, error } = useQuery(query);

  if (data && !guard(data)) {
    throw new Error('Type guard failed');
  }

  return { data: data as T, error };
}
```

### 8.2 Backend Type Enforcement
```python
# libs/backend/type_utils/enforcement.py
from typing import TypeVar, Type, Callable
from functools import wraps
from pydantic import ValidationError
from fastapi import HTTPException

T = TypeVar('T', bound=BaseModel)

def validate_response(model: Type[T]) -> Callable:
    """Decorator to validate response matches expected type"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            try:
                # Validate response matches model
                validated = model.parse_obj(result)
                return validated
            except ValidationError as e:
                # Log validation error in development
                logger.error(f"Response validation failed: {e}")
                raise HTTPException(500, "Internal type error")
        return wrapper
    return decorator

# Usage
@router.get("/users/{user_id}")
@validate_response(UserResponse)
async def get_user(user_id: str) -> dict:
    # Return dict that should match UserResponse
    return await UserService.get_user(user_id)
```

## 9. Testing Strategy

### 9.1 Type Generation Tests
```typescript
// libs/shared/type-system/src/generators/__tests__/generator.spec.ts
describe('Type Generator', () => {
  it('should generate matching types for both languages', async () => {
    const schema = await loadTestSchema();

    const tsTypes = generateTypeScriptTypes(schema);
    const pyTypes = generatePythonTypes(schema);

    // Verify structural compatibility
    const tsAST = parseTypeScript(tsTypes);
    const pyAST = parsePython(pyTypes);

    expect(compareStructures(tsAST, pyAST)).toBe(true);
  });

  it('should handle nullable fields consistently', async () => {
    const nullableField = {
      name: 'optional_field',
      type: 'text',
      nullable: true,
    };

    const tsType = generateTypeScriptField(nullableField);
    const pyType = generatePythonField(nullableField);

    expect(tsType).toContain('| null');
    expect(pyType).toContain('Optional[str]');
  });
});
```

### 9.2 Validation Tests
```python
# libs/shared/type_system/validators/__tests__/test_validation_parity.py
import json
from typing import Dict, Any

def test_validation_parity():
    """Ensure TS and Python validators have same behavior"""
    test_cases = [
        {
            "input": {"email": "invalid-email"},
            "should_fail": True,
            "error_field": "email"
        },
        {
            "input": {"email": "user@example.com", "password": "short"},
            "should_fail": True,
            "error_field": "password"
        }
    ]

    for case in test_cases:
        # Test Python validation
        py_result = validate_python(case["input"])

        # Test TypeScript validation (via subprocess or API)
        ts_result = validate_typescript(case["input"])

        assert py_result.is_valid == ts_result.is_valid
        if case["should_fail"]:
            assert case["error_field"] in py_result.errors
            assert case["error_field"] in ts_result.errors
```

## 10. Developer Guidelines

### 10.1 Type Definition Rules
1. **Never manually edit generated files**
2. **Database schema is the source of truth**
3. **Use branded types for domain modeling**
4. **Validate at boundaries (API, UI)**
5. **Prefer strict types over loose ones**

### 10.2 Naming Conventions
```typescript
// TypeScript
interface UserRow {}         // Database row type
interface UserResponse {}    // API response type
interface User {}           // Domain model type
type UserId = string & { __brand: 'UserId' };  // Branded type

// Python
class UserRow(SQLModel): pass      # Database model
class UserResponse(BaseModel): pass # API response
class User(BaseModel): pass        # Domain model
UserId = NewType('UserId', str)   # Branded type
```

### 10.3 Migration Workflow
```bash
# 1. Create database migration
supabase migration new add_user_field

# 2. Edit migration file
echo "ALTER TABLE users ADD COLUMN phone text;" > supabase/migrations/[timestamp]_add_user_field.sql

# 3. Apply migration
supabase db push

# 4. Regenerate types
nx run type-system:generate-all

# 5. Update dependent code
nx affected --target=lint --fix

# 6. Run type checks
nx affected --target=type-check

# 7. Commit everything together
git add -A
git commit -m "feat: add phone field to users"
```

## 11. Monitoring and Maintenance

### 11.1 Type Drift Detection
```typescript
// tools/type-monitor/src/drift-detector.ts
export async function detectTypeDrift() {
  const dbSchema = await fetchDatabaseSchema();
  const apiSchema = await fetchAPISchema();
  const generatedTypes = await loadGeneratedTypes();

  const drift = {
    missingInAPI: findMissingFields(dbSchema, apiSchema),
    extraInAPI: findExtraFields(apiSchema, dbSchema),
    typeMismatches: findTypeMismatches(dbSchema, generatedTypes),
  };

  if (hasDrift(drift)) {
    await notifyTeam(drift);
    throw new Error('Type drift detected');
  }
}
```

### 11.2 Performance Metrics
```json
{
  "metrics": {
    "generationTime": {
      "target": "< 30s",
      "measure": "nx run type-system:generate-all"
    },
    "validationTime": {
      "target": "< 1ms per object",
      "measure": "average validation time"
    },
    "bundleSize": {
      "target": "< 50kb for type definitions",
      "measure": "size of generated type files"
    }
  }
}
```

This specification provides a complete framework for maintaining type consistency across your polyglot Nx monorepo. The key is automation and treating your database schema as the single source of truth, with all other types derived from it.
