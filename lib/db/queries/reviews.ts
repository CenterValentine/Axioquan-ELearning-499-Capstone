
// // /lib/db/queries/reviews.ts

// import { sql } from '@/lib/db';

// export interface CreateReviewData {
//   course_id: string;
//   user_id: string;
//   rating: number;
//   title?: string;
//   content: string;
// }

// export interface UpdateReviewData {
//   rating?: number;
//   title?: string;
//   content?: string;
//   is_edited?: boolean;
// }

// // Create a new review
// export async function createReview(reviewData: CreateReviewData) {
//   try {
//     const result = await sql`
//       INSERT INTO course_reviews (
//         course_id, 
//         user_id, 
//         rating, 
//         title, 
//         content
//       ) VALUES (
//         ${reviewData.course_id},
//         ${reviewData.user_id},
//         ${reviewData.rating},
//         ${reviewData.title || null},
//         ${reviewData.content}
//       )
//       RETURNING *
//     `;
    
//     return {
//       success: true,
//       message: 'Review created successfully',
//       review: result[0] || null
//     };
//   } catch (error: any) {
//     console.error('❌ Error creating review:', error);
    
//     // Check if it's a duplicate review error
//     if (error.code === '23505') { // Unique violation
//       return {
//         success: false,
//         message: 'You have already reviewed this course',
//         error: error.message
//       };
//     }
    
//     return {
//       success: false,
//       message: 'Failed to create review',
//       error: error.message
//     };
//   }
// }

// // Get reviews for a course
// export async function getCourseReviews(courseId: string) {
//   try {
//     const reviews = await sql`
//       SELECT 
//         cr.*,
//         u.name as user_name,
//         u.image as user_image,
//         u.role as user_role,
//         (
//           SELECT json_object_agg(
//             reaction_type, 
//             COUNT(*)
//           )
//           FROM review_reactions rr 
//           WHERE rr.review_id = cr.id 
//           GROUP BY rr.review_id
//         ) as reaction_counts
//       FROM course_reviews cr
//       JOIN users u ON cr.user_id = u.id
//       WHERE cr.course_id = ${courseId}
//         AND cr.status = 'active'
//       ORDER BY cr.created_at DESC
//     `;
    
//     return reviews;
//   } catch (error) {
//     console.error('❌ Error fetching course reviews:', error);
//     return [];
//   }
// }

// // Get review statistics for a course
// export async function getCourseReviewStats(courseId: string) {
//   try {
//     // Get average rating and total reviews
//     const statsResult = await sql`
//       SELECT 
//         COUNT(*) as total_reviews,
//         AVG(rating) as average_rating,
//         COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1,
//         COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2,
//         COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3,
//         COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4,
//         COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5
//       FROM course_reviews 
//       WHERE course_id = ${courseId} 
//         AND status = 'active'
//     `;
    
//     const stats = statsResult[0];
    
//     return {
//       average_rating: parseFloat(stats.average_rating) || 0,
//       total_reviews: parseInt(stats.total_reviews) || 0,
//       rating_distribution: {
//         1: parseInt(stats.rating_1) || 0,
//         2: parseInt(stats.rating_2) || 0,
//         3: parseInt(stats.rating_3) || 0,
//         4: parseInt(stats.rating_4) || 0,
//         5: parseInt(stats.rating_5) || 0
//       }
//     };
//   } catch (error) {
//     console.error('❌ Error fetching review stats:', error);
//     return {
//       average_rating: 0,
//       total_reviews: 0,
//       rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
//     };
//   }
// }

// // Check if user has already reviewed a course
// export async function getUserCourseReview(courseId: string, userId: string) {
//   try {
//     const reviews = await sql`
//       SELECT * FROM course_reviews 
//       WHERE course_id = ${courseId} AND user_id = ${userId}
//       LIMIT 1
//     `;
//     return reviews[0] || null;
//   } catch (error) {
//     console.error('❌ Error fetching user course review:', error);
//     return null;
//   }
// }

