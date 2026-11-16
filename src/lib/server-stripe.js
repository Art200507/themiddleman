import Stripe from 'stripe';
export function testStripe() {
 const key=process.env.STRIPE_SECRET_KEY;
 if(!key?.startsWith('sk_test_'))throw Object.assign(new Error('Test payments are not configured'),{status:503});
 return new Stripe(key);
}
