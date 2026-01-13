'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuth();
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
        const [sellingResponse, buyingResponse] = await Promise.all([
          fetch(`/api/transactions?sellerId=${encodeURIComponent(user.uid)}`),
          fetch(`/api/transactions?buyerId=${encodeURIComponent(user.uid)}`)
        ]);

        const sellingResult = await sellingResponse.json();
        const buyingResult = await buyingResponse.json();

        if (!sellingResponse.ok || !buyingResponse.ok) {
          throw new Error('Failed to fetch transactions');
        }

        setTransactions({
          selling: sellingResult.transactions,
          buying: buyingResult.transactions
        });
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
      case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case 'paid': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-900/30 text-[#00ff88] border-[#00ff88]/30';
      case 'disputed': return 'bg-red-900/30 text-red-400 border-red-500/30';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00ff88] glow-green"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-[#00ff88] rounded-full animate-pulse opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentTransactions = activeTab === 'selling'
    ? (transactions.selling || [])
    : (transactions.buying || []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#00ff88] rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00ff88] rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/50 backdrop-blur-xl border-b border-[#00ff88]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-green rounded-lg flex items-center justify-center glow-green">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white text-glow-green">Dashboard</h1>
                <span className="text-xs text-[#00ff88]">Manage Your Transactions</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Welcome, <span className="text-[#00ff88]">{user.displayName}</span></span>
              <Link
                href="/upload"
                className="btn-green px-6 py-2.5 rounded-lg font-semibold"
              >
                Create Escrow
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b border-[#00ff88]/20">
            <button
              onClick={() => setActiveTab('selling')}
              className={`px-6 py-3 font-semibold transition-all duration-300 ${
                activeTab === 'selling'
                  ? 'text-[#00ff88] border-b-2 border-[#00ff88] glow-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Selling ({transactions.selling?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('buying')}
              className={`px-6 py-3 font-semibold transition-all duration-300 ${
                activeTab === 'buying'
                  ? 'text-[#00ff88] border-b-2 border-[#00ff88] glow-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Buying ({transactions.buying?.length || 0})
            </button>
          </div>
        </div>

        {/* Transactions Grid */}
        {currentTransactions.length === 0 ? (
          <div className="card-dark p-12 rounded-2xl text-center">
            <div className="w-24 h-24 bg-[#00ff88]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No transactions yet</h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'selling'
                ? 'Create your first escrow transaction to get started'
                : 'You haven\'t purchased any products yet'}
            </p>
            {activeTab === 'selling' && (
              <Link
                href="/upload"
                className="inline-block btn-green px-8 py-3 rounded-lg font-semibold"
              >
                Create New Escrow
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {currentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="card-dark p-6 rounded-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{transaction.productName}</h3>
                    <p className="text-gray-400 text-sm">{transaction.description}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border ${getStatusColor(transaction.status)}`}>
                    <span className="text-sm font-semibold uppercase">{transaction.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#00ff88]/10">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Amount</div>
                    <div className="text-[#00ff88] font-bold text-lg">${transaction.amount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Created</div>
                    <div className="text-white font-semibold">{formatDate(transaction.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Transaction ID</div>
                    <div className="text-gray-400 font-mono text-sm">{transaction.id.slice(0, 8)}...</div>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href={`/escrow/${transaction.id}`}
                      className="btn-outline-green px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
