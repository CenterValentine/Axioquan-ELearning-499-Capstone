

// src/app/api/upload/direct/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the metadata for debugging
    console.log('📦 Cloudinary upload metadata:', {
      public_id: body.public_id,
      bytes: body.bytes,
      duration: body.duration,
      folder: body.folder
    });
    
    // ✅ THIS IS COMPLETE - No database code needed yet
    // You can later add database saving here
    
    return NextResponse.json({
      success: true,
      message: 'Video metadata received successfully',
      received_at: new Date().toISOString(),
      data: {
        public_id: body.public_id,
        url: body.secure_url || body.url,
        duration: body.duration,
        bytes: body.bytes,
        format: body.format
      }
    });
    
  } catch (error: any) {
    console.error('❌ Direct upload metadata error:', error);
    
    // Still return JSON (not HTML) to avoid "Unexpected token" errors
    return NextResponse.json(
      { 
        error: error.message,
        note: 'This error does not affect the actual video upload to Cloudinary'
      },
      { status: 500 }
    );
  }
}

// ✅ ADD THIS to ensure it works with CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}