import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI value:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'NOT SET');
    
    const { db } = await connectToDatabase();
    console.log('MongoDB connection successful');
    
    // Test a simple database operation
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map((c: any) => c.name));
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      environment: process.env.NODE_ENV,
      mongoUriExists: !!process.env.MONGODB_URI,
      collections: collections.map((c: any) => c.name)
    });
    
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : 'Error'
    });
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      environment: process.env.NODE_ENV,
      mongoUriExists: !!process.env.MONGODB_URI,
      mongoUriValue: process.env.MONGODB_URI ? 'Set (hidden)' : 'NOT SET'
    }, { status: 500 });
  }
} 