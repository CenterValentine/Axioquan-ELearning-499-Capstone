
// /app/api/courses/[id]/route.ts

import { NextRequest } from 'next/server';
import { getCourseByIdAction, updateCourseAction, deleteCourseAction } from '@/lib/courses/actions';
import { requireRole } from '@/lib/auth/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await getCourseByIdAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Course not found' },
        { status: 404 }
      );
    }

    return Response.json({
      course: result.course
    });
  } catch (error: any) {
    console.error('❌ API Error fetching course:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check instructor or admin role
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const body = await request.json();
    
    // Debug: Log the incoming data
    console.log('📝 UPDATE COURSE - Received data for course', id, ':', body);
    
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
    
    console.log('📝 UPDATE COURSE - Processed data:', processedData);
    
    const result = await updateCourseAction(id, processedData);
    
    if (!result.success) {
      console.error('❌ UPDATE COURSE - Action failed:', result.errors);
      return Response.json(
        { 
          error: result.errors?.[0] || 'Failed to update course',
          details: result.errors // Include all errors for debugging
        },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      course: result.course
    });
  } catch (error: any) {
    console.error('❌ API Error updating course:', error);
    
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check instructor or admin role
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const result = await deleteCourseAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to delete course' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message
    });
  } catch (error: any) {
    console.error('❌ API Error deleting course:', error);
    
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