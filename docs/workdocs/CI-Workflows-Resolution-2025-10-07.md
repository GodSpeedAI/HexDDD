# CI Workflows Resolution - October 7, 2025

## Executive Summary

**Problem**: All GitHub Actions CI workflows failing with "Could not find Nx modules" error
**Root Cause**: Incorrect usage of `nx` command in npm scripts vs CI environment
**Solution**: Use `npx nx` in npm scripts when running in CI environments
**Status**: In progress - implementing fixes across all PR branches

## Context

### Open Pull Requests
1. **PR #2**: Dependabot - tar-fs security update (2.1.3 → 2.1.4)
2. **PR #3**: Copilot - CI workflow fixes (nx PATH and type-sync permissions)
3. **PR #4**: Type-sync - Auto-generated Python type improvements

### CI Workflows
1. **smoke.yml** - Builds example apps (Next.js, Remix, Expo)
2. **python-tests.yml** - Runs cross-language validation tests
3. **type-sync.yml** - Generates types and creates PRs on schema changes

## Problem Analysis

### Dependency Chain
```
1. npm ci --legacy-peer-deps
   ↓ (installs 956 packages including nx@21.5.2)
2. npm run ci:smoke:web-next
   ↓ (executes package.json script)
3. nx run web-next:build
   ↓ (attempts to find nx binary)
4. FAILS: "Could not find Nx modules"
```

### Key Findings

#### 1. npm vs npx Behavior
- **`nx`** in npm scripts: Uses local `node_modules/.bin/nx` (requires proper PATH)
- **`npx nx`**: Automatically resolves local or global nx, installs if missing

#### 2. CI Environment Specifics
- GitHub Actions doesn't automatically add `node_modules/.bin` to PATH
- npm scripts run in a sub-shell that may not have access to locally installed binaries
- `npx` is the recommended way to run locally installed CLI tools in CI

#### 3. Official Nx Documentation Pattern
All Nx documentation examples use `npx nx` in CI:
```yaml
- run: npm ci --legacy-peer-deps
- run: npx nx affected -t lint test build
```

### Failed Approaches

#### Attempt 1: --legacy-peer-deps
✅ Fixed: npm peer dependency conflict (Cypress)
❌ Didn't fix: nx command not found issue

#### Attempt 2: Revert to `nx` from `npx nx`
❌ Based on incorrect assumption that npm scripts provide PATH
❌ Failed because CI environment doesn't have node_modules/.bin in PATH

#### Attempt 3: Merge main into PR branches
✅ Got latest workflow changes
❌ Still had incorrect package.json scripts

## Solution Design

### Correct package.json Scripts (for CI)
```json
{
  "scripts": {
    "ci:smoke:web-next": "npx nx run web-next:build --skip-nx-cache",
    "ci:smoke:web-remix": "npx nx run web-remix:build --skip-nx-cache",
    "ci:smoke:web-expo": "npx nx run web-expo:type-check --skip-nx-cache && npx nx run web-expo:lint --skip-nx-cache"
  }
}
```

### Why `npx nx` is Correct
1. **Path Resolution**: npx automatically finds locally installed packages
2. **Fallback**: If not installed, npx will install it temporarily
3. **Best Practice**: Matches all official Nx CI documentation
4. **Cross-Platform**: Works consistently across different CI environments

### Why Previous `nx` Approach Failed
1. npm scripts in CI don't inherit `node_modules/.bin` in PATH
2. Requires manual PATH manipulation or wrapper scripts
3. Not the pattern used by Nx team in their examples

## Implementation Plan

### Phase 1: Fix package.json Scripts
- [x] Identify incorrect scripts on copilot branch
- [ ] Update all ci:smoke:* scripts to use `npx nx`
- [ ] Commit and push to copilot branch
- [ ] Verify CI passes

### Phase 2: Update Other PR Branches
- [ ] Cherry-pick fix to dependabot branch
- [ ] Cherry-pick fix to type-sync branch
- [ ] Verify all PRs pass CI

### Phase 3: Merge PRs
- [ ] Merge PR #2 (Dependabot - security fix)
- [ ] Merge PR #3 (Copilot - CI fixes)
- [ ] Merge PR #4 (Type-sync - type improvements)
- [ ] Delete merged branches

### Phase 4: Documentation
- [ ] Update AGENTS.md with CI learnings
- [ ] Document npx nx pattern for future reference
- [ ] Add CI troubleshooting guide

## Technical Details

### Workflow Configuration (smoke.yml)
```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps

- name: Smoke - Next build
  run: npm run ci:smoke:web-next  # This calls npx nx
```

### Package Dependencies
```json
{
  "devDependencies": {
    "nx": "^21.5.2",
    "@nx/cypress": "21.4.1",
    // ... other nx plugins
  }
}
```

### CI Environment Details
- **Runner**: ubuntu-latest
- **Node**: v18.20.8
- **npm**: v10.8.2
- **Python**: 3.11.13

## Lessons Learned

### ✅ Correct Patterns
1. Always use `npx` for locally installed CLI tools in CI
2. Follow official documentation patterns from library maintainers
3. Test CI changes in actual CI environment, not just locally

### ❌ Incorrect Assumptions
1. npm scripts automatically add node_modules/.bin to PATH (they don't in CI)
2. `nx` will work the same as `npx nx` (it won't in CI)
3. Manual PATH fixes are better than using npx (they're not)

### 🔍 Debugging Approach
1. Read actual CI logs, not summaries
2. Check official documentation for CI patterns
3. Verify assumptions about CI environment behavior
4. Test incrementally with small changes

## References

- [Nx CI GitHub Actions Docs](https://nx.dev/ci/intro/ci-with-nx)
- [npm ci documentation](https://docs.npmjs.com/cli/v10/commands/npm-ci)
- [npx documentation](https://docs.npmjs.com/cli/v10/commands/npx)
- [GitHub Actions Node.js setup](https://github.com/actions/setup-node)

## Next Steps

1. ✅ Create this documentation
2. ⏳ Fix package.json scripts across all branches
3. ⏳ Verify CI passes on all PRs
4. ⏳ Merge approved PRs
5. ⏳ Clean up branches

## Status Updates

### 2025-10-07 14:30 UTC
- Created comprehensive analysis document
- Identified root cause: incorrect nx invocation pattern
- Ready to implement fix across all branches

### 2025-10-07 14:45 UTC - CRITICAL FINDING
**ACTUAL ROOT CAUSE IDENTIFIED**: `nx` package is NOT being installed by `npm ci`

Evidence:
- `npm ci` reports "added 956 packages" but nx@21.5.2 not among them
- `npm exec nx` tries to install nx@21.6.3 from registry (latest version)
- nx IS listed in package.json devDependencies at line 99
- This suggests `package-lock.json` corruption or mismatch

Next Steps:
1. Regenerate package-lock.json on a clean system
2. Verify nx is properly locked in package-lock.json
3. If that fails, delete and regenerate the example apps
4. Update this document with resolution
