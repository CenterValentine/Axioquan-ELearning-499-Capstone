
// /src/app/api/courses/[id]/like/route.ts

import { NextRequest } from 'next/server';
import { toggleCourseLikeAction, getCourseLikesAction } from '@/lib/social/actions';
import { getSession } from '@/lib/auth/session';
import { getCourseLikeCount } from '@/lib/db/queries/social';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { 
          error: 'Authentication required',
          requiresAuth: true 
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const result = await toggleCourseLikeAction(id);
    
    if (!result.success) {
      if (result.requiresAuth) {
        return Response.json(
          { 
            error: result.message,
            requiresAuth: true 
          },
          { status: 401 }
        );
      }
      
      return Response.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // Get updated like count
    const likeCount = await getCourseLikeCount(id);
    
    return Response.json({
      ...result,
      likeCount
    });
  } catch (error: any) {
    console.error('❌ API Error toggling course like:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const result = await getCourseLikesAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return Response.json(result);
  } catch (error: any) {
    console.error('❌ API Error fetching course likes:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}