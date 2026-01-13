# The Middle Man - Secure Digital Escrow Platform

A professional escrow service for digital transactions with AI-powered fraud detection.

[![Netlify Status](https://api.netlify.com/api/v1/badges/3957a1d1-3415-47bf-b659-5c93512c8e77/deploy-status)](https://themiddleman-escrow.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment%20Processing-green)](https://stripe.com/)

## Live Demo
Visit the live application at [https://themiddleman-escrow.netlify.app](https://themiddleman-escrow.netlify.app)

## What is The Middle Man?

The Middle Man is a secure digital escrow platform that acts as a trusted intermediary between buyers and sellers of digital products. It ensures safe, fraud-free transactions by holding payments securely until both parties are satisfied.

### Key Features
- 24-Hour Escrow Protection - Money held securely until transaction completion
- AI-Powered Fraud Detection - Advanced security to prevent scams
- Secure Payment Processing - Stripe integration for professional checkout
- Modern Web Application - Built with Next.js and React 19
- Google Authentication - Secure user login and management
- Real-time Dashboard - Track all your transactions
- Dispute Resolution - Built-in system for handling conflicts

## Architecture & Tech Stack

### Frontend
- Next.js 16 - React framework with server-side rendering
- React 19 - Latest React with modern features
- Tailwind CSS - Utility-first CSS framework
- Responsive Design - Works on all devices

### Backend & Services
- Firebase - Authentication and storage
- MySQL - Transaction and user data
- Stripe - Payment processing and checkout
- AI Integration - Fraud detection and dispute resolution
- Serverless Functions - API endpoints and business logic

### Infrastructure
- Netlify - Hosting and deployment
- CDN - Global content delivery
- SSL/HTTPS - Secure connections
- Auto-deployment - Continuous integration

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- MySQL database
- Stripe account

### Installation
```bash
# Clone the repository
git clone https://github.com/Art200507/themiddleman.git
cd themiddleman

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### Environment Variables
Create a `.env.local` file with:
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

# MySQL Configuration
MYSQL_URL=mysql://user:password@localhost:3306/themiddleman
```

### Database Setup
Run the schema in `db/schema.sql` to create the required tables.

## How It Works

### 1. Seller Uploads Digital Product
- Upload file with description and price
- Set escrow terms and conditions
- Product goes live on marketplace

### 2. Buyer Makes Purchase
- Browse available digital products
- Select item and proceed to checkout
- Complete payment through Stripe
- Payment held in escrow for 24 hours

### 3. File Delivery & Review
- Buyer gets immediate access to file
- 24-hour window to review and test
- Can raise disputes if product doesn't match description

### 4. Escrow Release
- Automatic release after 24 hours if no disputes
- Dispute resolution if conflicts arise
- AI-powered fraud detection helps investigations

## Security Features

- Escrow Protection - Money held securely until completion
- Fraud Detection - AI-powered scam prevention
- Secure Authentication - Google OAuth integration
- Encrypted Storage - All data encrypted at rest
- HTTPS Only - Secure connections everywhere
- Input Validation - Protection against malicious input

## User Experience

### For Buyers
- Browse digital products safely
- Secure payment processing
- Immediate file access after payment
- 24-hour protection window
- Easy dispute filing if needed

### For Sellers
- Upload and manage digital products
- Professional payment processing
- Guaranteed payment after escrow period
- Fraud protection for legitimate sales
- Analytics and transaction history

## Deployment

### Netlify (Recommended)
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Testing

### Payment Testing
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Authentication: `4000 0025 0000 3155`

### Development
```bash
# Run tests
npm test

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
themiddleman/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # User dashboard
│   │   ├── escrow/         # Escrow transactions
│   │   └── upload/         # File upload
│   ├── components/         # React components
│   │   ├── AuthProvider.js # Authentication
│   │   ├── PaymentForm.js # Stripe payment form
│   │   └── ...            # Other components
│   └── lib/               # Utility libraries
│       ├── firebase.js    # Firebase configuration
│       └── stripe.js      # Stripe configuration
├── public/                # Static assets
├── .env.local            # Environment variables
└── README.md             # This file
```

## Contributing

Contributions are welcome. Please see the contributing guide for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

- Documentation: [https://themiddleman-escrow.netlify.app](https://themiddleman-escrow.netlify.app)
- Issues: [GitHub Issues](https://github.com/Art200507/themiddleman/issues)

## Acknowledgments

- Next.js team for the framework
- Stripe for payment processing
- Firebase for backend services
- Tailwind CSS for styling
- Netlify for hosting and deployment

---

Built for secure digital commerce.
