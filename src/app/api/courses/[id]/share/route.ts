
// /src/app/api/courses/[id]/share/route.ts

import { NextRequest } from 'next/server';
import { recordCourseShareAction, getCourseSharesAction } from '@/lib/social/actions';
import { getSession } from '@/lib/auth/session';
import { getCourseShareCount } from '@/lib/db/queries/social';

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
    const body = await request.json();
    
    if (!id) {
      return Response.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const result = await recordCourseShareAction(id, body);
    
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

    // Get updated share count
    const shareCount = await getCourseShareCount(id);
    
    return Response.json({
      ...result,
      shareCount
    });
  } catch (error: any) {
    console.error('❌ API Error recording course share:', error);
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

    const result = await getCourseSharesAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return Response.json(result);
  } catch (error: any) {
    console.error('❌ API Error fetching course shares:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}