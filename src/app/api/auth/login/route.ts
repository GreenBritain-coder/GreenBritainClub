import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for admin credentials first
    if (email === 'admin@greenbritain.club' && password === 'greenbritain2024') {
      const adminToken = jwt.sign(
        { 
          email: 'admin@greenbritain.club', 
          role: 'admin',
          userId: 'admin'
        },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      return NextResponse.json({
        success: true,
        token: adminToken,
        user: {
          email: 'admin@greenbritain.club',
          role: 'admin',
          name: 'Admin User'
        }
      });
    }

    // Connect to database for regular users
    const { db } = await connectToDatabase();
    
    // Find user by email
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: user.email, 
        role: 'user',
        userId: user._id.toString(),
        tier: user.subscription?.tier || 'sapphire'
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    // Update last login
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: user.email,
        role: 'user',
        name: `${user.firstName} ${user.lastName}`,
        tier: user.subscription?.tier || 'sapphire',
        subscription: user.subscription
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
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