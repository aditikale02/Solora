# 🧪 Manual Testing Guide - SOLORA Demo Credentials

## Current Situation

The test scripts show that:
- ✅ Accounts exist in Supabase
- ❌ Passwords don't match or accounts need to be reset

## 🎯 Step-by-Step Manual Testing

### Step 1: Access Supabase Dashboard

1. Open browser and go to: **https://supabase.com/dashboard**
2. Log in to your Supabase account
3. Select project: **iekygvfianzgklwpgiqr**

### Step 2: Check Existing Users

1. Navigate to: **Authentication → Users**
2. Look for these emails:
   - `frostedlogic007@gmail.com`
   - `traveler.demo@solora.in`

### Step 3A: If Users Exist - Reset Passwords

For each user:

1. Click the **three dots (⋮)** next to the user
2. Select **"Reset password"** or **"Send password reset email"**
3. Set password to:
   - Admin: `SoloraAdmin@2026`
   - User: `Traveler@2026`
4. Ensure **"Email Confirmed"** shows a green checkmark
5. If not confirmed, click three dots → **"Confirm email"**

### Step 3B: If Users Don't Exist - Create Them

For each account:

1. Click **"Add user"** button
2. Select **"Create new user"**
3. Enter details:

**Admin Account:**
```
Email:    frostedlogic007@gmail.com
Password: SoloraAdmin@2026
```

**User Account:**
```
Email:    traveler.demo@solora.in
Password: Traveler@2026
```

4. **IMPORTANT:** Check **"Auto Confirm User"** checkbox
5. Click **"Create user"**

### Step 4: Disable Email Confirmation (Recommended)

1. Go to: **Authentication → Settings**
2. Scroll to: **Email Auth** section
3. Find: **"Enable email confirmations"**
4. Toggle it **OFF**
5. Click **"Save"**

This allows signup to work immediately without email verification.

### Step 5: Test Admin Login

1. Open browser to: **http://localhost:5173/admin/login**
2. Enter credentials:
   ```
   Email:    frostedlogic007@gmail.com
   Password: SoloraAdmin@2026
   ```
3. Click **"Sign in"**
4. **Expected:** Redirect to `/admin/dashboard`
5. **Verify:** Admin panel is visible

### Step 6: Test User Login

1. Open browser to: **http://localhost:5173/login**
2. Enter credentials:
   ```
   Email:    traveler.demo@solora.in
   Password: Traveler@2026
   ```
3. Click **"Sign in"**
4. **Expected:** Redirect to `/dashboard`
5. **Verify:** User dashboard is visible

### Step 7: Test Signup (After Disabling Email Confirmation)

1. Open browser to: **http://localhost:5173/signup**
2. Enter new user details:
   ```
   Full Name: Test User
   Email:     test@example.com
   Password:  Test@2026
   Confirm:   Test@2026
   ```
3. Click **"Create account"**
4. **Expected:** Immediate redirect to `/dashboard`
5. **Verify:** New account works

---

## 🐛 Troubleshooting

### Issue: "Invalid login credentials"

**Possible Causes:**
- Password is incorrect
- Account doesn't exist
- Account exists but with different password

**Solutions:**
1. Reset password in Supabase Dashboard
2. Ensure password matches exactly: `SoloraAdmin@2026` or `Traveler@2026`
3. Check for typos (case-sensitive)

### Issue: "Email not confirmed"

**Cause:** Email confirmation is enabled

**Solutions:**
1. Go to Supabase Dashboard → Authentication → Users
2. Find user → Click three dots → "Confirm email"
3. OR disable email confirmation globally in Settings

### Issue: Signup doesn't work

**Cause:** Email confirmation is enabled

**Solution:**
1. Go to: Authentication → Settings → Email Auth
2. Disable: "Enable email confirmations"
3. Save changes
4. Try signup again

### Issue: Admin account not recognized

**Cause:** Email not in admin list

**Solution:**
1. Check `.env` file: `VITE_ADMIN_EMAILS=frostedlogic007@gmail.com`
2. Restart dev server: `pnpm dev`
3. Verify email matches exactly

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Admin account exists in Supabase
- [ ] Admin email is confirmed
- [ ] Admin password is: `SoloraAdmin@2026`
- [ ] Admin can login at `/admin/login`
- [ ] Admin redirects to `/admin/dashboard`
- [ ] Admin panel is accessible

- [ ] User account exists in Supabase
- [ ] User email is confirmed
- [ ] User password is: `Traveler@2026`
- [ ] User can login at `/login`
- [ ] User redirects to `/dashboard`
- [ ] User dashboard is accessible

- [ ] Email confirmation is disabled (optional, for easier signup)
- [ ] Signup works without email verification
- [ ] New accounts can be created

---

## 📊 Final Verification

Run the test script again to verify:

```bash
cd artifacts/solora
node test-credentials.js
```

**Expected Output:**
```
👤 Admin Account (frostedlogic007@gmail.com)
   Status: ✅ WORKING

👤 User Account (traveler.demo@solora.in)
   Status: ✅ WORKING
```

---

## 🔑 Quick Reference

### Admin Credentials
```
Email:    frostedlogic007@gmail.com
Password: SoloraAdmin@2026
URL:      http://localhost:5173/admin/login
```

### User Credentials
```
Email:    traveler.demo@solora.in
Password: Traveler@2026
URL:      http://localhost:5173/login
```

### Supabase Dashboard
```
URL:     https://supabase.com/dashboard
Project: iekygvfianzgklwpgiqr
```

---

## 📞 If Still Not Working

1. **Check Supabase Status:**
   - Visit: https://status.supabase.com
   - Ensure no outages

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for error messages in Console tab
   - Check Network tab for failed requests

3. **Check API Server:**
   - Ensure running on port 3000
   - Check logs for errors

4. **Restart Everything:**
   ```bash
   # Stop all servers (Ctrl+C)
   
   # Restart frontend
   cd artifacts/solora
   pnpm dev
   
   # Restart API (in new terminal)
   cd artifacts/api-server
   pnpm dev
   ```

5. **Clear Browser Cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

---

**Last Updated:** 2026-05-28
**Status:** ⚠️ Requires Manual Setup in Supabase Dashboard
