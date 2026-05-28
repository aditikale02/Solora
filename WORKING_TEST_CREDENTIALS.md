# ✅ Working Test Credentials

## Current Issue

The original credentials exist but passwords don't match. You have two options:

## Option 1: Reset Existing Passwords (Recommended)

Reset passwords in Supabase Dashboard to match these:

**Admin:**
```
Email:    frostedlogic007@gmail.com
Password: SoloraAdmin@2026
```

**User:**
```
Email:    traveler.demo@solora.in
Password: Traveler@2026
```

## Option 2: Create New Test Accounts (Easier)

Create fresh test accounts in Supabase Dashboard:

**Admin Test:**
```
Email:    admin@solora.test
Password: Admin@2026
```

**User Test:**
```
Email:    user@solora.test
Password: User@2026
```

### Steps to Create:

1. Go to: https://supabase.com/dashboard
2. Project: iekygvfianzgklwpgiqr
3. Authentication → Users
4. Click "Add user" → "Create new user"
5. Enter email and password
6. ☑️ Check "Auto Confirm User"
7. Click "Create user"

### Update Admin List:

After creating admin@solora.test, update `.env`:

```env
VITE_ADMIN_EMAILS=frostedlogic007@gmail.com,admin@solora.test
```

Restart dev server:
```bash
# Stop server (Ctrl+C)
# Start again
cd artifacts/solora
pnpm dev
```

---

## 🧪 Test the Accounts

### Test Admin:
```
URL:      http://localhost:5173/admin/login
Email:    admin@solora.test
Password: Admin@2026
Expected: Redirect to /admin/dashboard
```

### Test User:
```
URL:      http://localhost:5173/login
Email:    user@solora.test
Password: User@2026
Expected: Redirect to /dashboard
```

---

## ✅ Success Checklist

- [ ] Accounts created in Supabase
- [ ] Emails confirmed (green checkmark)
- [ ] Passwords set correctly
- [ ] Admin email added to VITE_ADMIN_EMAILS
- [ ] Dev server restarted
- [ ] Admin login works
- [ ] User login works

---

**Status:** Ready to create test accounts
**Next Step:** Create accounts in Supabase Dashboard
