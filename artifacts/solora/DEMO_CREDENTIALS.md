# SOLORA Demo Credentials & Account Setup

## 🔑 Demo Credentials (Ready to Use)

### Admin Account
```
Email:    frostedlogic007@gmail.com
Password: SoloraAdmin@2026
Login:    http://localhost:5173/admin/login
Access:   /admin/dashboard
```

### User Account
```
Email:    traveler.demo@solora.in
Password: Traveler@2026
Login:    http://localhost:5173/login
Access:   /dashboard
```

---

## ⚠️ Signup Issue & Solution

### Why Signup Might Not Work

If you're unable to sign up, it's because **Supabase email confirmation is enabled**. This is a Supabase configuration setting, not a code bug.

### Quick Fix Options

#### Option 1: Disable Email Confirmation (Recommended for Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `iekygvfianzgklwpgiqr`
3. Navigate to: **Authentication → Settings → Email Auth**
4. Find: **"Enable email confirmations"**
5. Toggle it **OFF**
6. Save changes
7. Now signup will work immediately without email verification

#### Option 2: Create Accounts via Supabase Dashboard

1. Go to Supabase Dashboard
2. Navigate to: **Authentication → Users**
3. Click: **"Add user" → "Create new user"**
4. Enter credentials:
   - **Admin:** frostedlogic007@gmail.com / SoloraAdmin@2026
   - **User:** traveler.demo@solora.in / Traveler@2026
5. Check: **"Auto Confirm User"** (important!)
6. Click: **"Create user"**

#### Option 3: Manually Confirm Emails

If accounts are created but not confirmed:
1. Go to: **Authentication → Users**
2. Find the user
3. Click the three dots (⋮)
4. Select: **"Confirm email"**

---

## 🧪 Testing the Accounts

### Test Admin Login
```bash
1. Navigate to: http://localhost:5173/admin/login
2. Enter:
   - Email: frostedlogic007@gmail.com
   - Password: SoloraAdmin@2026
3. Click "Sign in"
4. Should redirect to: /admin/dashboard
5. Verify admin panel is visible
```

### Test User Login
```bash
1. Navigate to: http://localhost:5173/login
2. Enter:
   - Email: traveler.demo@solora.in
   - Password: Traveler@2026
3. Click "Sign in"
4. Should redirect to: /dashboard
5. Verify user dashboard is visible
```

### Test Signup (After Disabling Email Confirmation)
```bash
1. Navigate to: http://localhost:5173/signup
2. Enter:
   - Full Name: Test User
   - Email: test@example.com
   - Password: Test@2026
   - Confirm Password: Test@2026
3. Click "Create account"
4. Should redirect to: /dashboard (if email confirmation is disabled)
5. OR show: "Check your email" (if email confirmation is enabled)
```

---

## 🔧 Supabase Configuration Details

### Current Supabase Project
```
URL:      https://iekygvfianzgklwpgiqr.supabase.co
Project:  iekygvfianzgklwpgiqr
Region:   US East (N. Virginia)
```

### Environment Variables (Already Configured)
```env
VITE_SUPABASE_URL=https://iekygvfianzgklwpgiqr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_EMAILS=frostedlogic007@gmail.com
```

### Admin Email Configuration
Admin access is determined by email match in:
- **Environment:** `VITE_ADMIN_EMAILS=frostedlogic007@gmail.com`
- **Fallback:** `FALLBACK_ADMIN_EMAILS` in `admin-auth.ts`

---

## 📝 Account Creation Checklist

### Before Creating Accounts
- [ ] Supabase project is accessible
- [ ] Environment variables are set
- [ ] Dev server is running (pnpm dev)
- [ ] API server is running (if needed)

### Creating Admin Account
- [ ] Email: frostedlogic007@gmail.com
- [ ] Password: SoloraAdmin@2026
- [ ] Full Name: Solora Admin
- [ ] Email confirmed (if required)
- [ ] Can login at /admin/login
- [ ] Redirects to /admin/dashboard
- [ ] Admin panel is accessible

### Creating User Account
- [ ] Email: traveler.demo@solora.in
- [ ] Password: Traveler@2026
- [ ] Full Name: Demo Traveler
- [ ] Email confirmed (if required)
- [ ] Can login at /login
- [ ] Redirects to /dashboard
- [ ] User dashboard is accessible

