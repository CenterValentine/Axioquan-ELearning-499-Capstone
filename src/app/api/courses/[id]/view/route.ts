
// /src/app/api/courses/[id]/view/route.ts

import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Get user IP address for anonymous tracking
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check if this view should be counted (avoid duplicates)
    const viewKey = `course_view_${id}_${session?.userId || ip}`;
    
    // For now, we'll use a simple approach - increment view count
    // In production, you might want more sophisticated tracking
    
    // Increment the total_views count in courses table
    const result = await sql`
      UPDATE courses 
      SET total_views = COALESCE(total_views, 0) + 1,
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING total_views
    `;

    if (result.length === 0) {
      return Response.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'View recorded',
      total_views: result[0].total_views
    });

  } catch (error: any) {
    console.error('❌ Error recording course view:', error);
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

    // Get current view count
    const result = await sql`
      SELECT total_views FROM courses WHERE id = ${id}
    `;

    if (result.length === 0) {
      return Response.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      total_views: result[0].total_views || 0
    });

  } catch (error: any) {
    console.error('❌ Error fetching course views:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}