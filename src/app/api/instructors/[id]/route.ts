// /src/app/api/instructors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getInstructorById } from '@/lib/db/queries/instructors';

export const dynamic = 'force-dynamic';

/**
 * GET /api/instructors/:id
 * Fetch single instructor with courses
 * FIXED: Added await for params (Next.js 15 requirement)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ FIX: Await the params Promise
    const { id: instructorId } = await params;

    if (!instructorId) {
      return NextResponse.json(
        { error: 'Instructor ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching instructor with ID:', instructorId);

    const instructor = await getInstructorById(instructorId);

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    console.log('✅ Successfully fetched instructor:', instructor.name);

    return NextResponse.json(instructor, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('❌ API Error fetching instructor:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch instructor',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}