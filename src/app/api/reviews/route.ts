
// // /src/app/api/reviews/route.ts

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';

// // Simple in-memory store for demo (replace with database later)
// let reviewsStore: any[] = [
//   {
//     id: 'review-1',
//     course_id: 'demo-course-1',
//     user_id: 'user-1',
//     rating: 5,
//     title: 'Excellent course!',
//     content: 'This course exceeded my expectations. The instructor was knowledgeable and the content was well-structured.',
//     is_edited: false,
//     like_count: 12,
//     dislike_count: 1,
//     helpful_count: 8,
//     reply_count: 2,
//     status: 'active',
//     created_at: new Date('2024-01-15'),
//     updated_at: new Date('2024-01-15'),
//     user_name: 'John Doe',
//     user_image: null,
//     reaction_counts: {
//       like: 12,
//       helpful: 8,
//       love: 3,
//       insightful: 5,
//       funny: 1
//     },
//     user_reaction: null
//   },
//   {
//     id: 'review-2',
//     course_id: 'demo-course-1', 
//     user_id: 'user-2',
//     rating: 4,
//     title: 'Great content, but could improve pacing',
//     content: 'The course content is comprehensive and valuable. However, some sections felt rushed while others were too slow.',
//     is_edited: false,
//     like_count: 5,
//     dislike_count: 0,
//     helpful_count: 3,
//     reply_count: 1,
//     status: 'active',
//     created_at: new Date('2024-01-10'),
//     updated_at: new Date('2024-01-10'),
//     user_name: 'Sarah Smith',
//     user_image: null,
//     reaction_counts: {
//       like: 5,
//       helpful: 3,
//       love: 1,
//       insightful: 2
//     },
//     user_reaction: 'like'
//   }
// ];

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return Response.json(
//         { 
//           error: 'Authentication required',
//           requiresAuth: true 
//         },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const { course_id, rating, title, content } = body;

//     console.log('📝 Received review submission:', { course_id, rating, title, content, userId: session.userId });

//     // Validate required fields
//     if (!course_id || !rating || !content) {
//       return Response.json(
//         { error: 'Course ID, rating, and content are required' },
//         { status: 400 }
//       );
//     }

//     if (rating < 1 || rating > 5) {
//       return Response.json(
//         { error: 'Rating must be between 1 and 5' },
//         { status: 400 }
//       );
//     }

//     if (content.trim().length < 10) {
//       return Response.json(
//         { error: 'Review content must be at least 10 characters' },
//         { status: 400 }
//       );
//     }

//     // Create new review object - REMOVED is_verified field
//     const newReview = {
//       id: 'review-' + Date.now(),
//       course_id,
//       user_id: session.userId,
//       rating,
//       title: title || null,
//       content,
//       is_edited: false,
//       like_count: 0,
//       dislike_count: 0,
//       helpful_count: 0,
//       reply_count: 0,
//       status: 'active',
//       created_at: new Date(),
//       updated_at: new Date(),
//       user_name: session.name || 'Current User',
//       user_image: session.image || null,
//       reaction_counts: {},
//       user_reaction: null
//     };

//     console.log('💾 Storing new review:', newReview);

//     // Add to our in-memory store
//     reviewsStore.push(newReview);

//     console.log('📊 Total reviews in store:', reviewsStore.length);
//     console.log('🔍 Reviews for this course:', reviewsStore.filter(r => r.course_id === course_id));

//     return Response.json({
//       success: true,
//       message: 'Review submitted successfully',
//       review: newReview
//     });

//   } catch (error: any) {
//     console.error('❌ API Error creating review:', error);
//     return Response.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const courseId = searchParams.get('course_id');

//     console.log('🔍 Fetching reviews for course:', courseId);

//     if (!courseId) {
//       return Response.json(
//         { error: 'Course ID is required' },
//         { status: 400 }
//       );
//     }

//     // Filter reviews for this specific course
//     const courseReviews = reviewsStore.filter(review => review.course_id === courseId);
    
//     console.log('📋 Found reviews:', courseReviews.length);

//     // Calculate stats
//     const totalReviews = courseReviews.length;
//     const averageRating = totalReviews > 0 
//       ? courseReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
//       : 0;

//     const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     courseReviews.forEach(review => {
//       ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
//     });

//     const stats = {
//       average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
//       total_reviews: totalReviews,
//       rating_distribution: ratingDistribution
//     };

//     // Sort by newest first
//     const sortedReviews = [...courseReviews].sort((a, b) => 
//       new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//     );

//     console.log('📊 Returning stats:', stats);

//     return Response.json({
//       success: true,
//       message: 'Reviews fetched successfully',
//       reviews: sortedReviews,
//       stats
//     });

//   } catch (error: any) {
//     console.error('❌ API Error fetching reviews:', error);
//     return Response.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }























// // /src/app/api/reviews/route.ts

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { createReview, getCourseReviews, getCourseReviewStats, getUserCourseReview } from '@/lib/db/queries/reviews';

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return Response.json(
//         { 
//           error: 'Authentication required',
//           requiresAuth: true 
//         },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const { course_id, rating, title, content } = body;

//     console.log('📝 Received review submission:', { course_id, rating, title, content, userId: session.userId });

//     // Validate required fields
//     if (!course_id || !rating || !content) {
//       return Response.json(
//         { error: 'Course ID, rating, and content are required' },
//         { status: 400 }
//       );
//     }

//     if (rating < 1 || rating > 5) {
//       return Response.json(
//         { error: 'Rating must be between 1 and 5' },
//         { status: 400 }
//       );
//     }

//     if (content.trim().length < 10) {
//       return Response.json(
//         { error: 'Review content must be at least 10 characters' },
//         { status: 400 }
//       );
//     }

//     // Check if user has already reviewed this course
//     const existingReview = await getUserCourseReview(course_id, session.userId);
//     if (existingReview) {
//       return Response.json(
//         { error: 'You have already reviewed this course' },
//         { status: 400 }
//       );
//     }

//     console.log('💾 Creating review in DATABASE...');

//     // Create review in ACTUAL DATABASE
//     const result = await createReview({
//       course_id,
//       user_id: session.userId,
//       rating,
//       title: title || undefined,
//       content: content.trim()
//     });

//     if (!result.success) {
//       return Response.json(
//         { error: result.error || 'Failed to create review' },
//         { status: 500 }
//       );
//     }

//     console.log('✅ Review saved to DATABASE successfully');

//     return Response.json({
//       success: true,
//       message: 'Review submitted successfully',
//       review: result.review
//     });

//   } catch (error: any) {
//     console.error('❌ API Error creating review:', error);
//     return Response.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const courseId = searchParams.get('course_id');

//     console.log('🔍 Fetching reviews from DATABASE for course:', courseId);

//     if (!courseId) {
//       return Response.json(
//         { error: 'Course ID is required' },
//         { status: 400 }
//       );
//     }

//     // Fetch reviews from ACTUAL DATABASE
//     const reviews = await getCourseReviews(courseId);
//     const stats = await getCourseReviewStats(courseId);

//     console.log('📋 Found reviews in DATABASE:', reviews.length);
//     console.log('📊 Database stats:', stats);

//     return Response.json({
//       success: true,
//       message: 'Reviews fetched successfully',
//       reviews,
//       stats
//     });

//   } catch (error: any) {
//     console.error('❌ API Error fetching reviews:', error);
//     return Response.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }




















// /src/app/api/reviews/route.ts (UPDATED - Strict enrollment check)

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { 
  createReview, 
  getUserCourseReview 
} from '@/lib/db/queries/reviews';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { 
          error: 'Authentication required',
          requiresAuth: true 
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { course_id, rating, title, comment, enrollment_id } = body; // CHANGED: content → comment

    // Validate required fields
    if (!course_id || !rating || !comment) {
      return Response.json(
        { error: 'Course ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      return Response.json(
        { error: 'Review comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this course
    const existingReview = await getUserCourseReview(course_id, session.userId);
    if (existingReview) {
      return Response.json(
        { error: 'You have already reviewed this course' },
        { status: 400 }
      );
    }

    // Create the review in database
    const result = await createReview({
      course_id,
      user_id: session.userId,
      enrollment_id, // Pass the enrollment_id
      rating,
      title: title?.trim() || undefined,
      comment: comment.trim() // CHANGED: content → comment
    });

    if (!result.success) {
      // Handle enrollment-specific errors
      if (result.message.includes('enrollment') || result.message.includes('Enrollment')) {
        return Response.json(
          { error: 'You must be enrolled in this course to submit a review' },
          { status: 400 }
        );
      }
      
      return Response.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: 'Review submitted successfully',
      review: result.review
    });

  } catch (error: any) {
    console.error('❌ API Error creating review:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}