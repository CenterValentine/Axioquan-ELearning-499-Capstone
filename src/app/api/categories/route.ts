
// /app/api/categories/route.ts

import { NextRequest } from 'next/server';
import { getCategoriesAction, createCategoryAction } from '@/lib/categories/actions';
import { requireRole } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    const result = await getCategoriesAction(includeInactive);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to fetch categories' },
        { status: 400 }
      );
    }

    return Response.json({
      categories: result.categories
    });
  } catch (error: any) {
    console.error('❌ API Error fetching categories:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin role
    await requireRole('admin');
    
    const body = await request.json();
    const result = await createCategoryAction(body);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to create category' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      category: result.category
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ API Error creating category:', error);
    
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