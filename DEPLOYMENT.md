# Deployment status

This is a TEST-PAYMENT prototype, not a production escrow service. Live Stripe keys are rejected. Payment creation now uses the database price and verified Firebase identity; confirmation retrieves the PaymentIntent from Stripe and checks amount, currency, buyer, transaction and success status. API identity fields supplied by clients are not trusted. Private transaction fields are removed from public listings.

Before deployment, configure Firebase Auth and Storage in your own project, authorize the Vercel domain, configure `MYSQL_URL` and apply `db/schema.sql`, then supply Stripe TEST keys. `NEXT_PUBLIC_FIREBASE_*` values are public app configuration. `STRIPE_SECRET_KEY`, `MYSQL_URL` and `DEEPSEEK_API_KEY` stay server-side.

Still required before an advertised live demo: test cross-user access, Storage rules and object ownership, file uploads/downloads, a Stripe test checkout (including redirect flows), and signed payment webhook reconciliation. Do not use real funds. The existing client timer does not implement real escrow settlement.
