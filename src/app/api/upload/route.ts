import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory already exists or other error - we'll continue
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Write file to uploads directory
    await writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
} 