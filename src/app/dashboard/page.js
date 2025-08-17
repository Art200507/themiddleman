'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('selling');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const fetchTransactions = async () => {
      try {
        const transactionsRef = collection(db, "transactions");
        
        // Get transactions where user is seller
        const sellingQuery = query(
          transactionsRef, 
          where("sellerId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        
        // Get transactions where user is buyer
        const buyingQuery = query(
          transactionsRef, 
          where("buyerId", "==", user.uid),
          orderBy("paidAt", "desc")
        );

        const [sellingSnapshot, buyingSnapshot] = await Promise.all([
          getDocs(sellingQuery),
          getDocs(buyingQuery)
        ]);

        const sellingData = sellingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const buyingData = buyingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setTransactions({ selling: sellingData, buying: buyingData });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.toDate()).toLocaleDateString();
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
              <span className="text-sm text-gray-700">Welcome, {user.displayName}</span>
              <button 
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('selling')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'selling'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Selling ({transactions.selling?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('buying')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'buying'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Buying ({transactions.buying?.length || 0})
              </button>
            </nav>
          </div>

          {/* Transactions List */}
          <div className="p-6">
            {activeTab === 'selling' ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Escrow Transactions</h2>
                {transactions.selling?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't created any escrow transactions yet.</p>
                    <button 
                      onClick={() => router.push('/upload')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Your First Transaction
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.selling?.map((transaction) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{transaction.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Price: ${transaction.price}</span>
                              <span>Created: {formatDate(transaction.createdAt)}</span>
                              {transaction.buyerName && (
                                <span>Buyer: {transaction.buyerName}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status.toUpperCase()}
                            </span>
                            <a 
                              href={`/escrow/${transaction.transactionId}`}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Purchases</h2>
                {transactions.buying?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You haven't made any purchases yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.buying?.map((transaction) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{transaction.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Price: ${transaction.price}</span>
                              <span>Paid: {formatDate(transaction.paidAt)}</span>
                              <span>Seller: {transaction.sellerName}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status.toUpperCase()}
                            </span>
                            <a 
                              href={`/escrow/${transaction.transactionId}`}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 