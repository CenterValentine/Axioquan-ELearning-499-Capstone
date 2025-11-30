
// /lib/db/queries/social.ts

import { sql } from '@/lib/db';

// Course Likes Queries
export async function getCourseLikes(courseId: string) {
  try {
    const likes = await sql`
      SELECT cl.*, u.name as user_name, u.image as user_image
      FROM course_likes cl
      JOIN users u ON cl.user_id = u.id
      WHERE cl.course_id = ${courseId}
      ORDER BY cl.created_at DESC
    `;
    return likes;
  } catch (error) {
    console.error('❌ Error fetching course likes:', error);
    return [];
  }
}

export async function getUserCourseLike(courseId: string, userId: string) {
  try {
    const likes = await sql`
      SELECT * FROM course_likes 
      WHERE course_id = ${courseId} AND user_id = ${userId}
      LIMIT 1
    `;
    return likes[0] || null;
  } catch (error) {
    console.error('❌ Error fetching user course like:', error);
    return null;
  }
}

export async function createCourseLike(courseId: string, userId: string) {
  try {
    const result = await sql`
      INSERT INTO course_likes (course_id, user_id)
      VALUES (${courseId}, ${userId})
      ON CONFLICT (course_id, user_id) DO NOTHING
      RETURNING *
    `;
    
    return {
      success: true,
      message: 'Course liked successfully',
      like: result[0] || null
    };
  } catch (error: any) {
    console.error('❌ Error creating course like:', error);
    return {
      success: false,
      message: 'Failed to like course',
      error: error.message
    };
  }
}

export async function deleteCourseLike(courseId: string, userId: string) {
  try {
    await sql`
      DELETE FROM course_likes 
      WHERE course_id = ${courseId} AND user_id = ${userId}
    `;
    
    return {
      success: true,
      message: 'Course unliked successfully'
    };
  } catch (error: any) {
    console.error('❌ Error deleting course like:', error);
    return {
      success: false,
      message: 'Failed to unlike course',
      error: error.message
    };
  }
}

export async function getCourseLikeCount(courseId: string) {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM course_likes 
      WHERE course_id = ${courseId}
    `;
    return parseInt(result[0]?.count || '0');
  } catch (error) {
    console.error('❌ Error fetching course like count:', error);
    return 0;
  }
}

// Course Shares Queries
export async function createCourseShare(
  courseId: string, 
  userId: string, 
  shareData: {
    share_type?: string;
    share_url?: string;
    shared_to?: string;
  } = {}
) {
  try {
    const result = await sql`
      INSERT INTO course_shares (
        course_id, 
        user_id, 
        share_type, 
        share_url, 
        shared_to
      ) VALUES (
        ${courseId},
        ${userId},
        ${shareData.share_type || 'link'},
        ${shareData.share_url},
        ${shareData.shared_to}
      )
      RETURNING *
    `;
    
    return {
      success: true,
      message: 'Share recorded successfully',
      share: result[0] || null
    };
  } catch (error: any) {
    console.error('❌ Error creating course share:', error);
    return {
      success: false,
      message: 'Failed to record share',
      error: error.message
    };
  }
}

export async function getCourseShareCount(courseId: string) {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM course_shares 
      WHERE course_id = ${courseId}
    `;
    return parseInt(result[0]?.count || '0');
  } catch (error) {
    console.error('❌ Error fetching course share count:', error);
    return 0;
  }
}

// Social Stats Queries
export async function getCourseSocialStats(courseId: string) {
  try {
    const likeCount = await getCourseLikeCount(courseId);
    const shareCount = await getCourseShareCount(courseId);
    
    return {
      like_count: likeCount,
      share_count: shareCount,
      favorite_count: likeCount // For now, favorite count is same as like count
    };
  } catch (error) {
    console.error('❌ Error fetching course social stats:', error);
    return {
      like_count: 0,
      share_count: 0,
      favorite_count: 0
    };
  }
}

export async function getUserSocialActivity(userId: string) {
  try {
    const coursesLiked = await sql`
      SELECT COUNT(*) as count FROM course_likes 
      WHERE user_id = ${userId}
    `;
    
    const coursesShared = await sql`
      SELECT COUNT(*) as count FROM course_shares 
      WHERE user_id = ${userId}
    `;
    
    return {
      courses_liked: parseInt(coursesLiked[0]?.count || '0'),
      courses_shared: parseInt(coursesShared[0]?.count || '0')
    };
  } catch (error) {
    console.error('❌ Error fetching user social activity:', error);
    return {
      courses_liked: 0,
      courses_shared: 0
    };
  }
}