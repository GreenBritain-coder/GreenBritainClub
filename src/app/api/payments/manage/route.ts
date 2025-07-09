import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

// Helper function to verify admin JWT token
const verifyAdminToken = (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization header');
  }
  
  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  
  try {
    const decoded = jwt.verify(token, secret) as any;
    if (decoded.role !== 'admin') {
      throw new Error('Admin access required');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// GET all payments (admin only)
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    verifyAdminToken(authHeader);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    
    // Build filter
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    // Get payments with pagination
    const payments = await db.collection('payments')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const totalCount = await db.collection('payments').countDocuments(filter);

    // Get summary statistics
    const stats = await db.collection('payments').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]).toArray();

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      stats
    });
    
  } catch (error) {
    console.error('Payment management error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { message: errorMessage },
      { status: errorMessage.includes('Admin') || errorMessage.includes('token') ? 401 : 500 }
    );
  }
}

// POST - Manually verify a payment (admin only)
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    verifyAdminToken(authHeader);

    const body = await request.json();
    const { paymentId, action, transactionHash, notes } = body;

    if (!paymentId || !ObjectId.isValid(paymentId)) {
      return NextResponse.json(
        { message: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    if (!['verify', 'cancel', 'reset'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action. Must be verify, cancel, or reset' },
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

    let updateData: any = {
      updatedAt: new Date(),
      lastModifiedBy: 'admin'
    };

    if (notes) {
      updateData.adminNotes = notes;
    }

    switch (action) {
      case 'verify':
        updateData.status = 'completed';
        updateData.completedAt = new Date();
        updateData.confirmations = payment.requiredConfirmations;
        updateData.manuallyVerified = true;
        if (transactionHash) {
          updateData.transactionHash = transactionHash;
        }
        break;
        
      case 'cancel':
        updateData.status = 'cancelled';
        updateData.cancelledAt = new Date();
        break;
        
      case 'reset':
        updateData.status = 'pending';
        updateData.confirmations = 0;
        updateData.transactionHash = null;
        updateData.completedAt = null;
        updateData.cancelledAt = null;
        updateData.manuallyVerified = false;
        break;
    }

    await db.collection('payments').updateOne(
      { _id: new ObjectId(paymentId) },
      { $set: updateData }
    );

    // If verified, trigger user account creation
    if (action === 'verify') {
      try {
        // Trigger the same user creation logic as automatic verification
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payments/crypto/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId: paymentId,
            confirmations: payment.requiredConfirmations
          })
        });
      } catch (error) {
        console.error('Error creating user after manual verification:', error);
        // Don't fail the payment verification if user creation fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${action}d successfully`,
      paymentId,
      newStatus: updateData.status
    });
    
  } catch (error) {
    console.error('Payment management error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { message: errorMessage },
      { status: errorMessage.includes('Admin') || errorMessage.includes('token') ? 401 : 500 }
    );
  }
} 