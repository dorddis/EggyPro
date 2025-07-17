#!/usr/bin/env tsx

const BASE_URL = 'http://localhost:9004';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  data?: any;
}

async function testAPI(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`${response.status}: ${errorData.error || response.statusText}`);
  }
  
  return response.json();
}

async function runTests(): Promise<void> {
  const results: TestResult[] = [];
  
  console.log('🧪 Testing Mock Payment APIs...\n');
  
  // Test 1: Payment Intent API - GET
  try {
    const data = await testAPI('/api/create-payment-intent');
    results.push({
      name: 'Payment Intent API - Health Check',
      success: true,
      data: data.message,
    });
  } catch (error) {
    results.push({
      name: 'Payment Intent API - Health Check',
      success: false,
      error: String(error),
    });
  }
  
  // Test 2: Payment Intent API - POST
  try {
    const paymentData = {
      amount: 29.99,
      currency: 'usd',
      items: [
        {
          id: 'eggypro-original',
          name: 'EggyPro Original',
          price: 29.99,
          quantity: 1,
        },
      ],
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
      },
    };
    
    const data = await testAPI('/api/create-payment-intent', 'POST', paymentData);
    results.push({
      name: 'Payment Intent Creation',
      success: true,
      data: {
        paymentIntentId: data.paymentIntentId,
        amount: data.amount,
        status: data.status,
      },
    });
  } catch (error) {
    results.push({
      name: 'Payment Intent Creation',
      success: false,
      error: String(error),
    });
  }
  
  // Test 3: Payment Confirmation API - GET
  try {
    const data = await testAPI('/api/confirm-payment');
    results.push({
      name: 'Payment Confirmation API - Health Check',
      success: true,
      data: data.message,
    });
  } catch (error) {
    results.push({
      name: 'Payment Confirmation API - Health Check',
      success: false,
      error: String(error),
    });
  }
  
  // Test 4: Payment Confirmation API - POST
  try {
    const confirmationData = {
      paymentIntentId: 'pi_mock_test_123',
      paymentMethodType: 'card' as const,
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        address: '123 Test St',
        city: 'Test City',
        zip: '12345',
      },
    };
    
    const data = await testAPI('/api/confirm-payment', 'POST', confirmationData);
    results.push({
      name: 'Payment Confirmation',
      success: true,
      data: {
        orderId: data.orderId,
        status: data.status,
        amount: data.amount,
      },
    });
  } catch (error) {
    results.push({
      name: 'Payment Confirmation',
      success: false,
      error: String(error),
    });
  }
  
  // Test 5: Error Handling - Invalid Payment Intent
  try {
    const invalidData = {
      amount: -10, // Invalid amount
      currency: 'usd',
      items: [],
    };
    
    await testAPI('/api/create-payment-intent', 'POST', invalidData);
    results.push({
      name: 'Error Handling - Invalid Amount',
      success: false,
      error: 'Should have failed but didn\'t',
    });
  } catch (error) {
    results.push({
      name: 'Error Handling - Invalid Amount',
      success: true,
      data: 'Correctly rejected invalid amount',
    });
  }
  
  // Display results
  console.log('📊 Test Results:\n');
  
  let passCount = 0;
  let failCount = 0;
  
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? 'PASS' : 'FAIL';
    
    console.log(`${icon} ${index + 1}. ${result.name} - ${status}`);
    
    if (result.success) {
      passCount++;
      if (result.data) {
        console.log(`   Data: ${typeof result.data === 'object' ? JSON.stringify(result.data, null, 2).replace(/\n/g, '\n   ') : result.data}`);
      }
    } else {
      failCount++;
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    console.log();
  });
  
  console.log(`📈 Summary: ${passCount} passed, ${failCount} failed`);
  
  if (failCount > 0) {
    console.log('\n⚠️  Some tests failed. Make sure your development server is running on port 9004.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Mock payment APIs are working correctly.');
  }
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});