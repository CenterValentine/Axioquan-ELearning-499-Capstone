
// /lib/db/queries/review-replies.ts

import { sql } from '@/lib/db';

export interface ReviewReply {
  id: string;
  review_id: string;
  user_id: string;
  parent_reply_id?: string;
  content: string;
  is_instructor_reply: boolean;
  is_edited: boolean;
  edited_at?: Date;
  like_count: number;
  report_count: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  user_name?: string;
  user_image?: string;
}

/**
 * Get replies for a review
 */
export async function getReviewReplies(reviewId: string): Promise<ReviewReply[]> {
  try {
    const result = await sql`
      SELECT 
        rr.*,
        u.name as user_name,
        u.image as user_image
      FROM review_replies rr
      LEFT JOIN users u ON rr.user_id = u.id
      WHERE rr.review_id = ${reviewId} 
        AND rr.status = 'active'
        AND rr.parent_reply_id IS NULL
      ORDER BY rr.created_at ASC
    `;
    return result as ReviewReply[];
  } catch (error) {
    console.error('Error getting review replies:', error);
    return [];
  }
}

/**
 * Get nested replies (replies to replies)
 */
export async function getNestedReplies(parentReplyId: string): Promise<ReviewReply[]> {
  try {
    const result = await sql`
      SELECT 
        rr.*,
        u.name as user_name,
        u.image as user_image
      FROM review_replies rr
      LEFT JOIN users u ON rr.user_id = u.id
      WHERE rr.parent_reply_id = ${parentReplyId} 
        AND rr.status = 'active'
      ORDER BY rr.created_at ASC
    `;
    return result as ReviewReply[];
  } catch (error) {
    console.error('Error getting nested replies:', error);
    return [];
  }
}

/**
 * Create a new review reply
 */
export async function createReviewReply(
  reviewId: string, 
  userId: string, 
  content: string, 
  parentReplyId?: string,
  isInstructorReply: boolean = false
): Promise<{ success: boolean; reply?: ReviewReply; error?: string }> {
  try {
    const result = await sql`
      INSERT INTO review_replies (
        review_id, 
        user_id, 
        parent_reply_id, 
        content, 
        is_instructor_reply
      ) VALUES (
        ${reviewId}, 
        ${userId}, 
        ${parentReplyId || null}, 
        ${content}, 
        ${isInstructorReply}
      )
      RETURNING *
    `;

    const reply = result[0] as ReviewReply;
    
    // Get user info for the reply
    const userResult = await sql`
      SELECT name, image FROM users WHERE id = ${userId} LIMIT 1
    `;
    
    const user = userResult[0] as { name: string; image?: string };
    reply.user_name = user.name;
    reply.user_image = user.image;

    return { success: true, reply };
  } catch (error: any) {
    console.error('Error creating review reply:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update a review reply
 */
export async function updateReviewReply(
  replyId: string, 
  userId: string, 
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE review_replies 
      SET 
        content = ${content},
        is_edited = true,
        edited_at = NOW(),
        updated_at = NOW()
      WHERE id = ${replyId} AND user_id = ${userId}
    `;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating review reply:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a review reply (soft delete)
 */
export async function deleteReviewReply(
  replyId: string, 
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE review_replies 
      SET status = 'deleted', updated_at = NOW()
      WHERE id = ${replyId} AND user_id = ${userId}
    `;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting review reply:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user can reply to review (instructor or original reviewer)
 */
export async function canUserReplyToReview(
  reviewId: string, 
  userId: string
): Promise<{ canReply: boolean; isInstructor: boolean }> {
  try {
    // Get review info
    const reviewResult = await sql`
      SELECT cr.user_id, c.instructor_id
      FROM course_reviews cr
      JOIN courses c ON cr.course_id = c.id
      WHERE cr.id = ${reviewId}
      LIMIT 1
    `;
    
    if (!reviewResult[0]) {
      return { canReply: false, isInstructor: false };
    }

    const review = reviewResult[0] as { user_id: string; instructor_id: string };
    
    // User can reply if they are the instructor or the original reviewer
    const isInstructor = review.instructor_id === userId;
    const isReviewer = review.user_id === userId;
    
    return { 
      canReply: isInstructor || isReviewer, 
      isInstructor 
    };
  } catch (error) {
    console.error('Error checking reply permissions:', error);
    return { canReply: false, isInstructor: false };
  }
}