'use client';

import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useAuth } from './AuthProvider';

export default function PaymentForm({ transaction, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/escrow/${transaction.transactionId}?payment=success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      // Payment successful - update transaction in database
      const response = await fetch('/api/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transaction.transactionId,
          paymentIntentId: transaction.paymentIntentId,
          buyerId: user.uid,
          buyerName: user.displayName,
          buyerEmail: user.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{transaction.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-bold text-green-600">${transaction.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Escrow Fee:</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-gray-900 font-semibold">Total:</span>
              <span className="text-gray-900 font-bold">${transaction.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <PaymentElement />
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing Payment...' : `Pay $${transaction.price}`}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">🔒 Escrow Protection:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Payment held securely for 24 hours</li>
          <li>• You get immediate access to the file</li>
          <li>• Seller receives payment after 24 hours</li>
          <li>• 24-hour window to raise disputes if needed</li>
        </ul>
      </div>
    </form>
  );
} 