
// // /lib/cloudinary/actions.ts
// 'use server';

// import { v2 as cloudinary } from 'cloudinary';
// import { UploadResult } from './utils';

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// /**
//  * Upload image to Cloudinary - Server Action
//  */
// export async function uploadImage(
//   fileBuffer: Buffer,
//   fileName: string,
//   folder: string = 'axioquan/profiles'
// ): Promise<UploadResult> {
//   try {
//     return new Promise((resolve) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder,
//           resource_type: 'image',
//           transformation: [
//             { width: 400, height: 400, crop: 'fill', gravity: 'face' },
//             { quality: 'auto' },
//             { format: 'webp' }
//           ]
//         },
//         (error, result) => {
//           if (error) {
//             console.error('❌ Cloudinary upload error:', error);
//             resolve({
//               success: false,
//               error: error.message
//             });
//           } else if (result) {
//             resolve({
//               success: true,
//               imageUrl: result.secure_url,
//               publicId: result.public_id
//             });
//           }
//         }
//       );

//       uploadStream.end(fileBuffer);
//     });
//   } catch (error: any) {
//     console.error('❌ Error uploading to Cloudinary:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

// /**
//  * Delete image from Cloudinary - Server Action
//  */
// export async function deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
    
//     if (result.result === 'ok') {
//       return { success: true };
//     } else {
//       return { 
//         success: false, 
//         error: result.result 
//       };
//     }
//   } catch (error: any) {
//     console.error('❌ Error deleting from Cloudinary:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }


























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
 * Generic upload to Cloudinary - Server Action
 * - resourceType: 'image' | 'video' | 'raw'
 * - folder: Cloudinary folder
 *
 * Returns UploadResult which now may include duration (seconds) and bytes.
 */
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'axioquan/profiles',
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<UploadResult> {
  try {
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
          chunk_size: 20_000_000,
          transformation:
            resourceType === 'image'
              ? [
                  { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                  { quality: 'auto' },
                  { format: 'webp' },
                ]
              : undefined,
        },
        (error, result: any) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            resolve({
              success: false,
              error: error.message,
            });
            return;
          }

          if (!result) {
            resolve({ success: false, error: 'No result from Cloudinary' });
            return;
          }

          // result may contain duration (for videos) and bytes
          const out: UploadResult = {
            success: true,
            imageUrl: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            duration: result.duration, // seconds (may be undefined for non-video)
          };

          resolve(out);
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error: any) {
    console.error('❌ Error uploading to Cloudinary:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete image from Cloudinary - Server Action
 */
export async function deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });

    if (result.result === 'ok') {
      return { success: true };
    } else {
      return {
        success: false,
        error: result.result,
      };
    }
  } catch (error: any) {
    console.error('❌ Error deleting from Cloudinary:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
