import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';



// GET - Fetch gallery items for frontend display
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Fetch active gallery items, sorted by sortOrder
    const items = await db.collection('instagramGallery')
      .find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .toArray();
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching Instagram gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST - Create new gallery item (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, caption, likes, type = 'image', sortOrder } = body;

    // Basic validation
    if (!imageUrl) {
      return NextResponse.json(
        { message: 'Image URL is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // If no sortOrder provided, get the next available order
    let finalSortOrder = sortOrder;
    if (!finalSortOrder) {
      const lastItem = await db.collection('instagramGallery')
        .findOne({}, { sort: { sortOrder: -1 } });
      finalSortOrder = lastItem ? lastItem.sortOrder + 1 : 1;
    }

    // Create gallery item document
    const galleryItem = {
      imageUrl,
      caption: caption || '',
      likes: likes || 0,
      type,
      isActive: true,
      sortOrder: finalSortOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert gallery item into database
    const result = await db.collection('instagramGallery').insertOne(galleryItem);

    return NextResponse.json(
      { 
        message: 'Gallery item created successfully',
        itemId: result.insertedId
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Gallery item creation error:', error);
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

// PUT - Update gallery item (admin only)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, imageUrl, caption, likes, type, isActive, sortOrder } = body;

    if (!id) {
      return NextResponse.json(
        { message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (caption !== undefined) updateData.caption = caption;
    if (likes !== undefined) updateData.likes = likes;
    if (type !== undefined) updateData.type = type;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    // Update gallery item
    const result = await db.collection('instagramGallery').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Gallery item updated successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Gallery item update error:', error);
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

// DELETE - Delete gallery item (admin only)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Delete gallery item
    const result = await db.collection('instagramGallery').deleteOne(
      { _id: new ObjectId(id) }
    );

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Gallery item deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Gallery item deletion error:', error);
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