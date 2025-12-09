// /app/api/courses/[id]/lessons/[lessonId]/progress/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  completeLessonAction,
  updateWatchedTimeAction,
  getLessonProgressAction,
  resetLessonProgressAction,
} from "@/lib/courses/progress-actions";

interface RouteParams {
  params: Promise<{ id: string; lessonId: string }>;
}

/**
 * GET - Get lesson progress (watched time and completion status)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: courseId, lessonId } = await params;
    const result = await getLessonProgressAction(courseId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to get lesson progress",
          errors: result.errors || [],
        },
        { status: 400 }
      );
    }

    // Extract watched time for the specific lesson from the map
    if (lessonId && result.progress) {
      const lessonProgress = result.progress.get(lessonId);
      return NextResponse.json({
        watched: lessonProgress?.watched || 0,
        completed: lessonProgress?.completed || false,
        completed_at: lessonProgress?.completed_at || null,
      });
    }

    return NextResponse.json({
      progress: result.progress,
    });
  } catch (error: any) {
    console.error("API Error getting lesson progress:", error);

    if (error.message?.includes("unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST - Mark lesson as complete
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: courseId, lessonId } = await params;

    const result = await completeLessonAction(courseId, lessonId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message || "Failed to complete lesson",
          errors: result.errors || [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
      progress: result.progress,
    });
  } catch (error: any) {
    console.error("API Error completing lesson:", error);

    if (error.message?.includes("unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update watched time for a lesson
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: courseId, lessonId } = await params;
    const body = await request.json();
    const { watchedSeconds } = body;

    if (typeof watchedSeconds !== "number" || watchedSeconds < 0) {
      return NextResponse.json(
        { error: "Invalid watchedSeconds value" },
        { status: 400 }
      );
    }

    const result = await updateWatchedTimeAction(
      courseId,
      lessonId,
      watchedSeconds
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to update watched time",
          errors: result.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Watched time updated",
    });
  } catch (error: any) {
    console.error("API Error updating watched time:", error);

    if (error.message?.includes("unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Mark lesson as incomplete (reset completion)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: courseId, lessonId } = await params;

    const result = await resetLessonProgressAction(courseId, lessonId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message || "Failed to reset lesson progress",
          errors: result.errors || [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
      progress: result.progress,
    });
  } catch (error: any) {
    console.error("API Error resetting lesson progress:", error);

    if (error.message?.includes("unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
