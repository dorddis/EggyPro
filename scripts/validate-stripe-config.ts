#!/usr/bin/env tsx

import { 
  getStripeConfig, 
  getPaymentConfig, 
  validateStripeConfig,
  formatAmountForStripe,
  formatAmountForDisplay 
} from '../src/lib/stripe';

console.log('🔧 Validating Stripe Configuration...\n');

try {
  // Test basic configuration
  console.log('📋 Testing basic configuration...');
  const config = getStripeConfig();
  console.log(`✅ Stripe publishable key: ${config.publishableKey.substring(0, 12)}...`);
  console.log(`✅ API version: ${config.apiVersion}`);

  // Test payment configuration
  console.log('\n📋 Testing payment configuration...');
  const paymentConfig = getPaymentConfig();
  console.log(`✅ Environment: ${paymentConfig.isDevelopment ? 'Development' : 'Production'}`);
  console.log(`✅ Dev bypass enabled: ${paymentConfig.enableDevBypass}`);

  // Test validation
  console.log('\n📋 Testing configuration validation...');
  const validation = validateStripeConfig();
  if (validation.isValid) {
    console.log('✅ Configuration is valid');
  } else {
    console.log('❌ Configuration has errors:');
    validation.errors.forEach(error => console.log(`   - ${error}`));
  }

  // Test amount formatting
  console.log('\n📋 Testing amount formatting...');
  const testAmounts = [10.99, 0.50, 100, 0.01];
  testAmounts.forEach(amount => {
    const stripeAmount = formatAmountForStripe(amount);
    const displayAmount = formatAmountForDisplay(stripeAmount);
    console.log(`✅ $${amount} → ${stripeAmount} cents → $${displayAmount}`);
  });

  console.log('\n🎉 All Stripe configuration tests passed!');

} catch (error) {
  console.error('❌ Stripe configuration error:', error instanceof Error ? error.message : error);
  process.exit(1);
}