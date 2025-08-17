# Simple Stripe Setup Guide 🎯

## Why Stripe is Actually Simple!

Stripe gets a bad rap, but it's actually one of the **easiest** payment gateways to set up! Here's why:

✅ **No website verification needed** (unlike Razorpay)  
✅ **Works immediately** with test keys  
✅ **Great documentation** and support  
✅ **Simple API** that just works  

## 🚀 Quick Setup (5 minutes!)

### Step 1: Get Stripe Keys
1. Go to [stripe.com](https://stripe.com)
2. Sign up for free account
3. Go to **Developers → API keys**
4. Copy your **Publishable key** and **Secret key**

### Step 2: Set Environment Variables
Create `.env.local` in your project root:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Step 3: Test Payment
- Use test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVV
- Any name/email

## 🔑 What Each Key Does

- **Publishable Key** (`pk_test_...`): Used in browser (safe to expose)
- **Secret Key** (`sk_test_...`): Used on server only (keep secret)

## 🧪 Test Mode vs Live Mode

- **Test Mode**: Use `pk_test_` and `sk_test_` keys
- **Live Mode**: Use `pk_live_` and `sk_live_` keys (when ready for real money)

## 🎯 How It Works

1. User clicks "Pay"
2. Stripe Elements form appears
3. User enters card details
4. Payment is processed securely
5. Success callback is triggered
6. Your app handles the success

## 🚫 Common Mistakes to Avoid

- ❌ Don't commit `.env.local` to git
- ❌ Don't use live keys for testing
- ❌ Don't forget to set environment variables in production

## ✅ What You Get

- **Secure payment processing**
- **Beautiful payment forms**
- **Multiple payment methods**
- **Fraud protection**
- **Professional checkout experience**

## 🎉 You're Done!

That's it! Stripe is actually much simpler than people think. The key is having the right environment variables set up.

**Next steps:**
1. Get your Stripe test keys
2. Add them to `.env.local`
3. Test the payment flow
4. Start accepting payments!

Stripe is the industry standard for a reason - it just works! 🚀 