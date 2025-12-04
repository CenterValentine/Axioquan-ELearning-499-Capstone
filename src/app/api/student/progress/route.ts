// /app/api/student/progress/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getEnrollmentProgressAction } from "@/lib/courses/progress-actions";

/**
 * GET - Get updated enrollment progress for all enrolled courses
 * Returns a map of courseId -> progress percentage
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getEnrollmentProgressAction();

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to get enrollment progress",
          errors: result.errors || [],
        },
        { status: 400 }
      );
    }

    // Convert Map to object for JSON serialization
    const progressObject: Record<string, number> = {};
    if (result.progress) {
      result.progress.forEach((value, key) => {
        progressObject[key] = value;
      });
    }

    return NextResponse.json({
      success: true,
      progress: progressObject,
    });
  } catch (error: any) {
    console.error("API Error getting enrollment progress:", error);

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