// // Update a review
// export async function updateReview(reviewId: string, updateData: UpdateReviewData) {
//   try {
//     const result = await sql`
//       UPDATE course_reviews 
//       SET 
//         rating = COALESCE(${updateData.rating}, rating),
//         title = COALESCE(${updateData.title}, title),
//         content = COALESCE(${updateData.content}, content),
//         is_edited = COALESCE(${updateData.is_edited}, is_edited),
//         updated_at = NOW()
//       WHERE id = ${reviewId}
//       RETURNING *
//     `;
    
//     return {
//       success: true,
//       message: 'Review updated successfully',
//       review: result[0] || null
//     };
//   } catch (error: any) {
//     console.error('❌ Error updating review:', error);
//     return {
//       success: false,
//       message: 'Failed to update review',
//       error: error.message
//     };
//   }
// }

// // Delete a review (soft delete)
// export async function deleteReview(reviewId: string, userId: string) {
//   try {
//     await sql`
//       UPDATE course_reviews 
//       SET status = 'removed'
//       WHERE id = ${reviewId} AND user_id = ${userId}
//     `;
    
//     return {
//       success: true,
//       message: 'Review deleted successfully'
//     };
//   } catch (error: any) {
//     console.error('❌ Error deleting review:', error);
//     return {
//       success: false,
//       message: 'Failed to delete review',
//       error: error.message
//     };
//   }
// }























// /lib/db/queries/reviews.ts

import { sql } from '@/lib/db';

export interface CreateReviewData {
  course_id: string;
  user_id: string;
  enrollment_id: string; // NOW REQUIRED
  rating: number;
  title?: string;
  comment: string; // CHANGED: content → comment to match database
  content_rating?: number;
  instructor_rating?: number;
  support_rating?: number;
}

// Create a new review (STRICT ENROLLMENT VERSION)
export async function createReview(reviewData: CreateReviewData) {
  try {
    console.log('💾 Creating review with enrollment validation:', reviewData);

    // Validate that enrollment_id is provided
    if (!reviewData.enrollment_id) {
      return {
        success: false,
        message: 'Enrollment ID is required. You must be enrolled in the course to submit a review.',
        error: 'MISSING_ENROLLMENT'
      };
    }

    // Verify the enrollment exists and belongs to the user
    try {
      const enrollmentCheck = await sql`
        SELECT id, status 
        FROM enrollments 
        WHERE id = ${reviewData.enrollment_id} 
          AND user_id = ${reviewData.user_id}
          AND course_id = ${reviewData.course_id}
        LIMIT 1
      `;

      if (enrollmentCheck.length === 0) {
        return {
          success: false,
          message: 'Invalid enrollment. You must be enrolled in this course to submit a review.',
          error: 'INVALID_ENROLLMENT'
        };
      }

      if (enrollmentCheck[0].status !== 'active') {
        return {
          success: false,
          message: 'Your enrollment is not active. Please contact support.',
          error: 'INACTIVE_ENROLLMENT'
        };
      }
    } catch (enrollmentError) {
      console.error('❌ Error verifying enrollment:', enrollmentError);
      return {
        success: false,
        message: 'Unable to verify enrollment. Please try again.',
        error: 'ENROLLMENT_VERIFICATION_FAILED'
      };
    }

    // Use the CORRECT column names from your schema
    const result = await sql`
      INSERT INTO course_reviews (
        course_id, 
        user_id, 
        enrollment_id,
        rating, 
        title, 
        comment,  -- CHANGED: content → comment
        content_rating,
        instructor_rating, 
        support_rating,
        status,
        is_verified,
        helpful_count,
        like_count,
        dislike_count,
        reply_count,
        is_public
      ) VALUES (
        ${reviewData.course_id},
        ${reviewData.user_id},
        ${reviewData.enrollment_id},
        ${reviewData.rating},
        ${reviewData.title || null},
        ${reviewData.comment},  -- CHANGED: content → comment
        ${reviewData.content_rating || reviewData.rating},
        ${reviewData.instructor_rating || reviewData.rating},
        ${reviewData.support_rating || reviewData.rating},
        'active',
        true,  -- Mark as verified since user is enrolled
        0,     -- helpful_count
        0,     -- like_count  
        0,     -- dislike_count
        0,     -- reply_count
        true   -- is_public
      )
      RETURNING *
    `;
    
    console.log('✅ Review created successfully with enrollment:', result[0]);
    return {
      success: true,
      message: 'Review created successfully',
      review: result[0] || null
    };
  } catch (error: any) {
    console.error('❌ Error creating review:', error);
    
    if (error.code === '23505') { // Unique violation (course_id + user_id)
      return {
        success: false,
        message: 'You have already reviewed this course',
        error: error.message
      };
    }
    
    if (error.code === '23503') { // Foreign key violation (invalid enrollment_id)
      return {
        success: false,
        message: 'Invalid enrollment. You must be enrolled in this course to submit a review.',
        error: error.message
      };
    }
    
    if (error.code === '23502') { // Not null violation
      if (error.message?.includes('enrollment_id')) {
        return {
          success: false,
          message: 'Enrollment is required to submit a review.',
          error: error.message
        };
      }
      return {
        success: false,
        message: 'Missing required information.',
        error: error.message
      };
    }
    
    return {
      success: false,
      message: 'Failed to create review',
      error: error.message
    };
  }
}

