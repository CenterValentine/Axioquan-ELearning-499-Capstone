// /app/api/lessons/[id]/route.ts

import { NextRequest } from 'next/server';
import { updateLessonAction, deleteLessonAction, getLessonAction } from '@/lib/courses/curriculum-actions';
import { requireRole } from '@/lib/auth/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await getLessonAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Lesson not found' },
        { status: 404 }
      );
    }

    // Type-safe access to lesson property
    const responseData: { lesson?: any } = {};
    
    if ('lesson' in result && result.lesson) {
      responseData.lesson = result.lesson;
    }

    return Response.json(responseData);
  } catch (error: any) {
    console.error('❌ API Error fetching lesson:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const body = await request.json();
    
    const result = await updateLessonAction(id, body);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to update lesson' },
        { status: 400 }
      );
    }

    // Type-safe access to lesson property
    const responseData: { message: string; lesson?: any } = {
      message: result.message
    };
    
    if ('lesson' in result && result.lesson) {
      responseData.lesson = result.lesson;
    }

    return Response.json(responseData);
  } catch (error: any) {
    console.error('❌ API Error updating lesson:', error);
    
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
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const result = await deleteLessonAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to delete lesson' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message
    });
  } catch (error: any) {
    console.error('❌ API Error deleting lesson:', error);
    
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