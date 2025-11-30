
// /lib/db/queries/review-reactions.ts

import { sql } from '@/lib/db';

// Review Reactions Queries
export async function getReviewReactions(reviewId: string) {
  try {
    const reactions = await sql`
      SELECT rr.*, u.name as user_name, u.image as user_image
      FROM review_reactions rr
      JOIN users u ON rr.user_id = u.id
      WHERE rr.review_id = ${reviewId}
      ORDER BY rr.created_at DESC
    `;
    return reactions;
  } catch (error) {
    console.error('❌ Error fetching review reactions:', error);
    return [];
  }
}

export async function getUserReviewReaction(reviewId: string, userId: string) {
  try {
    const reactions = await sql`
      SELECT * FROM review_reactions 
      WHERE review_id = ${reviewId} AND user_id = ${userId}
      LIMIT 1
    `;
    return reactions[0] || null;
  } catch (error) {
    console.error('❌ Error fetching user review reaction:', error);
    return null;
  }
}

export async function createReviewReaction(
  reviewId: string, 
  userId: string, 
  reactionType: string
) {
  try {
    // Check if user already has a reaction for this review
    const existingReaction = await getUserReviewReaction(reviewId, userId);
    
    if (existingReaction) {
      // Update existing reaction
      const result = await sql`
        UPDATE review_reactions 
        SET reaction_type = ${reactionType}, updated_at = NOW()
        WHERE review_id = ${reviewId} AND user_id = ${userId}
        RETURNING *
      `;
      
      return {
        success: true,
        message: 'Reaction updated successfully',
        reaction: result[0] || null,
        action: 'updated'
      };
    } else {
      // Create new reaction
      const result = await sql`
        INSERT INTO review_reactions (review_id, user_id, reaction_type)
        VALUES (${reviewId}, ${userId}, ${reactionType})
        RETURNING *
      `;
      
      return {
        success: true,
        message: 'Reaction added successfully',
        reaction: result[0] || null,
        action: 'created'
      };
    }
  } catch (error: any) {
    console.error('❌ Error creating review reaction:', error);
    return {
      success: false,
      message: 'Failed to add reaction',
      error: error.message
    };
  }
}

export async function deleteReviewReaction(reviewId: string, userId: string) {
  try {
    await sql`
      DELETE FROM review_reactions 
      WHERE review_id = ${reviewId} AND user_id = ${userId}
    `;
    
    return {
      success: true,
      message: 'Reaction removed successfully'
    };
  } catch (error: any) {
    console.error('❌ Error deleting review reaction:', error);
    return {
      success: false,
      message: 'Failed to remove reaction',
      error: error.message
    };
  }
}

export async function getReviewReactionCounts(reviewId: string) {
  try {
    const counts = await sql`
      SELECT 
        reaction_type,
        COUNT(*) as count
      FROM review_reactions 
      WHERE review_id = ${reviewId}
      GROUP BY reaction_type
    `;
    
    // Convert to object format
    const reactionCounts: Record<string, number> = {};
    counts.forEach((row: any) => {
      reactionCounts[row.reaction_type] = parseInt(row.count);
    });
    
    return reactionCounts;
  } catch (error) {
    console.error('❌ Error fetching review reaction counts:', error);
    return {};
  }
}

export async function getReviewReactionSummary(reviewId: string) {
  try {
    const counts = await getReviewReactionCounts(reviewId);
    const totalReactions = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    return {
      counts,
      total: totalReactions
    };
  } catch (error) {
    console.error('❌ Error fetching review reaction summary:', error);
    return {
      counts: {},
      total: 0
    };
  }
}