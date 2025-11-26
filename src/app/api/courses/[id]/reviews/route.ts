
// // /src/app/api/courses/[id]/reviews/route.ts

// // /src/app/api/courses/[id]/reviews/route.ts

// import { NextRequest } from 'next/server';

// interface RouteParams {
//   params: Promise<{ id: string }>;
// }

// export async function GET(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
    
//     console.log('🎯 Fetching reviews for course:', id);
    
//     if (!id) {
//       return Response.json(
//         { error: 'Course ID is required' },
//         { status: 400 }
//       );
//     }

//     // Fetch from the main reviews API
//     const baseUrl = new URL(request.url).origin;
//     const response = await fetch(`${baseUrl}/api/reviews?course_id=${id}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch reviews: ${response.status}`);
//     }

//     const data = await response.json();
    
//     console.log('✅ Course reviews API response:', {
//       success: data.success,
//       reviewsCount: data.reviews?.length,
//       stats: data.stats
//     });

//     return Response.json(data);

//   } catch (error: any) {
//     console.error('❌ API Error fetching course reviews:', error);
    
//     // Return empty data instead of mock data
//     return Response.json({
//       success: true,
//       message: 'No reviews found',
//       reviews: [],
//       stats: {
//         average_rating: 0,
//         total_reviews: 0,
//         rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
//       }
//     });
//   }
// }



















// /src/app/api/courses/[id]/reviews/route.ts

import { NextRequest } from 'next/server';
import { getCourseReviews, getCourseReviewStats } from '@/lib/db/queries/reviews';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    console.log('🎯 Fetching reviews from DATABASE for course:', id);
    
    if (!id) {
      return Response.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Fetch directly from DATABASE
    const reviews = await getCourseReviews(id);
    const stats = await getCourseReviewStats(id);
    
    console.log('✅ Course reviews from DATABASE:', {
      success: true,
      reviewsCount: reviews.length,
      stats
    });

    return Response.json({
      success: true,
      message: 'Reviews fetched successfully',
      reviews,
      stats
    });

  } catch (error: any) {
    console.error('❌ API Error fetching course reviews:', error);
    
    // Return empty data on error
    return Response.json({
      success: true,
      message: 'No reviews found',
      reviews: [],
      stats: {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    });
  }
}