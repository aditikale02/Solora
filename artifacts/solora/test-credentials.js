/**
 * Test Script for SOLORA Demo Credentials
 * 
 * This script tests if the demo credentials can successfully authenticate
 * with Supabase.
 * 
 * Run with: node test-credentials.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iekygvfianzgklwpgiqr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla3lndmZpYW56Z2tsd3BnaXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzA5NTgsImV4cCI6MjA5NTEwNjk1OH0.AwSLDQLfOc8O-29UoYg6sf76JWdBOVV7lfIOTLiFnPw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_CREDENTIALS = {
  email: 'frostedlogic007@gmail.com',
  password: 'SoloraQA@2026'
};

const USER_CREDENTIALS = {
  email: 'traveler.demo@solora.in',
  password: 'TravelerQA@2026'
};

async function testLogin(credentials, accountType) {
  console.log(`\n🧪 Testing ${accountType} Login...`);
  console.log(`   Email: ${credentials.email}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      console.log(`   ❌ Login Failed: ${error.message}`);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log(`   ℹ️  Account may not exist or password is incorrect`);
      } else if (error.message.includes('Email not confirmed')) {
        console.log(`   ℹ️  Email confirmation is required`);
        console.log(`   💡 Solution: Confirm email in Supabase Dashboard`);
      }
      
      return false;
    }

    if (data.session) {
      console.log(`   ✅ Login Successful!`);
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Email Confirmed: ${data.user.email_confirmed_at ? '✅ Yes' : '❌ No'}`);
      
      // Sign out after test
      await supabase.auth.signOut();
      return true;
    }

    console.log(`   ⚠️  Login returned no session`);
    return false;

  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    return false;
  }
}

async function checkUserExists(email) {
  console.log(`\n🔍 Checking if user exists: ${email}`);
  
  try {
    // Try to sign in with a wrong password to check if user exists
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'wrong-password-test-123'
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        console.log(`   ℹ️  User exists (wrong password test)`);
        return true;
      } else if (error.message.includes('Email not confirmed')) {
        console.log(`   ℹ️  User exists but email not confirmed`);
        return true;
      }
    }
    
    return false;
  } catch (err) {
    console.log(`   ⚠️  Could not determine: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔐 SOLORA Demo Credentials Test');
  console.log('═══════════════════════════════════════════════════════');
  
  console.log('\n📊 Supabase Configuration:');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Project: iekygvfianzgklwpgiqr`);
  
  // Test Admin Account
  const adminExists = await checkUserExists(ADMIN_CREDENTIALS.email);
  const adminWorks = await testLogin(ADMIN_CREDENTIALS, 'ADMIN');
  
  // Test User Account
  const userExists = await checkUserExists(USER_CREDENTIALS.email);
  const userWorks = await testLogin(USER_CREDENTIALS, 'USER');
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 Test Summary:');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`\n👤 Admin Account (${ADMIN_CREDENTIALS.email})`);
  console.log(`   Status: ${adminWorks ? '✅ WORKING' : '❌ NOT WORKING'}`);
  
  console.log(`\n👤 User Account (${USER_CREDENTIALS.email})`);
  console.log(`   Status: ${userWorks ? '✅ WORKING' : '❌ NOT WORKING'}`);
  
  if (!adminWorks || !userWorks) {
    console.log('\n💡 Next Steps:');
    console.log('   1. Check if accounts exist in Supabase Dashboard');
    console.log('   2. Go to: Authentication → Users');
    console.log('   3. If accounts exist, confirm emails');
    console.log('   4. If accounts don\'t exist, create them');
    console.log('   5. OR disable email confirmation in Settings');
  }
  
  console.log('\n═══════════════════════════════════════════════════════\n');
}

main().catch(console.error);
