# Production Deployment

## Current Status

The application is operational through the backend Supabase service-role integration:

- Frontend build passes.
- Backend build passes.
- Supabase schema and seed data are live.
- API routes store and retrieve data successfully.
- Inquiry, contact, and newsletter flows have been verified end to end.

The production database pool should use the verified Supabase IPv4 pooler URI, then verify direct `pg` and Drizzle runtime access.

## Supabase

Project ref:

```text
iekygvfianzgklwpgiqr
```

Get the official database URI from:

```text
Supabase Dashboard -> Project iekygvfianzgklwpgiqr -> Connect -> Session Pooler
```

Use the Dashboard-provided pooler URI as the source of truth. The verified IPv4 pooler runtime shape is:

```text
postgresql://postgres.iekygvfianzgklwpgiqr:<percent-encoded-db-password>@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require&uselibpqcompat=true
```

Important details:

- Keep the username as `postgres.iekygvfianzgklwpgiqr`.
- Use the verified IPv4 pooler host `aws-1-ap-northeast-2.pooler.supabase.com`.
- Use port `6543`, which verified successfully for direct `pg` and Drizzle access in this environment.
- Keep SSL enabled with `sslmode=require&uselibpqcompat=true`.
- Percent-encode special password characters. For example, `@` becomes `%40`.
- Do not use the service-role key as the database password.
- Do not guess future region or host values; copy them from the Dashboard if the project pooler changes.

## Backend Host

Recommended hosts:

- Render Web Service
- Railway Service
- Fly.io Machine/App
- VPS or long-running container

Backend root/package:

```text
artifacts/api-server
```

Build command:

```bash
pnpm --filter @workspace/api-server run build
```

Start command:

```bash
node artifacts/api-server/dist/index.mjs
```

Required server-only environment variables:

```text
SUPABASE_URL=https://iekygvfianzgklwpgiqr.supabase.co
SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
DATABASE_URL=<verified-supabase-ipv4-pooler-uri>
RESEND_API_KEY=<resend-api-key>
BUSINESS_EMAIL=<verified-sender-or-business-email>
PORT=<host-provided-port-or-3000>
CORS_ORIGIN=<deployed-frontend-origin>
NODE_ENV=production
LOG_LEVEL=info
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, or `RESEND_API_KEY` to frontend/Vercel client variables.

## Frontend Host

Recommended host:

- Vercel

Frontend root/package:

```text
artifacts/solora
```

Build command:

```bash
pnpm --filter @workspace/solora run build
```

Output directory:

```text
artifacts/solora/dist/public
```

Required frontend environment variables:

```text
BASE_PATH=/
VITE_API_BASE_URL=<deployed-backend-origin>
```

Local-only values such as `PORT` and `API_SERVER_URL` are useful for development, but production Vercel requests should use `VITE_API_BASE_URL` when the API is hosted separately.

## Final Verification Commands

After replacing `DATABASE_URL`, verify direct `pg` access:

```bash
pnpm --dir artifacts/api-server exec tsx --env-file=.env -e "import pg from 'pg'; const { Pool } = pg; (async()=>{ const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 }); try { const result = await pool.query('select current_user as user, current_database() as db'); console.log({ pgPool: 'ok', user: result.rows[0].user, db: result.rows[0].db }); } finally { await pool.end(); } })();"
```

Verify Drizzle access:

```bash
pnpm --dir artifacts/api-server exec tsx --env-file=.env -e "import { db, pool, servicesTable } from '@workspace/db'; (async()=>{ try { const rows = await db.select({ id: servicesTable.id, slug: servicesTable.slug }).from(servicesTable).limit(1); console.log({ drizzle: 'ok', rowCount: rows.length }); } finally { await pool.end(); } })();"
```

Verify builds:

```bash
pnpm run typecheck
pnpm run build
```

Verify deployed API behavior:

```text
GET  <backend-origin>/api/services
POST <backend-origin>/api/newsletter
POST <backend-origin>/api/contact-submissions
POST <backend-origin>/api/inquiries
```

## Non-Blocking Optimizations

- Add route-level observability for submission failures.
- Split the Solora frontend bundle if the chunk-size warning matters for first-load performance.
- Add a lightweight admin dashboard for leads and newsletter subscribers.
- Add email delivery logging if Resend delivery analytics are not enough.
