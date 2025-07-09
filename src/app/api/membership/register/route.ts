import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { hash } from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, tier } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !tier) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Determine subscription details based on tier
    let subscriptionDetails = {
      tier,
      price: 0,
      startDate: new Date(),
      status: 'active'
    };
    
    switch (tier) {
      case 'ruby':
        subscriptionDetails.price = 10;
        break;
      case 'diamond':
        subscriptionDetails.price = 15.99;
        break;
      default: // sapphire
        subscriptionDetails.price = 0;
    }

    // Create user document
    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      subscription: subscriptionDetails,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user into database
    const result = await db.collection('users').insertOne(user);

    // Return success response
    return NextResponse.json(
      { 
        message: 'Registration successful',
        userId: result.insertedId,
        tier
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 