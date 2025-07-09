import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
function verifyToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
  return decoded;
}

// GET - Get user profile
export async function GET(request: Request) {
  try {
    const decoded = verifyToken(request);
    
    if (decoded.role === 'admin') {
      return NextResponse.json({
        email: 'admin@greenbritain.club',
        role: 'admin',
        name: 'Admin User'
      });
    }

    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password
    );
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: 'user',
      subscription: user.subscription,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: Request) {
  try {
    const decoded = verifyToken(request);
    
    if (decoded.role === 'admin') {
      return NextResponse.json(
        { message: 'Admin profile cannot be updated via this endpoint' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { firstName, lastName } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: 'First name and last name are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { 
        $set: { 
          firstName,
          lastName,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
} 