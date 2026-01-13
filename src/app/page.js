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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#00ff88] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00ff88] rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#00ff88] rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
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
                <h1 className="text-2xl font-bold text-white text-glow-green">The MiddleMan</h1>
                <span className="text-xs text-[#00ff88]">Secure Digital Escrow</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-400">Welcome, <span className="text-[#00ff88]">{user.displayName}</span></span>
                  <Link
                    href="/upload"
                    className="btn-green px-6 py-2.5 rounded-lg font-semibold"
                  >
                    Create Escrow
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn-outline-green px-6 py-2.5 rounded-lg font-semibold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="bg-black text-[#00ff88] px-6 py-2.5 rounded-lg border border-[#00ff88] hover:bg-[#00ff88] hover:text-black transition-all duration-300 font-semibold"
                  >
                    AI Support
                  </button>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={login}
                  className="btn-green px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-block">
            <div className="inline-block px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full mb-6">
              <span className="text-[#00ff88] text-sm font-semibold">24/7 AI-Powered Protection</span>
            </div>
          </div>

          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-glow-green">Secure Digital</span>
            <br />
            <span className="text-white">Product Escrow</span>
          </h2>

          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Sell digital products with complete security. Your buyer pays, you get the money after 24 hours.
            <br />
            <span className="text-[#00ff88]">No trust issues, no scams</span> - just secure transactions.
          </p>

          {user ? (
            <div className="space-y-6 animate-float">
              <Link
                href="/upload"
                className="inline-block btn-green px-12 py-5 rounded-xl text-xl font-bold shadow-2xl"
              >
                Create New Escrow Transaction
              </Link>
              <p className="text-sm text-gray-500">
                Upload your digital product and get a secure link to share with your buyer
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-float">
              <button
                onClick={login}
                className="inline-block btn-green px-12 py-5 rounded-xl text-xl font-bold shadow-2xl"
              >
                Get Started - Sign In
              </button>
              <p className="text-sm text-gray-500">
                Sign in to create secure escrow transactions
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="card-dark p-6 rounded-xl">
              <div className="text-4xl font-bold text-[#00ff88] mb-2 text-glow-green">24h</div>
              <div className="text-gray-400 text-sm">Escrow Protection</div>
            </div>
            <div className="card-dark p-6 rounded-xl">
              <div className="text-4xl font-bold text-[#00ff88] mb-2 text-glow-green">100%</div>
              <div className="text-gray-400 text-sm">Secure Transactions</div>
            </div>
            <div className="card-dark p-6 rounded-xl">
              <div className="text-4xl font-bold text-[#00ff88] mb-2 text-glow-green">AI</div>
              <div className="text-gray-400 text-sm">Fraud Detection</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="card-dark p-8 rounded-2xl group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-green rounded-xl flex items-center justify-center mb-6 glow-green group-hover:glow-green-intense transition-all duration-300">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Secure Escrow</h3>
            <p className="text-gray-400 leading-relaxed">Payment held securely for 24 hours. No trust issues between buyer and seller.</p>
          </div>

          <div className="card-dark p-8 rounded-2xl group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-green rounded-xl flex items-center justify-center mb-6 glow-green group-hover:glow-green-intense transition-all duration-300">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Instant Delivery</h3>
            <p className="text-gray-400 leading-relaxed">Buyer gets immediate access to the digital product after payment.</p>
          </div>

          <div className="card-dark p-8 rounded-2xl group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-green rounded-xl flex items-center justify-center mb-6 glow-green group-hover:glow-green-intense transition-all duration-300">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">AI Protection</h3>
            <p className="text-gray-400 leading-relaxed">Advanced AI detects fraud and provides 24/7 support for disputes.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-32">
          <h3 className="text-4xl font-bold text-center text-white mb-16">
            How It <span className="text-[#00ff88] text-glow-green">Works</span>
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Create Escrow", desc: "Upload your digital product" },
              { step: "02", title: "Share Link", desc: "Send secure link to buyer" },
              { step: "03", title: "Buyer Pays", desc: "Payment held in escrow" },
              { step: "04", title: "Get Paid", desc: "Funds released after 24h" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="card-dark p-6 rounded-xl text-center">
                  <div className="text-5xl font-bold text-[#00ff88] opacity-20 mb-4">{item.step}</div>
                  <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <svg className="w-6 h-6 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Support Chat */}
      <SupportChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
