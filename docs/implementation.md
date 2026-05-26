# Solora Implementation Guide

## Overview
Solora uses a backend-first lead pipeline:
- The frontend opens a global inquiry dialog for leads, contact requests, and newsletter signups.
- The API server validates every submission, writes to Supabase, and sends notifications through Resend.
- The frontend never writes directly to Supabase.

## Environment Variables

### Frontend
Required for the Solora Vite app:
- See [artifacts/solora/.env.example](../artifacts/solora/.env.example) for the frontend template.
- `PORT` - local dev/preview port for Vite.
- `BASE_PATH` - Vite base path, usually `/`.
- `API_SERVER_URL` - local dev proxy target used by Vite when `/api` is proxied to the backend.
- `VITE_API_BASE_URL` - optional absolute API origin for direct production calls, for example `https://api.example.com`.

Frontend does not need Supabase service credentials.

### API Server
Required for the Express API server:
- See [artifacts/api-server/.env.example](../artifacts/api-server/.env.example) for the server template.
- `SUPABASE_URL` - Supabase project URL used by the server only.
- `SUPABASE_ANON_KEY` - Supabase anon key, validated for completeness even though the server uses the service role key for writes.
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service-role key, server-side only.
- `DATABASE_URL` - verified Supabase IPv4 pooler URI for direct `pg`/Drizzle runtime access.
- `RESEND_API_KEY` - Resend API key for outbound email.
- `BUSINESS_EMAIL` - inbox that receives Solora notifications.
- `PORT` - API server listen port.
- `CORS_ORIGIN` - allowed frontend origin for browser requests.
- `NODE_ENV` - `development` or `production`.
- `LOG_LEVEL` - optional pino log level.

### Database Tooling
Required when applying Drizzle schema changes:
- `DATABASE_URL` - Postgres connection string for Supabase or a local Postgres instance. For production Supabase, use the verified IPv4 pooler URI from Connect -> Session Pooler.

### Local Development
For local development, use package-local `.env` files that mirror the examples:
- `artifacts/solora/.env` for the Vite app.
- `artifacts/api-server/.env` for the Express API server.

Local development values typically look like this:
- Frontend: `PORT=5173`, `BASE_PATH=/`, `API_SERVER_URL=http://127.0.0.1:3000`, `VITE_API_BASE_URL=`.
- API server: `SUPABASE_URL=...`, `SUPABASE_ANON_KEY=...`, `SUPABASE_SERVICE_ROLE_KEY=...`, `DATABASE_URL=...`, `RESEND_API_KEY=...`, `BUSINESS_EMAIL=...`, `PORT=3000`, `CORS_ORIGIN=http://127.0.0.1:5173`.

### Production Deployment
In production:
- Set the frontend `VITE_API_BASE_URL` if the frontend and API server are on different origins.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` in server-only environment variables.
- Set `DATABASE_URL` to the verified Supabase IPv4 pooler URI and verify direct `pg` plus Drizzle queries before deploy.
- Set `CORS_ORIGIN` to the deployed frontend origin.
- Set `BASE_PATH` to `/` unless deploying under a subpath.
- Ensure the API server is reachable from the frontend origin and that CORS is configured for that origin.

## Migrations

Exact migration file:
- `lib/db/migrations/0001_initial.sql`

Useful commands:
```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/db run push-force
```

The initial migration creates:
- `users`
- `services`
- `leads`
- `newsletter_subscribers`
- `contact_submissions`
- `lead_status` enum
- timestamps, indexes, and update triggers
- seed rows for the initial services list

## Local Setup
1. Copy `artifacts/solora/.env.example` to `artifacts/solora/.env` and fill in the frontend values.
2. Copy `artifacts/api-server/.env.example` to `artifacts/api-server/.env` and fill in the server values.
3. Install dependencies with `pnpm install`.
4. Apply the database schema with `pnpm --filter @workspace/db run push`.
5. Run the API server with `pnpm --filter @workspace/api-server run dev`.
6. Run the frontend with `pnpm --filter @workspace/solora run dev`.
7. Open the Solora app and submit an inquiry or newsletter form to verify the end-to-end flow.

## API Endpoints

Public endpoints mounted under `/api`:
- `GET /api/services` - fetch active services.
- `POST /api/inquiries` - create a lead inquiry and send notifications.
- `POST /api/contact-submissions` - create a direct contact submission and send notifications.
- `POST /api/newsletter` - upsert a newsletter subscription and send the business notification.
- `GET /api/health` - health check from the API server.

## Database Schema

### `services`
Catalog of Solora offers shown in the inquiry dialog.
- Uses `slug` as the public lookup key.
- Tracks `is_active`, `created_at`, and `updated_at`.

### `leads`
Stores inquiry submissions from the CTA flow.
- Tracks contact details, selected service, budget range, source, and status.
- Uses `lead_status` with `new`, `contacted`, `in_progress`, and `closed`.
- Has indexes on email, status, service slug, and created time.

### `newsletter_subscribers`
Stores newsletter emails with a unique email constraint.

### `contact_submissions`
Stores direct contact requests with indexes on email and created time.

### `users`
Reserved for future authenticated admin access.

## Security And Hardening
- The frontend does not import or call Supabase directly.
- The server is the only place that reads `SUPABASE_SERVICE_ROLE_KEY`.
- The server validates `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL`, `PORT`, and `CORS_ORIGIN` before starting.
- The API routes are rate limited.
- All write inputs are validated server-side.
- The submission forms include a hidden honeypot field.
- The shared fetch helper enforces a request timeout for the submission flow.

## Deployment Notes
- Configure the frontend host and the API server host separately if needed.
- Keep Supabase and Resend credentials server-side only.
- Verify Resend has a verified sender domain or mailbox before going live.
- If deploying behind a proxy, keep `trust proxy` enabled on the API server so rate limiting sees real client IPs.
- Run the database migration before exposing the submission endpoints.

## Deployment Checklist
- [ ] `.env` values are set for the target environment.
- [ ] Supabase migration `0001_initial.sql` has been applied.
- [ ] Resend sender and receiving inbox are verified.
- [ ] API server typechecks and builds.
- [ ] Frontend typechecks and builds.
- [ ] `/api/services` returns data from the deployed API server.
- [ ] Inquiry submission creates a lead row in Supabase.
- [ ] Newsletter submission persists a subscriber row.
- [ ] Notification email arrives at `BUSINESS_EMAIL`.
- [ ] Frontend success toast appears after a successful submission.

## Future Admin Dashboard Recommendations
- Lead inbox with status filters and assignment.
- Email delivery log with success/failure metadata.
- Newsletter subscriber export and suppression management.
- Service catalog management for updating the public form options.
- Basic analytics for inquiry volume by source and service slug.
- Audit trail for status changes and admin actions.
