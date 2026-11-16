import { loadStripe } from '@stripe/stripe-js';
const key=process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export default key?.startsWith('pk_test_') ? loadStripe(key) : null;
