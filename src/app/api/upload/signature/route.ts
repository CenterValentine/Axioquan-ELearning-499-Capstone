

// src/app/api/upload/signature/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// IMPORTANT: Configure Cloudinary CORRECTLY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'axioquan/videos';
    const resource_type = searchParams.get('resource_type') || 'video';
    
    console.log('🔑 Generating signature for:', {
      folder,
      resource_type,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY?.substring(0, 8) + '...'
    });
    
    // CRITICAL: Generate timestamp in seconds
    const timestamp = Math.round(Date.now() / 1000);
    
    // CORRECT parameters for signature
    const paramsToSign = {
      timestamp: timestamp,
      folder: folder,
    };
    
    console.log('📝 Parameters to sign:', paramsToSign);
    
    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );
    
    console.log('✅ Signature generated:', signature.substring(0, 20) + '...');
    
    return NextResponse.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY!,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      folder,
      resource_type,
    });
    
  } catch (error: any) {
    console.error('❌ Signature generation failed:', error);
    
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Check Cloudinary environment variables',
        env_check: {
          has_cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
          has_api_key: !!process.env.CLOUDINARY_API_KEY,
          has_api_secret: !!process.env.CLOUDINARY_API_SECRET
        }
      },
      { status: 500 }
    );
  }
}


// Add OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}