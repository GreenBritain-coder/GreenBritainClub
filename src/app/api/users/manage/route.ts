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

// GET all users with subscription and payment information (admin only)
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    verifyAdminToken(authHeader);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tier = searchParams.get('tier');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    
    // Build filter
    const filter: any = {};
    if (status) {
      filter['subscription.status'] = status;
    }
    if (tier) {
      filter['subscription.tier'] = tier;
    }

    // Aggregate users with their payment information
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'payments',
          localField: 'email',
          foreignField: 'email',
          as: 'payments'
        }
      },
      {
        $addFields: {
          latestPayment: {
            $arrayElemAt: [
              {
                $sortArray: { 
                  input: '$payments', 
                  sortBy: { createdAt: -1 } 
                }
              }, 0
            ]
          },
          totalPayments: { $size: '$payments' },
          completedPayments: {
            $size: {
              $filter: {
                input: '$payments',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          password: 0, // Don't return password hash
          tempPassword: 0 // Don't return temp password
        }
      }
    ];

    const users = await db.collection('users').aggregate(pipeline).toArray();

    // Get total count
    const totalCount = await db.collection('users').countDocuments(filter);

    // Get summary statistics
    const statsAggregate = await db.collection('users').aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          sapphireUsers: {
            $sum: {
              $cond: [{ $eq: ['$subscription.tier', 'sapphire'] }, 1, 0]
            }
          },
          rubyUsers: {
            $sum: {
              $cond: [{ $eq: ['$subscription.tier', 'ruby'] }, 1, 0]
            }
          },
          diamondUsers: {
            $sum: {
              $cond: [{ $eq: ['$subscription.tier', 'diamond'] }, 1, 0]
            }
          },
          activeSubscriptions: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'active'] }, 1, 0]
            }
          },
          expiredSubscriptions: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'expired'] }, 1, 0]
            }
          },
          cancelledSubscriptions: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'cancelled'] }, 1, 0]
            }
          }
        }
      }
    ]).toArray();

    const stats = statsAggregate[0] || {
      totalUsers: 0,
      sapphireUsers: 0,
      rubyUsers: 0,
      diamondUsers: 0,
      activeSubscriptions: 0,
      expiredSubscriptions: 0,
      cancelledSubscriptions: 0
    };

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      stats
    });
    
  } catch (error) {
    console.error('User management error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { message: errorMessage },
      { status: errorMessage.includes('Admin') || errorMessage.includes('token') ? 401 : 500 }
    );
  }
}

// PUT - Update user subscription (admin only)
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    verifyAdminToken(authHeader);

    const body = await request.json();
    const { userId, action, subscriptionData, notes } = body;

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    if (!['update_subscription', 'cancel_subscription', 'reactivate_subscription'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action. Must be update_subscription, cancel_subscription, or reactivate_subscription' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
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
      case 'update_subscription':
        if (!subscriptionData) {
          return NextResponse.json(
            { message: 'Subscription data required for update' },
            { status: 400 }
          );
        }
        updateData.subscription = {
          ...user.subscription,
          ...subscriptionData,
          updatedAt: new Date()
        };
        break;
        
      case 'cancel_subscription':
        updateData['subscription.status'] = 'cancelled';
        updateData['subscription.cancelledAt'] = new Date();
        break;
        
      case 'reactivate_subscription':
        updateData['subscription.status'] = 'active';
        updateData['subscription.reactivatedAt'] = new Date();
        // Remove cancelled date
        updateData.$unset = { 'subscription.cancelledAt': 1 };
        break;
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      updateData.$unset ? { $set: updateData, $unset: updateData.$unset } : { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User subscription ${action.replace('_', ' ')}d successfully`,
      userId
    });
    
  } catch (error) {
    console.error('User update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { message: errorMessage },
      { status: errorMessage.includes('Admin') || errorMessage.includes('token') ? 401 : 500 }
    );
  }
} 