# Supabase Docker Stack - Authentication Solutions

This document outlines two approaches to resolve Docker authentication issues with Supabase's private container images and explains how the current `docker/docker-compose.supabase.yml` is structured to support both.

## Issue Summary

Several Supabase images (gotrue, storage-api, realtime, edge-runtime, studio) are hosted in private registries requiring authentication. Only `supabase/postgres` is publicly available without authentication.

## Solution 1: Use Public Alternatives (Recommended for Development)

By default the compose file starts a lightweight stack that relies only on public images:

- **Database**: `supabase/postgres:15.1.1.65`
- **REST API**: `postgrest/postgrest:latest`
- **Gateway**: `kong:3.4` using declarative config at `docker/kong.yml`
- **Email testing**: `inbucket/inbucket:latest`

Authentication, Realtime, Storage, Studio, and Edge Runtime services are defined with a `full` profile so they are skipped unless explicitly requested (see Solution 2). This keeps onboarding friction low while preserving the option to enable the full Supabase experience later.

### Default Stack Usage
```bash
# Start the stack
npx nx run supabase-devstack:start

# Check status
npx nx run supabase-devstack:status

# Stop the stack
npx nx run supabase-devstack:stop

# Reset (clear volumes)
npx nx run supabase-devstack:reset
```

### What You Get
- ✅ PostgreSQL database on port 54322 (`postgresql://postgres:postgres@localhost:54322/postgres`)
- ✅ PostgREST API exposed via Kong on port 54321 (`http://localhost:54321/rest/v1`)
- ✅ Inbucket mail sandbox on port 54324 (`http://localhost:54324`)
- ❌ Auth, Realtime, Storage, Studio, and Edge Runtime are inactive until you opt into the `full` profile and authenticate against GitHub Container Registry.

## Solution 2: Authenticate with GitHub Registry

### Prerequisites
1. GitHub account with access to Supabase repositories
2. GitHub Personal Access Token with `read:packages` permission

### Steps

1. **Create GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `read:packages` scope
   - Copy the token

2. **Login to GitHub Container Registry**
   ```bash
   echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
   ```

3. **Update Docker Compose** (modify `docker/docker-compose.supabase.yml`)
   ```yaml
   auth:
     image: ghcr.io/supabase/gotrue:latest
     # ... rest of config

   realtime:
     image: ghcr.io/supabase/realtime:latest
     # ... rest of config

   storage:
     image: ghcr.io/supabase/storage-api:latest
     # ... rest of config

   studio:
     image: ghcr.io/supabase/studio:latest
     # ... rest of config

   edge-runtime:
     image: ghcr.io/supabase/edge-runtime:latest
     # ... rest of config
   ```

4. **Start the full stack**
```bash
# Authenticate and then opt into the `full` profile
docker login ghcr.io
npx nx run supabase-devstack:start -- --profile full
```

### Full Service URLs (when authenticated)
- **Database**: `postgresql://postgres:postgres@localhost:54322/postgres`
- **API Gateway**: `http://localhost:54321`
- **Studio**: `http://localhost:54323`
- **Inbucket (Email)**: `http://localhost:54324`
- **Auth**: `http://localhost:54321/auth/v1`
- **REST**: `http://localhost:54321/rest/v1`
- **Storage**: `http://localhost:54321/storage/v1`
- **Realtime**: `ws://localhost:54321/realtime/v1`

## Troubleshooting

### Common Issues
1. **"Repository does not exist or may require docker login"**
   - Use Solution 2 to authenticate with GitHub registry

2. **PostgREST configuration errors**
   - Ensure `PGRST_ROLE_CLAIM_KEY: .role` format
   - Check database connection settings

3. **Kong configuration issues**
   - Verify kong.yml path is correctly mounted
   - Check service dependencies are healthy

### Development Recommendations
- Use Solution 1 for most development work
- Only enable full auth stack when testing authentication flows
- Consider using Supabase CLI for local development as an alternative

## Environment Variables

All environment variables are defined in `.env.supabase.local`. Key variables:

```bash
# Database
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Ports
SUPABASE_API_PORT=54321
SUPABASE_DB_PORT=54322
SUPABASE_STUDIO_PORT=54323
SUPABASE_INBUCKET_PORT=54324

# JWT (for local development only)
SUPABASE_JWT_SECRET=super-secret-jwt-token-with-32-chars-min
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Next Steps

1. For **immediate development**: Use the current public images setup
2. For **full feature testing**: Implement GitHub registry authentication
3. For **production-like local dev**: Consider migrating to official Supabase CLI
