// /app/api/courses/[id]/publish/route.ts

import { NextRequest } from 'next/server';
import { publishCourseAction, unpublishCourseAction } from '@/lib/courses/actions';
import { requireRole } from '@/lib/auth/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Check instructor role - FIXED
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const result = await publishCourseAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to publish course' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      course: result.course
    });
  } catch (error: any) {
    console.error('❌ API Error publishing course:', error);
    
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
    // Check instructor role - FIXED
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const result = await unpublishCourseAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to unpublish course' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      course: result.course
    });
  } catch (error: any) {
    console.error('❌ API Error unpublishing course:', error);
    
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