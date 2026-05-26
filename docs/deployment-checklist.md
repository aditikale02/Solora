# Deployment Checklist

- [ ] Review [production-deployment.md](./production-deployment.md).
- [ ] Set frontend env vars from `artifacts/solora/.env.example`: `PORT`, `BASE_PATH`, `API_SERVER_URL`, `VITE_API_BASE_URL`.
- [ ] Set API env vars from `artifacts/api-server/.env.example`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `RESEND_API_KEY`, `BUSINESS_EMAIL`, `PORT`, `CORS_ORIGIN`.
- [ ] Set `DATABASE_URL` to the verified Supabase IPv4 pooler URI from Connect -> Session Pooler, using port `6543` and `sslmode=require&uselibpqcompat=true`.
- [ ] Confirm `DATABASE_URL` direct `pg` and Drizzle runtime checks pass.
- [ ] Confirm `lib/db/migrations/0001_initial.sql` is already applied in Supabase.
- [ ] Verify `GET /api/services` returns the seeded service list.
- [ ] Verify inquiry, contact, and newsletter submissions persist rows in Supabase.
- [ ] Confirm notification emails arrive from Resend.
- [ ] Confirm the frontend only calls the API server.
- [ ] Confirm no secrets are exposed in client bundles.
- [ ] Confirm production typecheck and build pass for the monorepo packages.
