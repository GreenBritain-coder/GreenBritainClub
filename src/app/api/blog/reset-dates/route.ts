import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all blog posts
    const posts = await db.collection('blogPosts').find({}).toArray();
    
    // Update dates for each post
    const updates = [
      { _id: '1', createdAt: '2025-01-05T12:00:00Z' },
      { _id: '2', createdAt: '2025-01-04T14:30:00Z' },
      { _id: '3', createdAt: '2025-01-03T09:15:00Z' },
      { _id: '4', createdAt: '2025-01-02T16:45:00Z' },
      { _id: '5', createdAt: '2025-01-01T11:20:00Z' },
      { _id: '6', createdAt: '2024-12-31T10:30:00Z' },
      { _id: '7', createdAt: '2024-12-30T15:45:00Z' }
    ];
    
    let updatedCount = 0;
    
    for (const update of updates) {
      // Try both string ID and ObjectId formats
      let result = await db.collection('blogPosts').updateOne(
        { _id: update._id },
        { $set: { createdAt: update.createdAt, updatedAt: new Date().toISOString() } }
      );
      
      if (result.matchedCount === 0) {
        // Try with ObjectId if string didn't work
        try {
          const { ObjectId } = require('mongodb');
          result = await db.collection('blogPosts').updateOne(
            { _id: new ObjectId(update._id) },
            { $set: { createdAt: update.createdAt, updatedAt: new Date().toISOString() } }
          );
        } catch (e) {
          // Ignore ObjectId errors for non-ObjectId posts
        }
      }
      
      if (result.matchedCount > 0) {
        updatedCount++;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} blog post dates`,
      updatedCount,
      totalPosts: posts.length
    });
    
  } catch (error) {
    console.error('Error resetting dates:', error);
    return NextResponse.json(
      { error: 'Failed to reset dates' },
      { status: 500 }
    );
  }
} 