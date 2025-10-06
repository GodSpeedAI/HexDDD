# 🏗️ HexDDD: Your Blueprint for Building Apps That Last

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-green.svg)](https://www.python.org/)
[![Nx](https://img.shields.io/badge/Nx-21.5+-purple.svg)](https://nx.dev/)

---

## 🎬 Picture This

It's 2 AM. Your mobile app just crashed because someone changed a database field. Your frontend is showing the wrong data. Your Python backend is throwing errors. And nobody knows which piece broke first.

Sound familiar?

Now imagine a different world: **You change your database schema, press save, and watch as your entire app—from mobile screens to backend APIs—updates itself automatically.** No hunting for broken code. No surprise bugs. Just smooth, predictable progress.

**That's HexDDD.**

> 🌟 Think of it as a **master blueprint for building homes**: where every room (feature) has clear walls (boundaries), every pipe and wire (data flow) connects exactly right, and you can renovate the kitchen without tearing down the bedroom.

---

## 🧩 The Problem (You've Lived It)

You're building a modern app. Maybe it's a customer portal, an admin dashboard, or a mobile experience. You hire great developers, choose the latest frameworks, and start coding.

Then reality hits:

- 🏚️ **The House of Cards**: Frontend says the user has a "firstName", backend expects "first_name", database stores "user_first_name". One typo, three different names, infinite bugs.

- 🍝 **Spaghetti Junction**: Your payment logic is tangled with your UI components. Changing one thing breaks three others. Testing becomes a nightmare.

- 🎲 **Team Chaos**: Sarah writes clean code. Tom shortcuts everything. Maria uses a different pattern. Six months later, nobody understands the codebase.

- ⏰ **Time Drain**: You spend 70% of your week fixing bugs and untangling messes instead of building features customers actually want.

**The hidden cost?** Talented developers burning out. Launches delayed. Opportunities missed. All because the *foundation* was shaky from day one.

---

## 💡 The Solution (In Plain English)

**HexDDD is like hiring an expert architect who ensures every part of your app fits together perfectly—automatically.**

Here's how it works, step by step:

### 🗺️ **Step 1: One Source of Truth**

Instead of typing the same thing in ten different files, you define your data structure **once** (in your database). HexDDD instantly generates perfectly matching code for:

- Your React/Next.js/Remix frontend
- Your Python backend
- Your mobile app
- All validation rules

*Like a blueprint: draw once, build everywhere.*

### 🏛️ **Step 2: Clear Rooms, Clear Walls**

Remember that master blueprint analogy? HexDDD organizes your code into distinct "rooms":

- **💎 The Vault (Domain)**: Your pure business logic. "A user can't have a negative balance." No clutter, no dependencies—just the rules that never change.

- **⚙️ The Control Center (Application)**: Your workflows. "When someone updates their profile, save it and send a notification." Coordinates everything but doesn't do the heavy lifting itself.

- **🔌 The Utility Room (Infrastructure)**: All the messy real-world stuff—databases, email services, payment processors. Swap them out without touching your business logic.

- **🎨 The Showroom (Interface)**: Your beautiful UI that customers see. Mobile apps, web dashboards, admin panels—all talking to the same solid foundation.

**The magic?** These rooms have "doors" (we call them ports and adapters) that only open in one direction. You *literally cannot* accidentally tangle your UI with your database code. The system won't let you.

### 🔄 **Step 3: Automatic Harmony**

Change your database? HexDDD updates your types everywhere. Add a new field? Your forms, validators, and API contracts update automatically. Refactor your backend? Your frontend *knows* immediately if something broke—while you're still coding, not when customers complain.

*It's like having a brilliant assistant who keeps all your documents in sync, catches every inconsistency, and never sleeps.*

### 🧪 **Step 4: Confidence Through Testing**

Because your code has clear walls, testing becomes obvious:

- Test your business rules (the Vault) with zero setup—no databases, no APIs, just pure logic
- Test your workflows (Control Center) with simple mock doors
- Test everything together only when you need to

**Result?** Tests that run in seconds, not minutes. Bugs caught before your first coffee, not after your customer's complaint.

---

## ✨ What This Feels Like (The Payoff)

Imagine starting your workday and:

**� Morning Coffee**: You update a user field in your database schema. Before you take your first sip, HexDDD has already updated 47 files across your frontend, backend, and mobile app. All tests pass. Nothing broke.

**☀️ Midday Flow**: A new developer joins your team. Instead of spending weeks deciphering "the way we do things," they run one command and generate a perfectly structured feature—matching exactly how the rest of the codebase works.

**🌙 Evening Calm**: You deploy a major refactor with confidence. Not because you tested every edge case manually, but because the architecture *prevents* the bugs from existing in the first place.

**The feeling?** Like driving a car with perfect alignment—effortless, smooth, and you arrive faster than you expected.

---

## 🛠️ Under the Hood (How It Actually Works)

While you experience the magic above, here's what HexDDD does behind the scenes:

### **The Foundation: One Truth, Everywhere**

- Your **database schema** becomes the single source of reality
- TypeScript types (with runtime validation) auto-generate for your React apps
- Python types (with API contracts) auto-generate for your FastAPI backend
- Mobile, web, admin panel—all speak the same language automatically

### **The Structure: Organized Like a Pro Kitchen**

Think of a Michelin-star restaurant kitchen—every station has a specific role:

- **💎 The Prep Station (Domain)**: Pure ingredients, no cooking yet. Your business rules in their simplest form.
- **⚙️ The Line Cooks (Application)**: Take orders, coordinate prep station and expeditors. Your use cases and workflows.
- **🔌 The Expeditors (Infrastructure)**: Connect to suppliers, manage inventory, handle equipment. Your databases, APIs, and external services.
- **🎨 The Dining Room (Interface)**: Beautiful presentation for guests. Your user-facing apps.

Each station has clear hand-off points (ports). You can change suppliers (databases) or update presentation (UI) without touching the recipes (business logic).

### **The Safety Net: Guardrails That Guide**

- **Automated boundaries**: The system *physically prevents* you from breaking architectural rules
- **Instant feedback**: Type errors show up while you're typing, not when customers click
- **Test at the speed of thought**: Most tests run without databases or APIs—just pure logic

---

## 📁 Your Project at a Glance

Here's how your app organizes itself—like a well-designed office building where every department knows its role:

```text
� Your HexDDD Project
│
├── � apps/                    → The Customer-Facing Floor
│   ├── 🔗 backend-api/         → Your API reception desk (FastAPI)
│   ├── ⚛️ web-next/            → Modern web experience (Next.js)
│   ├── 🎵 web-remix/           → Progressive web app (Remix)
│   └── 📱 web-expo/            → Mobile experience (React Native)
│
├── �️ libs/                    → The Departments & Shared Resources
│   ├── 🔧 ddd/                 → Your toolkit (the HexDDD plugin itself)
│   ├── 🌐 shared/              → Company-wide resources
│   │   ├── 📊 database-types/  → Universal data definitions (TypeScript)
│   │   ├── 🔌 api-types/       → Contract agreements (API specs)
│   │   ├── � web/             → Shared web utilities
│   │   └── 🐍 type_system/     → Python data definitions
│   │
│   └── 🏗️ <your-domain>/       → Feature Departments (e.g., "user-management")
│       ├── 💎 domain/          → The Strategy Room (business rules)
│       ├── ⚙️ application/     → The Operations Center (workflows)
│       └── 🔌 infrastructure/  → The Utilities (databases, APIs, integrations)
│
├── 🛠️ tools/                   → The Maintenance Crew
│   ├── 🔄 type-generator/      → Keeps everyone speaking the same language
│   └── 🗄️ supabase/            → Local development playground
│
└── 🧪 tests/                   → Quality Assurance Department
    ├── 🌊 e2e/                 → Full customer journey tests
    ├── 🔗 cross/               → Translation verification tests
    └── � fixtures/            → Test scenarios & examples
```

**The beauty of this layout?**

- **New team members** instantly know where to find things
- **Features** live in isolated departments—change one without affecting others
- **Shared resources** eliminate duplication—write once, use everywhere
- **Tests** mirror your structure—obvious what to test and where

It's like a city with clear districts and well-marked streets. No one gets lost.

---

## 🚀 Getting Started in 5 Minutes

Let's get you building. No PhD required.

### 📥 **Step 1: Grab the Code**

```bash
# Get HexDDD on your machine
git clone https://github.com/SPRIME01/HexDDD.git
cd HexDDD

# Install everything
npm install
```

### � **Step 2: See It in Action**

Pick your favorite flavor and watch it run:

#### 🔗 Backend API (FastAPI)

```bash
nx serve backend-api
# 🌐 Visit: http://localhost:8000
# 📚 Interactive API Docs: http://localhost:8000/docs
```

#### ⚛️ Next.js Web App

```bash
nx run web-next:dev
# 🌐 Visit: http://localhost:4200
```

#### 🎵 Remix Web App

```bash
nx run web-remix:dev
# 🌐 Visit: http://localhost:4201
```

#### 📱 Expo Mobile App

```bash
nx run web-expo:start
# 📱 Scan the QR code with Expo Go on your phone
```

> 💡 **Notice something cool?** All these apps share the exact same types and validation. Change one thing, and everything stays in sync.

### 🗄️ **Step 3: Optional Database Power**

Want to see the full type generation magic? Spin up a local database:

```bash
# Set up your local environment
cp example.env .env.supabase.local

# Start your local Supabase stack
nx run supabase-devstack:start
# 🌐 Supabase Studio: http://localhost:54323

# When you're done experimenting
nx run supabase-devstack:stop
```

**What just happened?** You now have a complete PostgreSQL database, authentication, and API running locally. Change the schema, and watch HexDDD update your entire codebase automatically.

---

## 🎨 Building Your First Feature

Ready to create something? Let's build a complete feature in seconds, not hours.

### 🏗️ **Create a New Business Domain**

Think of a domain as a complete "department" in your app—like User Management, Order Processing, or Notifications.

```bash
# Generate everything you need for user management
nx g @ddd-plugin/ddd:hex-domain user-management
```

**What you just created:**

- ✨ `libs/user-management/domain/` → Your business rules (pure logic, no tech)
- ✨ `libs/user-management/application/` → Your workflows and contracts
- ✨ `libs/user-management/infrastructure/` → Database connections and APIs
- ✨ Proper boundaries that prevent architectural mistakes

### 🌐 **Add a Beautiful Frontend**

Now let's give users a way to interact with it:

```bash
# Create a Next.js admin portal with all the connections
nx g @ddd-plugin/ddd:web-app admin-portal --framework=next

# Or a Remix customer portal that shares the same backend
nx g @ddd-plugin/ddd:web-app customer-portal --framework=remix

# Or a mobile app for on-the-go access
nx g @ddd-plugin/ddd:web-app mobile-app --framework=expo
```

**Your options:**

- `--framework=next` → Modern Next.js with App Router
- `--framework=remix` → Progressive web app with Remix
- `--framework=expo` → React Native mobile app
- `--apiClient=true` → Include shared, type-safe API client (default)
- `--includeExamplePage=true` → Get example routes to learn from (default)

**The magic moment:** Every frontend automatically understands your backend. The types flow through. The validation just works. You focus on the user experience, not plumbing.

### 🔧 **Extend Your Domain**

As your app grows, add exactly what you need:

```bash
# Add an event notification system
nx g @ddd-plugin/ddd:port notification-service

# Add database transaction handling
nx g @ddd-plugin/ddd:uow user-management

# Add an event bus for decoupled features
nx g @ddd-plugin/ddd:event-bus user-management
```

> ✨ **Pro move:** All generators are idempotent—run them multiple times safely. They'll only add what's missing, never break what exists.

---

## 🔄 Keep Everything in Perfect Sync

Here's where HexDDD becomes your silent partner—keeping your entire stack harmonized without you lifting a finger.

### 🔧 **Manual Type Generation (When You Want Control)**

```bash
# Generate TypeScript + Python types from your database schema
nx run type-generator:generate

# Verify everything matches perfectly across languages
nx run type-generator:verify
```

### 🤖 **Automatic Synchronization (While You Sleep)**

Our CI/CD watches your back:

- ✅ **Schema change?** → Types regenerate automatically
- ✅ **Type mismatch?** → Build fails before merge (catches bugs early)
- ✅ **Updates needed?** → Pull request created with all changes
- ✅ **Weekly check?** → Scheduled validation ensures nothing drifts

**Triggers:**

- You modify schema files in `supabase/`
- You manually trigger from GitHub Actions
- Weekly scheduled verification (every Sunday at 2 AM)

**Result:** Your TypeScript, Python, and database speak the same language, always. No silent drift. No surprise runtime errors.

---

## 🎯 The Technical Foundation (For the Curious)

Want to peek behind the curtain? Here's what makes HexDDD tick—explained like you're explaining it to a bright 12-year-old.

### 🏛️ **The "Clean Architecture" Secret**

Imagine building with LEGO blocks. Each block (layer) only connects in specific ways:

#### 💎 Domain Layer (The Pure Gold)

```typescript
// ✅ Pure business logic—no tech dependencies, no framework imports
export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly profile: UserProfile
  ) {}

  updateProfile(newProfile: UserProfile): UserProfileUpdated {
    // Just the business rules—nothing else
    return new UserProfileUpdated(this.id, newProfile);
  }
}
```

*Why this matters:* Your core business rules never change when you swap databases or frameworks. They're timeless.

#### ⚙️ Application Layer (The Orchestra Conductor)

```typescript
// ✅ Coordinates domain logic with external services
export class UpdateUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,  // A contract, not the real thing
    private readonly eventBus: EventBus               // Another contract
  ) {}

  async execute(request: UpdateProfileRequest): Promise<void> {
    const user = await this.userRepository.findById(request.userId);
    const event = user.updateProfile(request.profile);
    await this.userRepository.save(user);
    await this.eventBus.publish(event);
  }
}
```

*Why this matters:* This layer doesn't care *how* users are saved or *where* events go. It just knows *what* should happen.

#### 🔌 Infrastructure Layer (The Real World Adapter)

```python
# ✅ Actual implementation with real databases and APIs
class SupabaseUserRepository(UserRepository):
    async def find_by_id(self, user_id: UserId) -> User:
        # Real database queries here
        pass

    async def save(self, user: User) -> None:
        # Real persistence here
        pass
```

*Why this matters:* Swap Supabase for MongoDB tomorrow? Just change this file. The rest of your app doesn't even notice.

### 🔗 **Type Safety Across the Universe**

Here's how one schema change ripples perfectly through everything:

```text
1. 📊 You update: Supabase Schema (database)
        ↓
2. 🔄 HexDDD generates: TypeScript types (with runtime validation)
        ↓
3. 🐍 HexDDD generates: Python types (with API contracts)
        ↓
4. ⚛️ React apps get: Auto-updated interfaces and forms
        ↓
5. 🔗 FastAPI gets: Auto-updated request/response models
        ↓
6. ✅ Tests verify: Everything still works together
```

**Benefits you feel:**

- 🛡️ **Errors caught while coding**, not when customers complain
- 🔄 **Schema changes propagate everywhere**, automatically
- 🧪 **Mock implementations match real ones**, always
- 📈 **New features don't break old code**, by design

---

## 🧪 Testing with Confidence (Not Dread)

Traditional testing feels like untangling Christmas lights. HexDDD makes it feel like clicking LEGO blocks together.

### 🎯 **Run Your Tests**

```bash
# Test everything at once
nx run-many --target=test --all

# Check for architectural violations (boundaries, imports)
nx run-many --target=lint --all

# Verify Python types are bulletproof
npm run type-check:py

# Full end-to-end customer journey
nx run ddd-e2e:e2e
```

### 📚 **Testing by Layer (Smart, Not Hard)**

#### 💎 Domain Tests (The Easy Wins)

- ✅ Pure unit tests—no databases, no APIs, no setup
- ✅ Test business rules in isolation
- ✅ Run in milliseconds, not minutes

#### ⚙️ Application Tests (The Coordination Check)

- ✅ Use case testing with simple mock "doors" (ports)
- ✅ In-memory implementations—fast and reliable
- ✅ Verify workflows without real infrastructure

#### 🔌 Infrastructure Tests (The Integration Layer)

- ✅ Real adapter tests with actual databases
- ✅ Contract verification—does your adapter match its contract?
- ✅ Database migration validation

#### 🌊 End-to-End Tests (The Customer Journey)

- ✅ Full stack validation from button click to database
- ✅ API contract verification across languages
- ✅ Type safety confirmation between frontend and backend

### 🛡️ **Automatic Quality Gates**

**Boundary Enforcement (Your Architectural Guardian):**

```json
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          {
            "sourceTag": "type:domain",
            "onlyDependOnLibsWithTags": ["type:domain"]
          },
          {
            "sourceTag": "type:application",
            "onlyDependOnLibsWithTags": ["type:domain", "type:application"]
          }
        ]
      }
    ]
  }
}
```

*Translation:* Your domain code **cannot** accidentally import database stuff. The linter won't let it compile. Mistakes become impossible.

**CI/CD Verification:**

- 🤖 Every pull request validates architectural boundaries
- 🔍 Type drift detection catches schema mismatches
- 📊 Test coverage reporting shows what's protected
- 🚨 Breaking change detection prevents surprise bugs

---

## 🛠️ The Tech Stack (What Powers This Magic)

### Frontend Excellence ⚛️

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14+ (App Router) | 🌐 Full-stack React framework |
| **Remix** | 2.15+ | 🎵 Progressive web apps |
| **Expo** | 54+ | 📱 React Native mobile development |
| **TypeScript** | 5.0+ (Strict) | 🔒 Type-safe development |
| **Zod** | 3.23+ | ✅ Runtime type validation |
| **React** | 19.0 | ⚛️ Component library |

### Backend Power 🐍

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | Latest | 🚀 High-performance async API |
| **Python** | 3.11+ | 🐍 Backend development |
| **Pydantic** | 2.x | 📝 Data validation & serialization |
| **SQLAlchemy** | 2.x | 🗄️ Async ORM |
| **mypy** | Latest | 🔍 Static type checking |
| **pytest** | Latest | 🧪 Testing framework |

### Infrastructure & DevOps 🏗️

| Technology | Version | Purpose |
|------------|---------|---------|
| **Nx** | 21.5+ | 🔧 Monorepo tooling |
| **Supabase** | Latest | 🗄️ PostgreSQL + Auth + API |
| **Docker** | Latest | 📦 Containerization |
| **GitHub Actions** | - | 🤖 CI/CD pipelines |
| **ESLint** | Latest | 🔍 Code quality enforcement |

---

## 🤝 Join the Movement

HexDDD is better because of contributors like you. Here's how to get involved:

### 🔄 **Your Development Journey**

#### 1. 🌿 Start Your Branch

```bash
# Update your local dev branch
git checkout dev
git pull origin dev

# Create your feature branch from dev
git checkout -b feat/your-awesome-feature
```

#### 2. 🧪 Quality First

```bash
# Test your changes locally
nx run-many --target=test --all

# Ensure code quality
nx run-many --target=lint --all

# Verify Python types
npm run type-check:py
```

#### 3. 📝 Document Your Work

- **README.md** → User-facing changes or new features
- **AGENTS.md** → Architectural patterns or AI guidance updates
- **ADRs** (in `docs/`) → Significant architectural decisions
- **Generator schemas** → New generator options or behaviors

#### 4. 🔄 Generator Development Tips

Test that your generator is idempotent (safe to run twice):

```bash
# First run - creates everything
nx g @ddd-plugin/ddd:web-app test-app --framework=next

# Second run - should show "no changes"
nx g @ddd-plugin/ddd:web-app test-app --framework=next
```

#### 5. 📨 Submit Your Pull Request

- Target the `dev` branch (not `main`)
- Provide clear context: *what* changed and *why*
- Include test evidence (screenshots, logs, test results)
- Document any breaking changes prominently

### 🎯 **Where We Need Help**

- 🎨 **New Frameworks** (Vite, SvelteKit, Astro)
- 🔌 **Additional Adapters** (Redis, Kafka, GraphQL, gRPC)
- 📱 **Mobile Patterns** (React Navigation, offline-first, native modules)
- 🧪 **Testing Utilities** (Test builders, factories, fixtures)
- 📚 **Documentation** (Tutorials, video guides, blog posts)
- 🏗️ **Generator Enhancements** (More options, better error messages, clearer output)

**Your expertise matters—whether you're a designer, developer, or documentation wizard.**

---

## 📚 Dive Deeper

### 📖 **Essential Reading**

- 📋 [**AGENTS.md**](AGENTS.md) → AI collaboration guidelines and architectural context
- 🏗️ [**ADR Documents**](docs/) → Architectural decision records with rationale
- 📝 [**Product Requirements**](docs/PRD-hex-react-python.md) → Feature specifications and roadmap
- 🔧 [**Technical Specifications**](docs/TECHSPEC-hex-react-python.md) → Implementation deep dives

### 🎓 **Learn the Principles**

- 📚 [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) → Alistair Cockburn's original vision
- 🏗️ [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) → Martin Fowler's distilled wisdom
- 🔧 [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) → Robert Martin's timeless patterns
- ⚛️ [React Patterns](https://reactpatterns.com/) → Frontend architecture best practices

### 🛠️ **Master the Tools**

- 🔧 [Nx Monorepo Guide](https://nx.dev/getting-started/intro) → Workspace orchestration
- ⚛️ [Next.js Documentation](https://nextjs.org/docs) → React framework mastery
- 🎵 [Remix Framework](https://remix.run/docs) → Progressive web apps
- 🐍 [FastAPI Guide](https://fastapi.tiangolo.com/) → Modern Python APIs

---

## 📄 License

**Mozilla Public License 2.0** - see [LICENSE](LICENSE) for complete details.

This license balances openness with protection—use it freely, improve it collaboratively, share it widely.

---

## 🙏 Standing on the Shoulders of Giants

This project wouldn't exist without:

- **[Nx](https://nx.dev/)** → The monorepo platform that makes this possible
- **[nx-ddd-plugin](https://github.com/angular-architects/nx-ddd-plugin)** → Original inspiration for DDD patterns in Nx
- **[@nxlv/python](https://www.npmjs.com/package/@nxlv/python)** → Python workspace integration that bridges ecosystems

---

## 🚀 Ready to Build Something Extraordinary?

**The best apps aren't just coded—they're architected.**

HexDDD gives you the blueprint, the tools, and the guardrails to build apps that:

✨ Scale effortlessly as your team grows
🛡️ Stay maintainable as requirements evolve
🚀 Ship faster because the architecture works *with* you, not against you

---

[⭐ **Star this repo**](https://github.com/SPRIME01/HexDDD) • [🐛 **Report issues**](https://github.com/SPRIME01/HexDDD/issues) • [💬 **Join discussions**](https://github.com/SPRIME01/HexDDD/discussions)

---

**Built with ❤️ by developers who've felt the pain of bad architecture—**
**and decided to do something about it.**
