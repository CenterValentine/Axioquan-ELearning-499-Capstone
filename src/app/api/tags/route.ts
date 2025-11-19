
// /app/api/tags/route.ts

import { NextRequest } from 'next/server';
import { getTagsAction, createTagAction, getTrendingTagsAction } from '@/lib/tags/actions';
import { requireRole } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const trending = searchParams.get('trending') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let result;
    
    if (trending) {
      result = await getTrendingTagsAction(limit);
    } else {
      result = await getTagsAction({ featured, limit });
    }
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to fetch tags' },
        { status: 400 }
      );
    }

    return Response.json({
      tags: result.tags
    });
  } catch (error: any) {
    console.error('❌ API Error fetching tags:', error);
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
    const result = await createTagAction(body);
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to create tag' },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      tag: result.tag
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ API Error creating tag:', error);
    
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