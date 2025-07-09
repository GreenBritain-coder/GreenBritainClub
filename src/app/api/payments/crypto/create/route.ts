import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

// Supported cryptocurrencies with their networks
const SUPPORTED_CRYPTO = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'mainnet',
    confirmations: 1
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH', 
    network: 'mainnet',
    confirmations: 12
  },
  litecoin: {
    name: 'Litecoin',
    symbol: 'LTC',
    network: 'mainnet',
    confirmations: 6
  },
  usdt: {
    name: 'Tether USDT',
    symbol: 'USDT',
    network: 'ethereum',
    confirmations: 12
  }
};

// Mock payment addresses - in production, integrate with actual crypto payment service
const generatePaymentAddress = (crypto: string): string => {
  const addresses = {
    bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    ethereum: '0x742d35Cc6639C0532fEf5062356F8F4Ec3CF8Fac',
    litecoin: 'LRy6g8hGG2JcJh8RJG8fGjJkKGGJy8K8tL',
    usdt: '0x742d35Cc6639C0532fEf5062356F8F4Ec3CF8Fac'
  };
  
  // In production, generate unique addresses for each payment
  return addresses[crypto as keyof typeof addresses] || addresses.bitcoin;
};

// Calculate crypto amounts based on tier prices
const calculateCryptoAmount = (tier: string, crypto: string): number => {
  const tierPrices = {
    sapphire: 0,
    ruby: 10,
    diamond: 15.99
  };
  
  const basePrice = tierPrices[tier as keyof typeof tierPrices] || 0;
  
  if (basePrice === 0) return 0;
  
  // Mock exchange rates - in production, fetch from real API
  const exchangeRates = {
    bitcoin: 65000,  // 1 BTC = $65,000
    ethereum: 3200,  // 1 ETH = $3,200
    litecoin: 80,    // 1 LTC = $80
    usdt: 1          // 1 USDT = $1
  };
  
  const rate = exchangeRates[crypto as keyof typeof exchangeRates] || 1;
  return parseFloat((basePrice / rate).toFixed(8));
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, tier, cryptocurrency, email, firstName, lastName } = body;

    // Validate required fields
    if (!tier || !cryptocurrency || !email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate cryptocurrency
    if (!SUPPORTED_CRYPTO[cryptocurrency as keyof typeof SUPPORTED_CRYPTO]) {
      return NextResponse.json(
        { message: 'Unsupported cryptocurrency' },
        { status: 400 }
      );
    }

    // Free tier doesn't require payment
    if (tier === 'sapphire') {
      return NextResponse.json(
        { message: 'Sapphire tier is free - no payment required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Generate payment details
    const cryptoAmount = calculateCryptoAmount(tier, cryptocurrency);
    const paymentAddress = generatePaymentAddress(cryptocurrency);
    const cryptoInfo = SUPPORTED_CRYPTO[cryptocurrency as keyof typeof SUPPORTED_CRYPTO];
    
    // Create payment record
    const payment = {
      userId: userId || null,
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      tier,
      cryptocurrency,
      cryptoSymbol: cryptoInfo.symbol,
      cryptoNetwork: cryptoInfo.network,
      amount: cryptoAmount,
      paymentAddress,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      confirmations: 0,
      requiredConfirmations: cryptoInfo.confirmations,
      transactionHash: null,
      completedAt: null
    };

    const result = await db.collection('payments').insertOne(payment);

    return NextResponse.json({
      success: true,
      paymentId: result.insertedId,
      paymentDetails: {
        cryptocurrency: cryptoInfo.name,
        symbol: cryptoInfo.symbol,
        network: cryptoInfo.network,
        amount: cryptoAmount,
        paymentAddress,
        qrCodeData: `${cryptocurrency}:${paymentAddress}?amount=${cryptoAmount}`,
        expiresAt: payment.expiresAt,
        requiredConfirmations: cryptoInfo.confirmations
      }
    });
    
  } catch (error) {
    console.error('Payment creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Contact support'
      },
      { status: 500 }
    );
  }
} 