
// /lib/cloudinary/utils.ts
// NO 'use server' at the top

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload image to Cloudinary - Server Action
 */
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'axioquan/profiles'
): Promise<UploadResult> {
  'use server'; // Add to individual async functions only
  
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
  'use server'; // Add to individual async functions only
  
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

/**
 * Extract public ID from Cloudinary URL
 * This is a pure helper function, not a server action
 */
export function getPublicIdFromUrl(imageUrl: string): string | null {
  const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : null;
}