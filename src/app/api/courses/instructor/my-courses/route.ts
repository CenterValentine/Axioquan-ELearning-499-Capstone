// /app/api/courses/instructor/my-courses/route.ts

import { NextRequest } from 'next/server';
import { getInstructorCoursesAction } from '@/lib/courses/actions';
import { requireRole } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    // Check instructor role - FIXED
    await requireRole(['instructor', 'admin']);
    
    const result = await getInstructorCoursesAction();
    
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
    console.error('❌ API Error fetching instructor courses:', error);
    
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