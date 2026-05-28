# Creating Test Accounts for SOLORA

## Test Accounts to Create

### Admin Account
- **Email:** frostedlogic007@gmail.com
- **Password:** SoloraAdmin@2026

### Normal User Account
- **Email:** traveler.demo@solora.in
- **Password:** Traveler@2026

## How to Create Accounts

### Option 1: Via Signup Page (Recommended)

1. Start the development server:
   ```bash
   cd artifacts/solora
   pnpm dev
   ```

2. Navigate to http://localhost:5173/signup

3. Create Admin Account:
   - Full Name: Solora Admin
   - Email: frostedlogic007@gmail.com
   - Password: SoloraAdmin@2026
   - Confirm Password: SoloraAdmin@2026
   - Click "Create account"

4. Create Normal User Account:
   - Full Name: Demo Traveler
   - Email: traveler.demo@solora.in
   - Password: Traveler@2026
   - Confirm Password: Traveler@2026
   - Click "Create account"

### Option 2: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Click "Add user" → "Create new user"
4. Enter email and password for each account
5. Confirm the email addresses (or disable email confirmation in Supabase settings)

### Option 3: Via SQL (Direct Database)

Run this SQL in your Supabase SQL Editor:

```sql
-- Note: You'll need to use Supabase Auth API or dashboard to create users
-- This is just for reference - actual user creation must go through Supabase Auth

-- After creating users via Supabase Auth, you can verify them with:
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email IN ('frostedlogic007@gmail.com', 'traveler.demo@solora.in');
```

## Verification Steps

### Test Admin Account:
1. Go to http://localhost:5173/admin/login
2. Login with frostedlogic007@gmail.com / SoloraAdmin@2026
3. Should redirect to /admin/dashboard
4. Verify you can see admin panel

### Test Normal User Account:
1. Go to http://localhost:5173/login
2. Login with traveler.demo@solora.in / Traveler@2026
3. Should redirect to /dashboard
4. Verify you can see user dashboard

### Test Wishlist Functionality:
1. Login as normal user
2. Go to /packages
3. Click "Save" on any package
4. Should show "Package saved" toast
5. Go to /dashboard
6. Verify saved package appears

## Troubleshooting

### Issue: Email confirmation required
**Solution:** In Supabase Dashboard:
1. Go to Authentication → Settings
2. Disable "Enable email confirmations"
3. Or manually confirm emails in Authentication → Users

### Issue: Admin account not recognized
**Solution:** Check environment variable:
```bash
# In artifacts/solora/.env
VITE_ADMIN_EMAILS=frostedlogic007@gmail.com
```

### Issue: Password too weak
**Solution:** Supabase requires:
- Minimum 6 characters
- Our passwords meet this requirement

### Issue: Account already exists
**Solution:** 
1. Go to Supabase Dashboard → Authentication → Users
2. Find the user
3. Delete and recreate
4. Or reset password

## After Creating Accounts

Test these flows:

- [ ] Admin can login at /admin/login
- [ ] Admin can access /admin/dashboard
- [ ] Admin can create destinations
- [ ] Admin can create packages
- [ ] Admin can upload images
- [ ] User can login at /login
- [ ] User can access /dashboard
- [ ] User can save packages
- [ ] User can view saved packages
- [ ] User can unsave packages
- [ ] Logout works for both accounts

## Notes

- Admin email is hardcoded in `FALLBACK_ADMIN_EMAILS` in `admin-auth.ts`
- Admin access is determined by email address match
- Normal users cannot access admin routes
- All accounts use Supabase Auth
- Session persistence is handled automatically
