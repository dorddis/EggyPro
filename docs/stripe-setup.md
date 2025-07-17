# Stripe Payment Integration Setup

This document provides instructions for setting up Stripe payment processing in the application.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Access to your Stripe Dashboard

## Environment Variables Setup

### 1. Get Your Stripe Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 2. Update Environment Variables

In your `.env.local` file, replace the placeholder values:

```env
# Replace these with your actual Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here

# Development Settings (optional)
NEXT_PUBLIC_ENABLE_DEV_BYPASS=true
```

### 3. Environment Variable Descriptions

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (safe to expose in client-side code)
- `STRIPE_SECRET_KEY`: Your Stripe secret key (server-side only, never expose in client code)
- `NEXT_PUBLIC_ENABLE_DEV_BYPASS`: Enables development bypass button (set to `false` in production)

## Development vs Production

### Test Mode (Development)
- Use keys that start with `pk_test_` and `sk_test_`
- No real money is processed
- Development bypass option is available
- Use Stripe's test card numbers for testing

### Live Mode (Production)
- Use keys that start with `pk_live_` and `sk_live_`
- Real money is processed
- Development bypass is automatically disabled
- Only real credit cards work

## Validation

Run the validation script to check your configuration:

```bash
npx tsx scripts/validate-stripe-config.ts
```

This will verify:
- ✅ Environment variables are set correctly
- ✅ Key formats are valid
- ✅ Environment-specific settings are appropriate
- ✅ Amount formatting functions work correctly

## Test Cards

For testing in development mode, use these Stripe test card numbers:

| Card Number | Brand | Description |
|-------------|-------|-------------|
| 4242424242424242 | Visa | Succeeds |
| 4000000000000002 | Visa | Declined |
| 4000000000009995 | Visa | Insufficient funds |
| 5555555555554444 | Mastercard | Succeeds |
| 378282246310005 | American Express | Succeeds |

- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (4 digits for Amex)
- Use any ZIP code

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit real Stripe keys to version control**
2. **Use test keys in development environments**
3. **Store production keys securely in environment variables**
4. **Regularly rotate your API keys**
5. **Monitor your Stripe Dashboard for suspicious activity**

## Troubleshooting

### Common Issues

1. **"Missing Stripe publishable key" error**
   - Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
   - Restart your development server after adding environment variables

2. **"Invalid key format" error**
   - Verify your keys start with `pk_test_` or `pk_live_` (publishable)
   - Verify your keys start with `sk_test_` or `sk_live_` (secret)

3. **"Production environment should not use test keys" error**
   - Use live keys (`pk_live_` and `sk_live_`) in production
   - Set `NODE_ENV=production` for production builds

### Getting Help

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://github.com/stripe)

## Next Steps

After setting up your Stripe keys:

1. Run the validation script to confirm setup
2. Test the payment flow with test cards
3. Implement webhook endpoints for production use
4. Set up proper error monitoring and logging