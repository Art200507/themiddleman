'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '@/lib/stripe';
import PaymentForm from '@/components/PaymentForm';
import EscrowTimer from '@/components/EscrowTimer';
import DisputeForm from '@/components/DisputeForm';
import FraudDetection from '@/components/FraudDetection';

export default function EscrowTransaction({ params }) {
  const { user, login } = useAuth();
  const router = useRouter();
  const { id } = use(params);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transactions?transactionId=${encodeURIComponent(id)}`);
        const result = await response.json();

        if (!response.ok) {
          setError("Transaction not found");
          setLoading(false);
          return;
        }

        setTransaction(result.transaction);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        setError("Error loading transaction");
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handlePayment = async () => {
    if (!user) {
      alert("Please sign in to make a payment");
      return;
    }

    if (transaction.sellerId === user.uid) {
      alert("You cannot buy your own product");
      return;
    }

    setPaymentLoading(true);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: transaction.price,
          currency: 'usd',
        }),
      });

      const result = await response.json();

      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
        setShowPaymentForm(true);
        setTransaction((prev) => ({
          ...prev,
          paymentIntentId: result.paymentIntentId
        }));
      } else {
        alert("Failed to create payment. Please try again.");
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Handle successful payment
    alert("Payment successful! Your escrow is now active.");
    setShowPaymentForm(false);
    // Refresh transaction data
    window.location.reload();
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error}`);
    setShowPaymentForm(false);
  };

  const handleDisputeRaised = () => {
    setTransaction(prev => ({ ...prev, status: 'disputed' }));
    setShowDisputeForm(false);
  };

  const handleEscrowTimeUp = () => {
    setTransaction(prev => ({ ...prev, status: 'completed' }));
  };

  const downloadFile = () => {
    if (transaction.fileURL) {
      window.open(transaction.fileURL, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Transaction Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">The MiddleMan</h1>
              <span className="ml-2 text-sm text-gray-500">Secure Escrow Service</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">Welcome, {user.displayName}</span>
                  <button 
                    onClick={() => router.push('/')}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back to Home
                  </button>
                </>
              ) : (
                <button 
                  onClick={login}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In to Buy
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{transaction.title}</h1>
            <p className="text-gray-600">{transaction.description}</p>
          </div>

          <div className="space-y-6">
            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Price:</span>
                <span className="text-2xl font-bold text-green-600">${transaction.price}</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Seller Information:</h3>
              <p className="text-gray-600">Seller: {transaction.sellerName}</p>
              <p className="text-gray-600">File: {transaction.fileName}</p>
            </div>

            {/* Status */}
            <div className={`rounded-lg p-4 ${
              transaction.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
              transaction.status === 'paid' ? 'bg-green-50 border border-green-200' :
              transaction.status === 'disputed' ? 'bg-red-50 border border-red-200' :
              transaction.status === 'completed' ? 'bg-blue-50 border border-blue-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <h3 className="font-semibold mb-2">Status: {transaction.status.toUpperCase()}</h3>
              {transaction.status === 'pending' && (
                <p className="text-sm text-yellow-700">
                  This transaction is pending payment. The seller will receive payment 24 hours after you complete the purchase.
                </p>
              )}
              {transaction.status === 'paid' && (
                <div className="space-y-3">
                  <p className="text-sm text-green-700">
                    Payment completed! You can download the file now. The seller will receive payment in 24 hours.
                  </p>
                  <EscrowTimer 
                    escrowReleaseTime={transaction.escrowReleaseTime}
                    onTimeUp={handleEscrowTimeUp}
                  />
                </div>
              )}
              {transaction.status === 'disputed' && (
                <div className="space-y-3">
                  <p className="text-sm text-red-700">
                    A dispute has been raised for this transaction. Our team will review the case within 48 hours.
                  </p>
                  {transaction.disputeReason && (
                    <div className="bg-white border border-red-200 rounded p-3">
                      <p className="text-sm font-medium text-red-800">Dispute Reason: {transaction.disputeReason}</p>
                      {transaction.disputeDescription && (
                        <p className="text-sm text-red-700 mt-1">{transaction.disputeDescription}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {transaction.status === 'completed' && (
                <p className="text-sm text-blue-700">
                  Transaction completed! Funds have been released to the seller.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {transaction.status === 'pending' && (
              <div className="space-y-3">
                {!user ? (
                  <button 
                    onClick={login}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Sign In to Purchase
                  </button>
                ) : transaction.sellerId === user.uid ? (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">This is your own product listing</p>
                  </div>
                ) : showPaymentForm && clientSecret ? (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <Elements stripe={stripePromise} options={{ clientSecret }} key={clientSecret}>
                      <PaymentForm 
                        transaction={transaction}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        onRequestPayment={handlePayment}
                      />
                    </Elements>
                  </div>
                ) : (
                  <button 
                    onClick={() => handlePayment()}
                    disabled={paymentLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentLoading ? 'Processing Payment...' : `Pay $${transaction.price}`}
                  </button>
                )}
              </div>
            )}

            {transaction.status === 'paid' && user && transaction.buyerId === user.uid && (
              <div className="space-y-3">
                <button 
                  onClick={downloadFile}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Download File
                </button>
                <button 
                  onClick={() => setShowDisputeForm(true)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Raise Dispute
                </button>
              </div>
            )}

            {showDisputeForm && (
              <div className="mt-6">
                <DisputeForm 
                  transaction={transaction}
                  onDisputeRaised={handleDisputeRaised}
                  onCancel={() => setShowDisputeForm(false)}
                />
              </div>
            )}

            {/* AI Fraud Detection */}
            {user && (transaction.sellerId === user.uid || transaction.buyerId === user.uid) && (
              <div className="mt-6">
                <FraudDetection 
                  transaction={transaction}
                  onAnalysisComplete={(analysis) => {
                    console.log('Fraud analysis completed:', analysis);
                  }}
                />
              </div>
            )}

            {/* Escrow Protection Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">🔒 Escrow Protection:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Payment is held securely for 24 hours</li>
                <li>• You get immediate access to the file after payment</li>
                <li>• Seller receives payment after 24 hours (unless dispute)</li>
                <li>• 24-hour window to raise disputes if needed</li>
                <li>• AI-powered fraud detection for added security</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
