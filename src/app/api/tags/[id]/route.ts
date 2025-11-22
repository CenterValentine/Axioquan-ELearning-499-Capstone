
// /app/api/tags/[id]/route.ts

import { NextRequest } from 'next/server';
import { getTagByIdAction, updateTagAction, deleteTagAction } from '@/lib/tags/actions';
import { requireRole } from '@/lib/auth/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await getTagByIdAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Tag not found' },
        { status: 404 }
      );
    }

    return Response.json({
      tag: result.tag
    });
  } catch (error: any) {
    console.error('❌ API Error fetching tag:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin role
    await requireRole('admin');
    
    const { id } = await params;
    const body = await request.json();
    const result = await updateTagAction(id, body);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to update tag' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      tag: result.tag
    });
  } catch (error: any) {
    console.error('❌ API Error updating tag:', error);
    
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
    // Check admin role
    await requireRole('admin');
    
    const { id } = await params;
    const result = await deleteTagAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to delete tag' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message
    });
  } catch (error: any) {
    console.error('❌ API Error deleting tag:', error);
    
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