// Get reviews for a course (UPDATED for correct schema)
export async function getCourseReviews(courseId: string) {
  try {
    console.log('🔍 Fetching reviews for course:', courseId);
    
    const reviews = await sql`
      SELECT 
        cr.*,
        u.name as user_name,
        u.image as user_image
      FROM course_reviews cr
      JOIN users u ON cr.user_id = u.id
      WHERE cr.course_id = ${courseId}
        AND cr.status = 'active'
        AND cr.is_public = true
      ORDER BY cr.created_at DESC
    `;
    
    console.log(`📋 Found ${reviews.length} reviews`);
    
    // Get reaction counts separately
    const reviewsWithReactions = await Promise.all(
      reviews.map(async (review: any) => {
        try {
          const reactionCounts = await sql`
            SELECT reaction_type, COUNT(*) as count
            FROM review_reactions 
            WHERE review_id = ${review.id}
            GROUP BY reaction_type
          `;
          
          const counts: Record<string, number> = {};
          reactionCounts.forEach((row: any) => {
            counts[row.reaction_type] = parseInt(row.count);
          });
          
          return {
            id: review.id,
            course_id: review.course_id,
            user_id: review.user_id,
            rating: review.rating,
            title: review.title,
            content: review.comment, // MAP: comment → content for frontend compatibility
            is_verified: review.is_verified || false,
            is_edited: review.is_edited || false,
            like_count: review.like_count || 0,
            dislike_count: review.dislike_count || 0,
            helpful_count: review.helpful_count || 0,
            reply_count: review.reply_count || 0,
            status: review.status || 'active',
            created_at: review.created_at,
            updated_at: review.updated_at,
            user_name: review.user_name,
            user_image: review.user_image,
            reaction_counts: counts,
            user_reaction: null
          };
        } catch (error) {
          console.error('Error fetching reaction counts for review:', review.id, error);
          return {
            ...review,
            content: review.comment, // MAP: comment → content
            reaction_counts: {},
            user_reaction: null
          };
        }
      })
    );
    
    return reviewsWithReactions;
  } catch (error) {
    console.error('❌ Error fetching course reviews:', error);
    return [];
  }
}

