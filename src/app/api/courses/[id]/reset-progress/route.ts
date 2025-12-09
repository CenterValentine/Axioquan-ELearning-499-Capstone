// /app/api/courses/[id]/reset-progress/route.ts

import { NextRequest, NextResponse } from "next/server";
import { resetCourseProgressAction } from "@/lib/courses/progress-actions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST - Reset course progress (delete all progress for a course)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: courseId } = await params;

    const result = await resetCourseProgressAction(courseId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message || "Failed to reset course progress",
          errors: result.errors || [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("API Error resetting course progress:", error);

    if (error.message?.includes("unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

