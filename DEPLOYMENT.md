## Deployment checklist

Required environment variables (server):

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — service role key for server operations
- `DATABASE_URL` — Postgres connection string for server (if running migrations)
- `RESEND_API_KEY` — optional, for email
- `BUSINESS_EMAIL` — contact email
- `ADMIN_EMAILS` — comma-separated list of admin emails
- `PORT` — server port (default 3000)
- `CORS_ORIGIN` — allowed frontend origin

Frontend envs (Vite):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`

CI / Build tips

- The repository uses pnpm workspaces. CI should run `pnpm install --frozen-lockfile` then `pnpm -r --if-present run build`.
- The frontend build runs `node ./scripts/optimize-images.js` before the Vite build. Install `sharp` to enable image compression in CI if desired.

Database migrations

- Migrations are defined in `lib/db/src/migrations`. Use `drizzle-kit` locally or run migrations against Supabase MCP as performed in this repo.

Security

- Keep `SUPABASE_SERVICE_ROLE_KEY` and other secrets in your deployment secrets manager — never commit to source.
