'use client';

import { useState } from 'react';

export default function FraudDetection({ transaction, onAnalysisComplete }) {
  const [analysis, setAnalysis] = useState(transaction.fraudAnalysis || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runFraudDetection = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/fraud-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transaction.transactionId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAnalysis(result.fraudAnalysis);
        if (onAnalysisComplete) {
          onAnalysisComplete(result.fraudAnalysis);
        }
      } else {
        setError(result.error || 'Failed to analyze transaction');
      }
    } catch (error) {
      console.error('Fraud detection error:', error);
      setError('Failed to analyze transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'approve': return 'text-green-600 bg-green-100';
      case 'flag': return 'text-red-600 bg-red-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!analysis && !isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">AI Fraud Detection</h4>
            <p className="text-sm text-gray-600">Analyze this transaction for potential fraud</p>
          </div>
          <button
            onClick={runFraudDetection}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-700">AI is analyzing transaction for fraud...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-red-800">Analysis Failed</h4>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={runFraudDetection}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">AI Fraud Analysis</h4>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(analysis.risk_level)}`}>
            Risk: {analysis.risk_level.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(analysis.recommendation)}`}>
            {analysis.recommendation.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="font-medium text-gray-700 mb-1">Confidence Score</h5>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysis.confidence * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(analysis.confidence * 100)}% confidence in this analysis
          </p>
        </div>

        {analysis.fraud_indicators && analysis.fraud_indicators.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-700 mb-1">Fraud Indicators</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              {analysis.fraud_indicators.map((indicator, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h5 className="font-medium text-gray-700 mb-1">AI Reasoning</h5>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {analysis.reasoning}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="font-medium text-blue-800 mb-1">Recommendation</h5>
          <p className="text-sm text-blue-700">
            Based on the analysis, this transaction is recommended for <strong>{analysis.recommendation}</strong>.
            {analysis.recommendation === 'flag' && ' Please review carefully before proceeding.'}
            {analysis.recommendation === 'review' && ' Additional verification may be required.'}
            {analysis.recommendation === 'approve' && ' This transaction appears safe to proceed.'}
          </p>
        </div>
      </div>
    </div>
  );
} 