// Get review statistics for a course
export async function getCourseReviewStats(courseId: string) {
  try {
    console.log('📊 Getting review stats for course:', courseId);
    
    const statsResult = await sql`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5
      FROM course_reviews 
      WHERE course_id = ${courseId} 
        AND status = 'active'
        AND is_public = true
    `;
    
    const stats = statsResult[0];
    
    const result = {
      average_rating: stats.average_rating ? parseFloat(stats.average_rating) : 0,
      total_reviews: parseInt(stats.total_reviews) || 0,
      rating_distribution: {
        1: parseInt(stats.rating_1) || 0,
        2: parseInt(stats.rating_2) || 0,
        3: parseInt(stats.rating_3) || 0,
        4: parseInt(stats.rating_4) || 0,
        5: parseInt(stats.rating_5) || 0
      }
    };
    
    console.log('📊 Review stats:', result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching review stats:', error);
    return {
      average_rating: 0,
      total_reviews: 0,
      rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
}

// Check if user has already reviewed a course
export async function getUserCourseReview(courseId: string, userId: string) {
  try {
    const reviews = await sql`
      SELECT * FROM course_reviews 
      WHERE course_id = ${courseId} 
        AND user_id = ${userId}
        AND status = 'active'
      LIMIT 1
    `;
    return reviews[0] || null;
  } catch (error) {
    console.error('❌ Error fetching user course review:', error);
    return null;
  }
}

// Get user's enrollment for a course
export async function getUserCourseEnrollment(courseId: string, userId: string) {
  try {
    const enrollments = await sql`
      SELECT id, status, enrolled_at 
      FROM enrollments 
      WHERE course_id = ${courseId} 
        AND user_id = ${userId}
        AND status = 'active'
      LIMIT 1
    `;
    return enrollments[0] || null;
  } catch (error) {
    console.error('❌ Error fetching user course enrollment:', error);
    return null;
  }
}

// Update a review
export async function updateReview(reviewId: string, updateData: any) {
  try {
    const result = await sql`
      UPDATE course_reviews 
      SET 
        rating = COALESCE(${updateData.rating}, rating),
        title = COALESCE(${updateData.title}, title),
        comment = COALESCE(${updateData.comment}, comment),  -- CHANGED: content → comment
        content_rating = COALESCE(${updateData.content_rating}, content_rating),
        instructor_rating = COALESCE(${updateData.instructor_rating}, instructor_rating),
        support_rating = COALESCE(${updateData.support_rating}, support_rating),
        is_edited = COALESCE(${updateData.is_edited}, is_edited),
        updated_at = NOW()
      WHERE id = ${reviewId}
      RETURNING *
    `;
    
    return {
      success: true,
      message: 'Review updated successfully',
      review: result[0] || null
    };
  } catch (error: any) {
    console.error('❌ Error updating review:', error);
    return {
      success: false,
      message: 'Failed to update review',
      error: error.message
    };
  }
}

// Delete a review (soft delete)
export async function deleteReview(reviewId: string, userId: string) {
  try {
    await sql`
      UPDATE course_reviews 
      SET status = 'removed'
      WHERE id = ${reviewId} AND user_id = ${userId}
    `;
    
    return {
      success: true,
      message: 'Review deleted successfully'
    };
  } catch (error: any) {
    console.error('❌ Error deleting review:', error);
    return {
      success: false,
      message: 'Failed to delete review',
      error: error.message
    };
  }
}

// Get reviews written by a specific user
export async function getUserReviews(userId: string) {
  try {
    const reviews = await sql`
      SELECT 
        cr.*,
        c.title as course_title,
        c.slug as course_slug,
        c.thumbnail_url as course_thumbnail
      FROM course_reviews cr
      JOIN courses c ON cr.course_id = c.id
      WHERE cr.user_id = ${userId}
        AND cr.status = 'active'
      ORDER BY cr.created_at DESC
    `;
    
    return reviews;
  } catch (error) {
    console.error('❌ Error fetching user reviews:', error);
    return [];
  }
}