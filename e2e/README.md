E2E tests (Playwright)
-----------------------

Prerequisites:

- A running backend API and frontend (dev servers) or set `E2E_BASE_URL` to a reachable deployment URL.
- Provide admin credentials via env vars: `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD`.
- Ensure API base URL is reachable from frontend (for local default setup use `http://127.0.0.1:3000`).

Install:

```
pnpm --filter ./e2e install
pnpm --filter ./e2e exec playwright install --with-deps chromium
```

Run:

```
E2E_ADMIN_EMAIL=you@example.com E2E_ADMIN_PASSWORD=secret pnpm --filter ./e2e test
```

Windows PowerShell:

```powershell
$env:E2E_ADMIN_EMAIL="you@example.com"
$env:E2E_ADMIN_PASSWORD="secret"
pnpm --filter ./e2e test
```

Covered flows:

- Protected admin route redirects
- Admin login and logout
- Destination CRUD
- Package CRUD
- Image upload
- Public packages page
- Inquiry API flow
- Contact API flow
- Newsletter API flow

GitHub Actions secrets required for E2E:

- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`