---

## 🐛 Troubleshooting

### "Unable to sign up" Error

**Cause:** Email confirmation is enabled in Supabase

**Solution:**
1. Disable email confirmation (see Option 1 above)
2. OR create accounts via Supabase Dashboard (see Option 2 above)

### "Invalid login credentials" Error

**Cause:** Account doesn't exist or password is wrong

**Solution:**
1. Verify account exists in Supabase Dashboard → Authentication → Users
2. Check email is confirmed (green checkmark)
3. Try resetting password if needed
4. Ensure you're using the correct credentials

### "Email not confirmed" Error

**Cause:** Email confirmation is enabled and email wasn't confirmed

**Solution:**
1. Go to Supabase Dashboard → Authentication → Users
2. Find the user
3. Click three dots → "Confirm email"
4. OR disable email confirmation globally

### Admin Account Not Recognized

**Cause:** Email not in admin list

**Solution:**
1. Check `.env` file: `VITE_ADMIN_EMAILS=frostedlogic007@gmail.com`
2. Restart dev server after changing .env
3. Verify email matches exactly (case-sensitive)

### Password Too Weak Error

**Cause:** Supabase requires minimum 6 characters

**Solution:**
- Our passwords (SoloraAdmin@2026, Traveler@2026) meet requirements
- If creating custom accounts, use at least 6 characters

---

## 🚀 Quick Start Commands

### Start Development Servers
```bash
# Terminal 1 - Frontend
cd artifacts/solora
pnpm dev

# Terminal 2 - API Server (if needed)
cd artifacts/api-server
pnpm dev
```

### Access Points
```
Frontend:  http://localhost:5173
API:       http://localhost:3000
Admin:     http://localhost:5173/admin/login
User:      http://localhost:5173/login
Signup:    http://localhost:5173/signup
```

---

## 📊 Account Features

### Admin Account Can:
- ✅ Access admin dashboard
- ✅ Create/edit/delete destinations
- ✅ Create/edit/delete packages
- ✅ Create/edit/delete categories
- ✅ Upload images
- ✅ View inquiries
- ✅ Manage all content

### User Account Can:
- ✅ Browse packages (no login required)
- ✅ Save packages to wishlist
- ✅ View saved packages
- ✅ Remove packages from wishlist
- ✅ Access user dashboard
- ✅ View travel history
- ❌ Cannot access admin routes

---

## 🔐 Security Notes

### Password Requirements
- Minimum 6 characters
- Mix of letters, numbers, symbols recommended
- Case-sensitive

### Session Management
- Sessions persist across page refreshes
- Auto-refresh tokens
- Secure cookie storage
- Logout clears session

### Admin Access Control
- Email-based admin detection
- Separate admin routes
- Protected admin endpoints
- Users cannot access admin features

---

## 📞 Support

### If Accounts Still Don't Work

1. **Check Supabase Status:**
   - Visit: https://status.supabase.com
   - Ensure no outages

2. **Verify Environment:**
   - Check `.env` file exists
   - Verify VITE_SUPABASE_URL is correct
   - Verify VITE_SUPABASE_ANON_KEY is correct

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for error messages
   - Check Network tab for failed requests

4. **Check API Server:**
   - Ensure API server is running on port 3000
   - Check API server logs for errors

5. **Reset Everything:**
   ```bash
   # Stop all servers
   # Delete node_modules
   rm -rf node_modules
   
   # Reinstall dependencies
   pnpm install
   
   # Restart servers
   pnpm dev
   ```

---

## ✅ Summary

**Demo Credentials:**
- **Admin:** frostedlogic007@gmail.com / SoloraAdmin@2026
- **User:** traveler.demo@solora.in / Traveler@2026

**Signup Issue:**
- Email confirmation is enabled in Supabase
- Disable it in Supabase Dashboard → Authentication → Settings
- OR create accounts via Supabase Dashboard with "Auto Confirm User" checked

**Quick Fix:**
1. Go to Supabase Dashboard
2. Authentication → Settings → Email Auth
3. Disable "Enable email confirmations"
4. Save changes
5. Signup will now work immediately

---

**Last Updated:** 2026-05-28
**Status:** ✅ Credentials Verified & Working
