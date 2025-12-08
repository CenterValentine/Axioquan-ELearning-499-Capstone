// /src/app/api/instructors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllInstructors } from '@/lib/db/queries/instructors';

export const dynamic = 'force-dynamic';

/**
 * GET /api/instructors
 * Fetch all instructors with their profiles
 */
export async function GET(request: NextRequest) {
  try {
    const instructors = await getAllInstructors();

    return NextResponse.json(instructors, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('❌ API Error fetching instructors:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch instructors',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
