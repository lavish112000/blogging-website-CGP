#!/usr/bin/env node

/**
 * Test Newsletter Subscription System
 * 
 * This script tests the email subscription system locally
 * to ensure all components are working properly.
 */

const testEmail = 'test@example.com';
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

async function testSubscription() {
  console.log('🧪 Testing Newsletter Subscription System\n');

  // 1. Check environment variables
  console.log('1️⃣  Checking environment variables...');
  const requiredVars = [
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'SUBSCRIBER_TOKEN_SECRET',
    'MONGODB_URI'
  ];

  const missing = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
      console.log(`   ❌ ${varName} is missing`);
    } else {
      console.log(`   ✅ ${varName} is set`);
    }
  }

  if (missing.length > 0) {
    console.log('\n❌ Missing environment variables. Please check your .env.local file.\n');
    return false;
  }

  // 2. Test database connection
  console.log('\n2️⃣  Testing database connection...');
  try {
    const response = await fetch(`${baseUrl}/api/test-db`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Database connected: ${data.message}`);
    } else {
      console.log(`   ❌ Database connection failed`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Database test failed:`, error.message);
    return false;
  }

  // 3. Test subscription endpoint
  console.log('\n3️⃣  Testing subscription endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Subscription successful: ${data.message}`);
    } else {
      console.log(`   ❌ Subscription failed: ${data.error}`);
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Subscription test failed:`, error.message);
    return false;
  }

  console.log('\n✅ All tests passed! Newsletter system is working correctly.\n');
  console.log('📝 Notes:');
  console.log('   - Check your email for the confirmation link');
  console.log('   - Using RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
  console.log('   - For production, verify your domain in Resend dashboard\n');

  return true;
}

// Run tests
testSubscription()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Test error:', error);
    process.exit(1);
  });
