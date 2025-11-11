// /lib/auth/profile-actions.ts
'use server';  

import { sql } from '@/lib/db';
import { uploadImage, deleteImage } from '@/lib/cloudinary/actions';
import { getPublicIdFromUrl } from '@/lib/cloudinary/utils'; // Import helper from utils
import { getSession } from './session';
import { updateSessionImage } from '@/lib/auth/session'; // Make sure this is imported

export interface ProfileImageResponse {
  success: boolean;
  message: string;
  imageUrl?: string;
  errors?: string[];
}

/**
 * Upload profile image for user
 */
export async function uploadProfileImage(
  formData: FormData
): Promise<ProfileImageResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to upload a profile image'],
      };
    }

    const file = formData.get('image') as File;
    if (!file) {
      return {
        success: false,
        message: 'No image provided',
        errors: ['Please select an image to upload'],
      };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        message: 'Invalid file type',
        errors: ['Please upload a valid image file (JPEG, PNG, WebP, etc.)'],
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'File too large',
        errors: ['Image must be less than 5MB'],
      };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadImage(buffer, file.name);
    
    if (!uploadResult.success || !uploadResult.imageUrl) {
      return {
        success: false,
        message: 'Image upload failed',
        errors: [uploadResult.error || 'Failed to upload image'],
      };
    }

    // Delete old profile image if exists
    const currentUser = await sql`
      SELECT image FROM users WHERE id = ${session.userId} LIMIT 1
    `;
    
    if (currentUser[0]?.image) {
      const oldPublicId = getPublicIdFromUrl(currentUser[0].image);
      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }
    }

    // Update user record with new image
    await sql`
      UPDATE users 
      SET image = ${uploadResult.imageUrl}, updated_at = NOW()
      WHERE id = ${session.userId}
    `;

    // Update user profile record as well
    await sql`
      UPDATE user_profiles 
      SET profile_image = ${uploadResult.imageUrl}, 
          profile_image_public_id = ${uploadResult.publicId},
          updated_at = NOW()
      WHERE user_id = ${session.userId}
    `;

    // ✅ CRITICAL FIX: Update the session with the new image URL
    await updateSessionImage(session.userId, uploadResult.imageUrl);

    return {
      success: true,
      message: 'Profile image updated successfully',
      imageUrl: uploadResult.imageUrl,
    };
  } catch (error: any) {
    console.error('❌ Profile image upload error:', error);
    return {
      success: false,
      message: 'Failed to upload profile image',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Remove profile image
 */
export async function removeProfileImage(): Promise<ProfileImageResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in'],
      };
    }

    // Get current image
    const currentUser = await sql`
      SELECT image FROM users WHERE id = ${session.userId} LIMIT 1
    `;
    
    const currentImage = currentUser[0]?.image;
    if (!currentImage) {
      return {
        success: false,
        message: 'No profile image to remove',
        errors: ['No profile image found'],
      };
    }

    // Delete from Cloudinary
    const publicId = getPublicIdFromUrl(currentImage);
    if (publicId) {
      await deleteImage(publicId);
    }

    // Update user record
    await sql`
      UPDATE users 
      SET image = NULL, updated_at = NOW()
      WHERE id = ${session.userId}
    `;

    // Update user profile record
    await sql`
      UPDATE user_profiles 
      SET profile_image = NULL, 
          profile_image_public_id = NULL,
          updated_at = NOW()
      WHERE user_id = ${session.userId}
    `;

    // ✅ CRITICAL FIX: Remove image from session
    const { removeSessionImage } = await import('./session');
    await removeSessionImage(session.userId);

    return {
      success: true,
      message: 'Profile image removed successfully',
    };
  } catch (error: any) {
    console.error('❌ Profile image removal error:', error);
    return {
      success: false,
      message: 'Failed to remove profile image',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

// ... rest of the file remains unchanged
export interface ProfileData {
  name?: string;
  bio?: string;
  headline?: string;
  location?: string;
  company?: string;
  website?: string;
  twitter_username?: string;
  github_username?: string;
  linkedin_url?: string;
  youtube_channel?: string;
  skills?: string[];
  learning_goals?: string[];
  preferred_topics?: string[];
  timezone?: string;
  locale?: string;
}

/**
 * Update user profile information
 */
export async function updateUserProfile(
  profileData: ProfileData
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to update your profile'],
      };
    }

    // Update users table
    await sql`
      UPDATE users 
      SET 
        name = COALESCE(${profileData.name}, name),
        bio = COALESCE(${profileData.bio}, bio),
        timezone = COALESCE(${profileData.timezone}, timezone),
        locale = COALESCE(${profileData.locale}, locale),
        updated_at = NOW()
      WHERE id = ${session.userId}
    `;

    // Update user_profiles table
    await sql`
      UPDATE user_profiles 
      SET 
        display_name = COALESCE(${profileData.name}, display_name),
        headline = COALESCE(${profileData.headline}, headline),
        location = COALESCE(${profileData.location}, location),
        company = COALESCE(${profileData.company}, company),
        website = COALESCE(${profileData.website}, website),
        twitter_username = COALESCE(${profileData.twitter_username}, twitter_username),
        github_username = COALESCE(${profileData.github_username}, github_username),
        linkedin_url = COALESCE(${profileData.linkedin_url}, linkedin_url),
        youtube_channel = COALESCE(${profileData.youtube_channel}, youtube_channel),
        skills = COALESCE(${profileData.skills}, skills),
        learning_goals = COALESCE(${profileData.learning_goals}, learning_goals),
        preferred_topics = COALESCE(${profileData.preferred_topics}, preferred_topics),
        updated_at = NOW()
      WHERE user_id = ${session.userId}
    `;

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error: any) {
    console.error('❌ Profile update error:', error);
    return {
      success: false,
      message: 'Profile update failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Get complete user profile data
 */
export async function getUserProfile(): Promise<{
  success: boolean;
  profile?: any;
  errors?: string[];
}> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        errors: ['Authentication required'],
      };
    }

    const profileData = await sql`
      SELECT 
        u.id, u.username, u.email, u.name, u.bio, u.image, u.timezone, u.locale,
        u.created_at, u.last_login,
        up.display_name, up.headline, up.location, up.company, up.website,
        up.twitter_username, up.github_username, up.linkedin_url, up.youtube_channel,
        up.skills, up.expertise_levels, up.achievements, up.portfolio_urls,
        up.social_links, up.learning_goals, up.preferred_topics, up.availability_status,
        up.profile_image, up.profile_image_public_id
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ${session.userId}
      LIMIT 1
    `;

    if (profileData.length === 0) {
      return {
        success: false,
        errors: ['Profile not found'],
      };
    }

    return {
      success: true,
      profile: profileData[0],
    };
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}