// /app/api/modules/[id]/route.ts

import { NextRequest } from 'next/server';
import { updateModuleAction, deleteModuleAction } from '@/lib/courses/curriculum-actions';
import { requireRole } from '@/lib/auth/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const { id } = await params;
    const body = await request.json();
    
    const result = await updateModuleAction(id, body);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to update module' },
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

    return Response.json(responseData);
  } catch (error: any) {
    console.error('❌ API Error updating module:', error);
    
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
    const result = await deleteModuleAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to delete module' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message
    });
  } catch (error: any) {
    console.error('❌ API Error deleting module:', error);
    
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