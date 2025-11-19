// // /app/api/courses/route.ts

// import { NextRequest } from 'next/server';
// import { getCoursesAction, createCourseAction } from '@/lib/courses/actions';
// import { requireRole } from '@/lib/auth/utils';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const category_slug = searchParams.get('category_slug');
//     const is_published = searchParams.get('is_published') === 'true';
//     const is_featured = searchParams.get('is_featured') === 'true';
//     const limit = parseInt(searchParams.get('limit') || '50');
//     const offset = parseInt(searchParams.get('offset') || '0');
    
//     const result = await getCoursesAction({
//       category_slug: category_slug || undefined,
//       is_published,
//       is_featured,
//       limit,
//       offset
//     });
    
//     if (!result.success) {
//       return Response.json(
//         { error: result.errors?.[0] || 'Failed to fetch courses' },
//         { status: 400 }
//       );
//     }

//     return Response.json({
//       courses: result.courses
//     });
//   } catch (error: any) {
//     console.error('❌ API Error fetching courses:', error);
//     return Response.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Check instructor role - FIXED: pass array directly
//     await requireRole(['instructor', 'admin']);
    
//     const body = await request.json();
//     const result = await createCourseAction(body);
    
//     if (!result.success) {
//       return Response.json(
//         { error: result.errors?.[0] || 'Failed to create course' },
//         { status: 400 }
//       );
//     }

//     return Response.json({
//       message: result.message,
//       course: result.course
//     }, { status: 201 });
//   } catch (error: any) {
//     console.error('❌ API Error creating course:', error);
    
//     if (error.message?.includes('unauthorized')) {
//       return Response.json(
//         { error: 'Unauthorized' },
//         { status: 403 }
//       );
//     }
    
//     return Response.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

























// /app/api/courses/route.ts

import { NextRequest } from 'next/server';
import { getCoursesAction, createCourseAction } from '@/lib/courses/actions';
import { requireRole } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category_slug = searchParams.get('category_slug');
    const is_published = searchParams.get('is_published') === 'true';
    const is_featured = searchParams.get('is_featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const result = await getCoursesAction({
      category_slug: category_slug || undefined,
      is_published,
      is_featured,
      limit,
      offset
    });
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to fetch courses' },
        { status: 400 }
      );
    }

    return Response.json({
      courses: result.courses
    });
  } catch (error: any) {
    console.error('❌ API Error fetching courses:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check instructor role
    await requireRole(['instructor', 'admin']);
    
    const body = await request.json();
    
    // Debug: Log the incoming data
    console.log('📝 CREATE COURSE - Received data:', body);
    
    // Ensure optional fields are properly handled
    const processedData = {
      ...body,
      promo_video_url: body.promo_video_url || null, // Convert empty string to null
      materials_url: body.materials_url || null, // Convert empty string to null
      subtitle: body.subtitle || null,
      description_html: body.description_html || null,
      short_description: body.short_description || null,
      category_id: body.category_id || null,
    };
    
    console.log('📝 CREATE COURSE - Processed data:', processedData);
    
    const result = await createCourseAction(processedData);
    
    if (!result.success) {
      console.error('❌ CREATE COURSE - Action failed:', result.errors);
      return Response.json(
        { 
          error: result.errors?.[0] || 'Failed to create course',
          details: result.errors // Include all errors for debugging
        },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      course: result.course
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ API Error creating course:', error);
    
    if (error.message?.includes('unauthorized')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}