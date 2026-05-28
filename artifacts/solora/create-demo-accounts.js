/**
 * Create Demo Accounts Script for SOLORA
 * 
 * This script creates the demo admin and user accounts in Supabase.
 * 
 * Run with: node create-demo-accounts.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iekygvfianzgklwpgiqr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla3lndmZpYW56Z2tsd3BnaXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzA5NTgsImV4cCI6MjA5NTEwNjk1OH0.AwSLDQLfOc8O-29UoYg6sf76JWdBOVV7lfIOTLiFnPw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ACCOUNTS = [
  {
    type: 'ADMIN',
    email: 'frostedlogic007@gmail.com',
    password: 'SoloraAdmin@2026',
    fullName: 'Solora Admin'
  },
  {
    type: 'USER',
    email: 'traveler.demo@solora.in',
    password: 'Traveler@2026',
    fullName: 'Demo Traveler'
  }
];

async function createAccount(account) {
  console.log(`\n🔨 Creating ${account.type} Account...`);
  console.log(`   Email: ${account.email}`);
  console.log(`   Name: ${account.fullName}`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          full_name: account.fullName
        }
      }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        console.log(`   ⚠️  Account already exists`);
        console.log(`   💡 Try logging in with these credentials`);
        console.log(`   💡 Or reset password in Supabase Dashboard`);
        return { success: false, exists: true };
      }
      
      console.log(`   ❌ Failed: ${error.message}`);
      return { success: false, exists: false };
    }

    if (data.user) {
      console.log(`   ✅ Account Created Successfully!`);
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      
      if (data.session) {
        console.log(`   ✅ Auto-logged in (email confirmation disabled)`);
        await supabase.auth.signOut();
      } else {
        console.log(`   ⚠️  Email confirmation required`);
        console.log(`   📧 Check email: ${account.email}`);
        console.log(`   💡 Or confirm in Supabase Dashboard → Authentication → Users`);
      }
      
      return { success: true, exists: false };
    }

    console.log(`   ⚠️  Unknown response`);
    return { success: false, exists: false };

  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    return { success: false, exists: false };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔐 SOLORA Demo Accounts Creation');
  console.log('═══════════════════════════════════════════════════════');
  
  console.log('\n📊 Supabase Configuration:');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Project: iekygvfianzgklwpgiqr`);
  
  console.log('\n⚠️  IMPORTANT NOTES:');
  console.log('   • If email confirmation is enabled, you\'ll need to confirm emails');
  console.log('   • If accounts already exist, you\'ll see a warning');
  console.log('   • You can reset passwords in Supabase Dashboard if needed');
  
  const results = [];
  
  for (const account of ACCOUNTS) {
    const result = await createAccount(account);
    results.push({ ...account, ...result });
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 Creation Summary:');
  console.log('═══════════════════════════════════════════════════════');
  
  for (const result of results) {
    console.log(`\n👤 ${result.type} Account (${result.email})`);
    if (result.success) {
      console.log(`   Status: ✅ CREATED`);
      console.log(`   Password: ${result.password}`);
    } else if (result.exists) {
      console.log(`   Status: ⚠️  ALREADY EXISTS`);
      console.log(`   Password: ${result.password}`);
      console.log(`   Action: Try logging in or reset password`);
    } else {
      console.log(`   Status: ❌ FAILED`);
      console.log(`   Action: Check Supabase Dashboard for details`);
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📝 Next Steps:');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n1. If email confirmation is required:');
  console.log('   • Go to Supabase Dashboard → Authentication → Users');
  console.log('   • Find each user and click "Confirm email"');
  console.log('   • OR disable email confirmation in Settings');
  
  console.log('\n2. Test the credentials:');
  console.log('   • Admin: http://localhost:5173/admin/login');
  console.log('   • User:  http://localhost:5173/login');
  
  console.log('\n3. If accounts already exist but passwords don\'t work:');
  console.log('   • Go to Supabase Dashboard → Authentication → Users');
  console.log('   • Click three dots (⋮) next to user');
  console.log('   • Select "Reset password"');
  console.log('   • Set new password to match credentials above');
  
  console.log('\n═══════════════════════════════════════════════════════\n');
}

main().catch(console.error);
