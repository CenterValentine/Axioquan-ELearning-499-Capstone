// /app/api/modules/[id]/lessons/route.ts

import { NextRequest } from 'next/server';
import { createLessonAction } from '@/lib/courses/curriculum-actions';
import { requireRole } from '@/lib/auth/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const body = await request.json();
    
    const result = await createLessonAction({
      module_id: id,
      course_id: body.course_id,
      title: body.title,
      description: body.description,
      lesson_type: body.lesson_type,
      content_type: body.content_type,
      difficulty: body.difficulty,
      order_index: body.order_index
    });
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to create lesson' },
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

    return Response.json(responseData, { status: 201 });
  } catch (error: any) {
    console.error('❌ API Error creating lesson:', error);
    
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