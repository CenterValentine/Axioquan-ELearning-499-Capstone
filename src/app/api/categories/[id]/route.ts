
// /app/api/categories/[id]/route.ts

import { NextRequest } from 'next/server';
import { getCategoryByIdAction, updateCategoryAction, deleteCategoryAction } from '@/lib/categories/actions';
import { requireRole } from '@/lib/auth/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await getCategoryByIdAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Category not found' },
        { status: 404 }
      );
    }

    return Response.json({
      category: result.category
    });
  } catch (error: any) {
    console.error('❌ API Error fetching category:', error);
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
    const result = await updateCategoryAction(id, body);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to update category' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      category: result.category
    });
  } catch (error: any) {
    console.error('❌ API Error updating category:', error);
    
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
    const result = await deleteCategoryAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to delete category' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message
    });
  } catch (error: any) {
    console.error('❌ API Error deleting category:', error);
    
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