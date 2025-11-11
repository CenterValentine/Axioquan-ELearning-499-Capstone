
// /lib/cloudinary/actions.ts
'use server';

import { v2 as cloudinary } from 'cloudinary';
import { UploadResult } from './utils';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary - Server Action
 */
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'axioquan/profiles'
): Promise<UploadResult> {
  try {
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { format: 'webp' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            resolve({
              success: false,
              error: error.message
            });
          } else if (result) {
            resolve({
              success: true,
              imageUrl: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error: any) {
    console.error('❌ Error uploading to Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete image from Cloudinary - Server Action
 */
export async function deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: result.result 
      };
    }
  } catch (error: any) {
    console.error('❌ Error deleting from Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}