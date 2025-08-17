'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function UploadProduct() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to create an escrow transaction.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    if (!title || !description || !price) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `products/${user.uid}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(snapshot.ref);

      // Generate unique transaction ID
      const uniqueId = `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create transaction in Firestore
      const transactionRef = await addDoc(collection(db, "transactions"), {
        transactionId: uniqueId,
        title,
        description,
        price: parseFloat(price),
        fileURL,
        fileName: file.name,
        sellerId: user.uid,
        sellerName: user.displayName,
        sellerEmail: user.email,
        status: 'pending', // pending, paid, completed, disputed
        createdAt: serverTimestamp(),
        paidAt: null,
        completedAt: null,
        buyerId: null,
        buyerName: null,
        buyerEmail: null,
        disputeRaisedAt: null,
        disputeReason: null
      });

      setTransactionId(uniqueId);
      setLoading(false);

      // Show success message with link
      alert(`Escrow transaction created successfully! Your transaction ID is: ${uniqueId}`);
      
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Error creating transaction. Please try again.");
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const escrowLink = `${window.location.origin}/escrow/${transactionId}`;
    navigator.clipboard.writeText(escrowLink);
    alert("Escrow link copied to clipboard!");
  };

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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Escrow Transaction</h1>
          
          {transactionId ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Transaction Created Successfully!</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID:</label>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{transactionId}</code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Escrow Link:</label>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                      {`${window.location.origin}/escrow/${transactionId}`}
                    </code>
                    <button 
                      onClick={copyToClipboard}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Share this link with your buyer. They can view the product details and make payment securely.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Complete Marketing eBook"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Describe your digital product in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="29.99"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Digital Product File *</label>
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  accept=".pdf,.doc,.docx,.txt,.epub,.mobi,.zip,.rar,.mp3,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, TXT, EPUB, ZIP, MP3, MP4, Images
                </p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Transaction...' : 'Create Escrow Transaction'}
              </button>
            </form>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Upload your digital product and set the price</li>
              <li>2. Get a secure escrow link to share with your buyer</li>
              <li>3. Buyer pays and gets immediate access to the file</li>
              <li>4. You receive payment after 24 hours (unless dispute is raised)</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
