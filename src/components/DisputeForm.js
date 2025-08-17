'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function DisputeForm({ transaction, onDisputeRaised, onCancel }) {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason || !description) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/raise-dispute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transaction.transactionId,
          reason,
          description,
          buyerId: user.uid,
          buyerName: user.displayName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Dispute raised successfully. Our team will review your case.');
        onDisputeRaised();
      } else {
        alert(result.error || 'Failed to raise dispute');
      }
    } catch (error) {
      console.error('Error raising dispute:', error);
      alert('Failed to raise dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Raise Dispute</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Dispute *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a reason</option>
            <option value="file_not_received">File not received or corrupted</option>
            <option value="wrong_file">Wrong file received</option>
            <option value="poor_quality">Poor quality or incomplete content</option>
            <option value="misleading_description">Misleading product description</option>
            <option value="fraud">Suspected fraud or scam</option>
            <option value="other">Other reason</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please provide detailed information about your dispute..."
            required
          />
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ Important Information:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Disputes can only be raised within 24 hours of payment</li>
            <li>• Our team will review your case within 48 hours</li>
            <li>• You may be required to provide additional evidence</li>
            <li>• False disputes may result in account suspension</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Raising Dispute...' : 'Raise Dispute'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 