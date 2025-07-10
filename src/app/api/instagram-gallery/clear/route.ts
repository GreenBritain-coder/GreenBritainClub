import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';

// DELETE - Clear all gallery items (admin only - for removing mock data)
export async function DELETE() {
  try {
    const { db } = await connectToDatabase();
    
    // Delete all gallery items
    const result = await db.collection('instagramGallery').deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${result.deletedCount} gallery items`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('Error clearing gallery:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
} 