
// /lib/social/review-actions.ts

'use server';

import { 
  getReviewReactions,
  getUserReviewReaction,
  createReviewReaction,
  deleteReviewReaction,
  getReviewReactionCounts,
  getReviewReactionSummary
} from '@/lib/db/queries/review-reactions';
import { getSession } from '@/lib/auth/session';

// Define proper return types
type ReviewReactionResponse = {
  success: boolean;
  message: string;
  reaction?: any;
  action?: 'created' | 'updated' | 'deleted';
  counts?: Record<string, number>;
  total?: number;
  userReaction?: string | null;
  requiresAuth?: boolean;
  error?: string;
};

// Review Reactions Actions
export async function toggleReviewReactionAction(
  reviewId: string, 
  reactionType: string
): Promise<ReviewReactionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { 
        success: false, 
        message: 'Authentication required',
        requiresAuth: true 
      };
    }

    const existingReaction = await getUserReviewReaction(reviewId, session.userId);
    
    if (existingReaction) {
      if (existingReaction.reaction_type === reactionType) {
        // Same reaction type - remove it (toggle off)
        const result = await deleteReviewReaction(reviewId, session.userId);
        if (result.success) {
          const counts = await getReviewReactionCounts(reviewId);
          const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
          
          return { 
            success: true, 
            message: 'Reaction removed',
            action: 'deleted',
            counts,
            total,
            userReaction: null
          };
        }
        return { 
          success: false, 
          message: result.message, 
          error: result.error 
        };
      } else {
        // Different reaction type - update it
        const result = await createReviewReaction(reviewId, session.userId, reactionType);
        if (result.success) {
          const counts = await getReviewReactionCounts(reviewId);
          const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
          
          return { 
            success: true, 
            message: 'Reaction updated',
            action: 'updated',
            reaction: result.reaction,
            counts,
            total,
            userReaction: reactionType
          };
        }
        return { 
          success: false, 
          message: result.message, 
          error: result.error 
        };
      }
    } else {
      // No existing reaction - create new one
      const result = await createReviewReaction(reviewId, session.userId, reactionType);
      if (result.success) {
        const counts = await getReviewReactionCounts(reviewId);
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        
        return { 
          success: true, 
          message: 'Reaction added',
          action: 'created',
          reaction: result.reaction,
          counts,
          total,
          userReaction: reactionType
        };
      }
      return { 
        success: false, 
        message: result.message, 
        error: result.error 
      };
    }
  } catch (error: any) {
    console.error('❌ Error toggling review reaction:', error);
    return { 
      success: false, 
      message: 'Failed to toggle reaction',
      error: error.message 
    };
  }
}

export async function getReviewReactionsAction(reviewId: string): Promise<ReviewReactionResponse> {
  try {
    const reactions = await getReviewReactions(reviewId);
    const summary = await getReviewReactionSummary(reviewId);
    
    // Check if current user has reacted to this review
    const session = await getSession();
    let userReaction = null;
    
    if (session) {
      const userReactionData = await getUserReviewReaction(reviewId, session.userId);
      userReaction = userReactionData?.reaction_type || null;
    }
    
    return {
      success: true,
      message: 'Reactions fetched successfully',
      counts: summary.counts,
      total: summary.total,
      userReaction,
      reaction: reactions // Return individual reactions if needed
    };
  } catch (error: any) {
    console.error('❌ Error fetching review reactions:', error);
    return { 
      success: false, 
      message: 'Failed to fetch reactions',
      error: error.message 
    };
  }
}

export async function removeReviewReactionAction(reviewId: string): Promise<ReviewReactionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { 
        success: false, 
        message: 'Authentication required',
        requiresAuth: true 
      };
    }

    const result = await deleteReviewReaction(reviewId, session.userId);
    
    if (result.success) {
      const counts = await getReviewReactionCounts(reviewId);
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
      return {
        success: true,
        message: result.message,
        action: 'deleted',
        counts,
        total,
        userReaction: null
      };
    }
    
    return { 
      success: false, 
      message: result.message,
      error: result.error 
    };
  } catch (error: any) {
    console.error('❌ Error removing review reaction:', error);
    return { 
      success: false, 
      message: 'Failed to remove reaction',
      error: error.message 
    };
  }
}