'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Membership() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    {
      id: 'sapphire',
      name: 'Sapphire',
      price: 'Free',
      color: 'blue',
      features: [
        'Access to basic blog content',
        'Monthly newsletter',
        'Community forum access',
        'Limited discounts on products'
      ]
    },
    {
      id: 'ruby',
      name: 'Ruby',
      price: '£10/month',
      color: 'red',
      features: [
        'All Sapphire benefits',
        'Exclusive content access',
        'Priority customer support',
        '10% discount on all products',
        'Monthly cannabis samples'
      ]
    },
    {
      id: 'diamond',
      name: 'Diamond',
      price: '£15.99/month',
      color: 'purple',
      features: [
        'All Ruby benefits',
        'VIP event invitations',
        'Early access to new products',
        '20% discount on all products',
        'Premium cannabis samples monthly',
        'Personal cannabis consultant'
      ]
    }
  ];

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-400',
          text: 'text-blue-400',
          hover: 'hover:border-blue-300',
          selected: 'ring-blue-500'
        };
      case 'red':
        return {
          bg: 'bg-red-500',
          border: 'border-red-400',
          text: 'text-red-400',
          hover: 'hover:border-red-300',
          selected: 'ring-red-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          border: 'border-purple-400',
          text: 'text-purple-400',
          hover: 'hover:border-purple-300',
          selected: 'ring-purple-500'
        };
      default:
        return {
          bg: 'bg-green-500',
          border: 'border-green-400',
          text: 'text-green-400',
          hover: 'hover:border-green-300',
          selected: 'ring-green-500'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-green-400/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">GB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GreenBritain.Club</h1>
                <p className="text-green-300 text-sm">Premium Cannabis Community</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/blog" 
                className="text-white hover:text-green-400 font-medium transition-colors"
              >
                Blog
              </Link>
              <Link 
                href="/" 
                className="text-white hover:text-green-400 font-medium transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join the <span className="text-green-400">GreenBritain.Club</span> Membership
            </h1>
            <p className="text-xl text-green-200">
              Choose the perfect membership tier to enhance your cannabis experience
            </p>
          </div>

          {/* Membership Tiers */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {tiers.map((tier) => {
              const colorClasses = getColorClasses(tier.color);
              const isSelected = selectedTier === tier.id;
              
              return (
                <div 
                  key={tier.id}
                  className={`bg-black/30 backdrop-blur-sm rounded-lg p-6 border ${colorClasses.border}/30 
                    ${isSelected ? `ring-2 ${colorClasses.selected}` : ''} 
                    hover:border-opacity-50 transition-all cursor-pointer`}
                  onClick={() => handleTierSelect(tier.id)}
                >
                  <div className={`w-16 h-16 ${colorClasses.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white font-bold text-xl">
                      {tier.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold ${colorClasses.text} text-center mb-2`}>
                    {tier.name}
                  </h3>
                  <p className="text-white text-xl font-bold text-center mb-6">
                    {tier.price}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className={`w-5 h-5 ${colorClasses.text} mr-2 mt-0.5 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center">
                    <button
                      className={`${colorClasses.bg} hover:bg-opacity-90 text-white px-6 py-2 rounded-full font-semibold transition-colors w-full`}
                      onClick={() => handleTierSelect(tier.id)}
                    >
                      {isSelected ? 'Selected' : 'Select Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Registration Form */}
          {selectedTier && (
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-green-400/30">
              <h2 className="text-2xl font-bold text-white mb-6">
                Complete Your Registration
              </h2>
              <RegistrationForm selectedTier={selectedTier} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-green-400/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-green-300 text-sm">
                &copy; {new Date().getFullYear()} GreenBritain.Club. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="text-green-300 hover:text-green-400 transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-green-300 hover:text-green-400 transition-colors">
                Blog
              </Link>
              <Link href="/membership" className="text-green-300 hover:text-green-400 transition-colors">
                Membership
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RegistrationForm({ selectedTier }: { selectedTier: string }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit registration data
      const response = await fetch('/api/membership/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tier: selectedTier
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration successful
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
        <p className="text-green-300 mb-6">
          Thank you for joining GreenBritain.Club. Check your email for confirmation.
        </p>
        <Link 
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-white mb-2 font-medium" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-black/30 border border-green-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2 font-medium" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-black/30 border border-green-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-white mb-2 font-medium" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-black/30 border border-green-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-white mb-2 font-medium" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-black/30 border border-green-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            minLength={8}
          />
        </div>
        <div>
          <label className="block text-white mb-2 font-medium" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-black/30 border border-green-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="mt-1 mr-3"
            required
          />
          <label className="text-white/80" htmlFor="agreeTerms">
            I agree to the <a href="#" className="text-green-400 hover:underline">Terms and Conditions</a> and <a href="#" className="text-green-400 hover:underline">Privacy Policy</a>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </form>
  );
} 