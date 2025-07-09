import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hash } from 'bcrypt';
import { sendMembershipConfirmation } from '@/app/lib/email';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');

    if (!paymentId || !ObjectId.isValid(paymentId)) {
      return NextResponse.json(
        { message: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const payment = await db.collection('payments').findOne({
      _id: new ObjectId(paymentId)
    });

    if (!payment) {
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }

    // Check if payment has expired
    const now = new Date();
    const expired = now > payment.expiresAt;

    return NextResponse.json({
      paymentId: payment._id,
      status: expired && payment.status === 'pending' ? 'expired' : payment.status,
      tier: payment.tier,
      cryptocurrency: payment.cryptocurrency,
      cryptoSymbol: payment.cryptoSymbol,
      amount: payment.amount,
      paymentAddress: payment.paymentAddress,
      confirmations: payment.confirmations,
      requiredConfirmations: payment.requiredConfirmations,
      transactionHash: payment.transactionHash,
      createdAt: payment.createdAt,
      expiresAt: payment.expiresAt,
      completedAt: payment.completedAt,
      expired
    });
    
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock payment verification - in production, integrate with blockchain APIs
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, transactionHash, confirmations } = body;

    if (!paymentId || !ObjectId.isValid(paymentId)) {
      return NextResponse.json(
        { message: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const payment = await db.collection('payments').findOne({
      _id: new ObjectId(paymentId)
    });

    if (!payment) {
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'completed') {
      return NextResponse.json({
        message: 'Payment already completed',
        status: 'completed'
      });
    }

    // Update payment with transaction details
    const updateData: any = {
      updatedAt: new Date()
    };

    if (transactionHash) {
      updateData.transactionHash = transactionHash;
    }

    if (typeof confirmations === 'number') {
      updateData.confirmations = confirmations;
      
      // Check if payment is confirmed
      if (confirmations >= payment.requiredConfirmations) {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
      } else {
        updateData.status = 'confirming';
      }
    }

    await db.collection('payments').updateOne(
      { _id: new ObjectId(paymentId) },
      { $set: updateData }
    );

    // If payment completed, create user account
    if (updateData.status === 'completed') {
      await createUserFromPayment(db, payment);
    }

    return NextResponse.json({
      success: true,
      status: updateData.status || payment.status,
      confirmations: updateData.confirmations || payment.confirmations,
      message: updateData.status === 'completed' ? 'Payment completed and account created!' : 'Payment status updated'
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to create user account after successful payment
async function createUserFromPayment(db: any, payment: any) {
  try {
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      email: payment.email 
    });
    
    if (existingUser) {
      // Update existing user's subscription
      await db.collection('users').updateOne(
        { email: payment.email },
        {
          $set: {
            subscription: {
              tier: payment.tier,
              price: payment.tier === 'ruby' ? 10 : 15.99,
              status: 'active',
              paymentMethod: 'cryptocurrency',
              startDate: new Date(),
              paidWithCrypto: {
                cryptocurrency: payment.cryptocurrency,
                amount: payment.amount,
                transactionHash: payment.transactionHash
              }
            },
            updatedAt: new Date()
          }
        }
      );
    } else {
      // Create new user account with temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hash(tempPassword, 10);
      
      const user = {
        firstName: payment.firstName,
        lastName: payment.lastName,
        email: payment.email,
        password: hashedPassword,
        subscription: {
          tier: payment.tier,
          price: payment.tier === 'ruby' ? 10 : 15.99,
          status: 'active',
          paymentMethod: 'cryptocurrency',
          startDate: new Date(),
          paidWithCrypto: {
            cryptocurrency: payment.cryptocurrency,
            amount: payment.amount,
            transactionHash: payment.transactionHash
          }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        needsPasswordReset: true,
        tempPassword
      };

      await db.collection('users').insertOne(user);
      
      // Send welcome email with account details
      try {
        await sendMembershipConfirmation(
          payment.email,
          payment.firstName,
          payment.lastName,
          payment.tier,
          {
            tempPassword,
            paymentMethod: 'cryptocurrency',
            cryptoDetails: {
              currency: payment.cryptocurrency,
              amount: payment.amount,
              transactionHash: payment.transactionHash
            }
          }
        );
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }
  } catch (error) {
    console.error('Error creating user from payment:', error);
    throw error;
  }
} 