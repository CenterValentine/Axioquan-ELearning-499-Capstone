
// /lib/social/actions.ts

'use server';

import { 
  getCourseLikes,
  getUserCourseLike,
  createCourseLike,
  deleteCourseLike,
  getCourseLikeCount,
  createCourseShare,
  getCourseShareCount,
  getCourseSocialStats,
  getUserSocialActivity
} from '@/lib/db/queries/social';
import { getSession } from '@/lib/auth/session';

// Define proper return types
type BaseResponse = {
  success: boolean;
  message: string;
};

type LikeResponse = BaseResponse & {
  liked?: boolean;
  like?: any;
  likes?: any[];
  likeCount?: number;
  userLiked?: boolean;
  requiresAuth?: boolean;
  error?: string;
};

type ShareResponse = BaseResponse & {
  share?: any;
  shareCount?: number;
  requiresAuth?: boolean;
  error?: string;
};

type StatsResponse = BaseResponse & {
  stats?: any;
  activity?: any;
  error?: string;
};

// Course Likes Actions
export async function toggleCourseLikeAction(courseId: string): Promise<LikeResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { 
        success: false, 
        message: 'Authentication required',
        requiresAuth: true 
      };
    }

    const existingLike = await getUserCourseLike(courseId, session.userId);
    
    if (existingLike) {
      // Unlike the course
      const result = await deleteCourseLike(courseId, session.userId);
      if (result.success) {
        return { 
          success: true, 
          message: 'Course unliked',
          liked: false 
        };
      }
      return { 
        success: false, 
        message: result.message, 
        error: result.error 
      };
    } else {
      // Like the course
      const result = await createCourseLike(courseId, session.userId);
      if (result.success) {
        return { 
          success: true, 
          message: 'Course liked',
          liked: true,
          like: result.like 
        };
      }
      return { 
        success: false, 
        message: result.message, 
        error: result.error 
      };
    }
  } catch (error: any) {
    console.error('❌ Error toggling course like:', error);
    return { 
      success: false, 
      message: 'Failed to toggle like',
      error: error.message 
    };
  }
}

export async function getCourseLikesAction(courseId: string): Promise<LikeResponse> {
  try {
    const likes = await getCourseLikes(courseId);
    const likeCount = await getCourseLikeCount(courseId);
    
    // Check if current user has liked this course
    const session = await getSession();
    let userLiked = false;
    
    if (session) {
      const userLike = await getUserCourseLike(courseId, session.userId);
      userLiked = !!userLike;
    }
    
    return {
      success: true,
      message: 'Likes fetched successfully',
      likes,
      likeCount,
      userLiked
    };
  } catch (error: any) {
    console.error('❌ Error fetching course likes:', error);
    return { 
      success: false, 
      message: 'Failed to fetch likes',
      error: error.message 
    };
  }
}

// Course Shares Actions
export async function recordCourseShareAction(
  courseId: string, 
  shareData: {
    share_type?: string;
    share_url?: string;
    shared_to?: string;
  } = {}
): Promise<ShareResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { 
        success: false, 
        message: 'Authentication required',
        requiresAuth: true 
      };
    }

    const result = await createCourseShare(courseId, session.userId, shareData);
    
    if (result.success) {
      return {
        success: true,
        message: result.message,
        share: result.share
      };
    }
    
    return { 
      success: false, 
      message: result.message,
      error: result.error 
    };
  } catch (error: any) {
    console.error('❌ Error recording course share:', error);
    return { 
      success: false, 
      message: 'Failed to record share',
      error: error.message 
    };
  }
}

export async function getCourseSharesAction(courseId: string): Promise<ShareResponse> {
  try {
    const shareCount = await getCourseShareCount(courseId);
    
    return {
      success: true,
      message: 'Shares fetched successfully',
      shareCount
    };
  } catch (error: any) {
    console.error('❌ Error fetching course shares:', error);
    return { 
      success: false, 
      message: 'Failed to fetch shares',
      error: error.message 
    };
  }
}

// Social Stats Actions
export async function getCourseSocialStatsAction(courseId: string): Promise<StatsResponse> {
  try {
    const stats = await getCourseSocialStats(courseId);
    
    return {
      success: true,
      message: 'Social stats fetched successfully',
      stats
    };
  } catch (error: any) {
    console.error('❌ Error fetching course social stats:', error);
    return { 
      success: false, 
      message: 'Failed to fetch social stats',
      error: error.message 
    };
  }
}

export async function getUserSocialActivityAction(userId?: string): Promise<StatsResponse> {
  try {
    let targetUserId = userId;
    
    if (!targetUserId) {
      const session = await getSession();
      if (!session) {
        return { 
          success: false, 
          message: 'Authentication required' 
        };
      }
      targetUserId = session.userId;
    }
    
    const activity = await getUserSocialActivity(targetUserId);
    
    return {
      success: true,
      message: 'User activity fetched successfully',
      activity
    };
  } catch (error: any) {
    console.error('❌ Error fetching user social activity:', error);
    return { 
      success: false, 
      message: 'Failed to fetch social activity',
      error: error.message 
    };
  }
}