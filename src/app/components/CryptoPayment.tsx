'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface CryptoPaymentProps {
  tier: string;
  email: string;
  firstName: string;
  lastName: string;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

interface PaymentDetails {
  paymentId: string;
  cryptocurrency: string;
  symbol: string;
  network: string;
  amount: number;
  paymentAddress: string;
  qrCodeData: string;
  expiresAt: string;
  requiredConfirmations: number;
}

interface PaymentStatus {
  status: 'pending' | 'confirming' | 'completed' | 'expired';
  confirmations: number;
  requiredConfirmations: number;
  transactionHash?: string;
}

const SUPPORTED_CRYPTOCURRENCIES = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    color: '#f7931a'
  },
  {
    id: 'ethereum',
    name: 'Ethereum', 
    symbol: 'ETH',
    icon: 'Ξ',
    color: '#627eea'
  },
  {
    id: 'litecoin',
    name: 'Litecoin',
    symbol: 'LTC',
    icon: 'Ł',
    color: '#bfbbbb'
  },
  {
    id: 'usdt',
    name: 'Tether USDT',
    symbol: 'USDT',
    icon: '₮',
    color: '#26a17b'
  }
];

export default function CryptoPayment({ 
  tier, 
  email, 
  firstName, 
  lastName, 
  onPaymentComplete, 
  onCancel 
}: CryptoPaymentProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Poll payment status every 30 seconds
  useEffect(() => {
    if (!paymentDetails) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/payments/crypto/status?id=${paymentDetails.paymentId}`);
        
        if (!response.ok) {
          console.error('Failed to fetch payment status:', response.status, response.statusText);
          return;
        }

        const data = await response.json();
        
        setPaymentStatus({
          status: data.status,
          confirmations: data.confirmations,
          requiredConfirmations: data.requiredConfirmations,
          transactionHash: data.transactionHash
        });

        if (data.status === 'completed') {
          setTimeout(() => {
            onPaymentComplete();
          }, 2000);
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
        // Don't show error to user for background polling failures
        // The user can manually refresh if needed
      }
    };

    pollStatus(); // Initial check
    const interval = setInterval(pollStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [paymentDetails, onPaymentComplete]);

  // Manual refresh function for the refresh button
  const refreshPaymentStatus = async () => {
    if (!paymentDetails) return;

    setRefreshing(true);
    setError('');

    try {
      const response = await fetch(`/api/payments/crypto/status?id=${paymentDetails.paymentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment status');
      }

      const data = await response.json();
      
      setPaymentStatus({
        status: data.status,
        confirmations: data.confirmations,
        requiredConfirmations: data.requiredConfirmations,
        transactionHash: data.transactionHash
      });

      if (data.status === 'completed') {
        setTimeout(() => {
          onPaymentComplete();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to refresh payment status');
    } finally {
      setRefreshing(false);
    }
  };

  const createPayment = async () => {
    if (!selectedCrypto) {
      setError('Please select a cryptocurrency');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/crypto/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          cryptocurrency: selectedCrypto,
          email,
          firstName,
          lastName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment');
      }

      setPaymentDetails({
        paymentId: data.paymentId,
        ...data.paymentDetails
      });

      setPaymentStatus({
        status: 'pending',
        confirmations: 0,
        requiredConfirmations: data.paymentDetails.requiredConfirmations
      });

    } catch (err: any) {
      setError(err.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'confirming': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'expired': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirming': return '🔄';
      case 'completed': return '✅';
      case 'expired': return '❌';
      default: return '❓';
    }
  };

  if (paymentDetails && paymentStatus) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {paymentStatus.status === 'completed' ? 'Payment Completed!' : 'Payment Pending'}
          </h3>
          <div className={`text-lg ${getStatusColor(paymentStatus.status)}`}>
            {getStatusIcon(paymentStatus.status)} {paymentStatus.status.charAt(0).toUpperCase() + paymentStatus.status.slice(1)}
          </div>
        </div>

        {paymentStatus.status === 'completed' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-300 mb-4">
              Your payment has been confirmed! Your account is being created and you'll receive a confirmation email shortly.
            </p>
            {paymentStatus.transactionHash && (
              <p className="text-green-400 text-sm">
                Transaction: <code className="bg-black/50 px-2 py-1 rounded">{paymentStatus.transactionHash}</code>
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-black/50 rounded-lg p-4 mb-6">
              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  value={paymentDetails.qrCodeData}
                  size={200}
                  bgColor="#000000"
                  fgColor="#ffffff"
                  level="M"
                />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-white font-semibold">
                  Send {paymentDetails.amount} {paymentDetails.symbol}
                </p>
                <p className="text-green-300 text-sm">to the address below:</p>
                
                <div className="bg-black/50 rounded p-3 break-all">
                  <p className="text-white text-sm font-mono">{paymentDetails.paymentAddress}</p>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.paymentAddress)}
                    className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-green-300">Amount:</span>
                <span className="text-white">{paymentDetails.amount} {paymentDetails.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Network:</span>
                <span className="text-white">{paymentDetails.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Confirmations:</span>
                <span className="text-white">
                  {paymentStatus.confirmations} / {paymentStatus.requiredConfirmations}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Expires:</span>
                <span className="text-white">
                  {new Date(paymentDetails.expiresAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⚠️ Send only {paymentDetails.symbol} to this address. Sending other cryptocurrencies will result in permanent loss.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={paymentStatus.status === 'completed'}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            {paymentStatus.status === 'completed' ? 'Redirecting...' : 'Cancel'}
          </button>
          {paymentStatus.status !== 'completed' && (
            <button
              onClick={refreshPaymentStatus}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Status
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        Pay with Cryptocurrency
      </h3>
      
      <p className="text-green-300 mb-6 text-center">
        Complete your {tier} membership payment using cryptocurrency
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <label className="block text-white font-medium">Select Cryptocurrency:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUPPORTED_CRYPTOCURRENCIES.map((crypto) => (
            <button
              key={crypto.id}
              onClick={() => setSelectedCrypto(crypto.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCrypto === crypto.id
                  ? 'border-green-400 bg-green-400/20'
                  : 'border-green-400/30 bg-black/30 hover:border-green-400/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span 
                  className="text-2xl"
                  style={{ color: crypto.color }}
                >
                  {crypto.icon}
                </span>
                <div className="text-left">
                  <div className="text-white font-medium">{crypto.name}</div>
                  <div className="text-green-300 text-sm">{crypto.symbol}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={createPayment}
          disabled={!selectedCrypto || loading}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Creating Payment...' : 'Continue'}
        </button>
      </div>
    </div>
  );
} 