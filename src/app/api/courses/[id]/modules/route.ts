// /app/api/courses/[id]/modules/route.ts

import { NextRequest } from 'next/server';
import { getCourseCurriculumAction, createModuleAction } from '@/lib/courses/curriculum-actions';
import { requireRole } from '@/lib/auth/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await getCourseCurriculumAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to fetch curriculum' },
        { status: 400 }
      );
    }

    return Response.json({
      curriculum: result.modules || []
    });
  } catch (error: any) {
    console.error('❌ API Error fetching curriculum:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const body = await request.json();
    
    const result = await createModuleAction({
      course_id: id,
      title: body.title,
      description: body.description,
      order_index: body.order_index,
      is_published: body.is_published
    });
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to create module' },
        { status: 400 }
      );
    }

    // Type-safe access to module property
    const responseData: { message: string; module?: any } = {
      message: result.message
    };
    
    if ('module' in result && result.module) {
      responseData.module = result.module;
    }

    return Response.json(responseData, { status: 201 });
  } catch (error: any) {
    console.error('❌ API Error creating module:', error);
    
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