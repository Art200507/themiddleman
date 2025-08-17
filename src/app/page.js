'use client';

import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { useState } from 'react';
import SupportChat from '@/components/SupportChat';

export default function Home() {
  const { user, login, logout, loading } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

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
              {user ? (
                <>
                  <span className="text-sm text-gray-700">Welcome, {user.displayName}</span>
                  <Link 
                    href="/upload" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Escrow
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    AI Support
                  </button>
                  <button 
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={login}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Secure Digital Product Escrow
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sell digital products with complete security. Your buyer pays, you get the money after 24 hours. 
            No trust issues, no scams - just secure transactions.
          </p>

          {user ? (
            <div className="space-y-4">
              <Link 
                href="/upload"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Create New Escrow Transaction
              </Link>
              <p className="text-sm text-gray-500">
                Upload your digital product and get a secure link to share with your buyer
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={login}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started - Sign In
              </button>
              <p className="text-sm text-gray-500">
                Sign in to create secure escrow transactions
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Escrow</h3>
            <p className="text-gray-600">Payment held securely for 24 hours. No trust issues between buyer and seller.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Delivery</h3>
            <p className="text-gray-600">Buyer gets immediate access to the digital product after payment.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Protection</h3>
            <p className="text-gray-600">Advanced AI detects fraud and provides 24/7 support for disputes.</p>
          </div>
        </div>
      </main>

      {/* AI Support Chat */}
      <SupportChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
