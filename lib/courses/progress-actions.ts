// /lib/courses/progress-actions.ts

"use server";

import { requireAuth } from "@/lib/auth/utils";
import {
  completeLesson as completeLessonQuery,
  updateLessonWatchedTime as updateWatchedTimeQuery,
  getLessonProgress as getLessonProgressQuery,
} from "@/lib/db/queries/enrollments";

/**
 * Mark a lesson as complete
 */
export async function completeLessonAction(
  courseId: string,
  lessonId: string
): Promise<{
  success: boolean;
  message: string;
  progress?: {
    moduleProgress: number;
    overallProgress: number;
    completedLessons: number;
  };
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    const userId = session.userId;

    const result = await completeLessonQuery(userId, courseId, lessonId);
    return result;
  } catch (error: any) {
    console.error("Error in completeLessonAction:", error);
    return {
      success: false,
      message: "Failed to complete lesson",
      errors: [error.message || error.detail || "An unexpected error occurred"],
    };
  }
}

/**
 * Update watched time for a lesson
 */
export async function updateWatchedTimeAction(
  courseId: string,
  lessonId: string,
  watchedSeconds: number
): Promise<{ success: boolean; errors?: string[] }> {
  try {
    const session = await requireAuth();
    const userId = session.userId;

    const result = await updateWatchedTimeQuery(
      userId,
      courseId,
      lessonId,
      watchedSeconds
    );
    return result;
  } catch (error: any) {
    console.error("Error in updateWatchedTimeAction:", error);
    return {
      success: false,
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}

/**
 * Get lesson progress for a user in a course
 */
export async function getLessonProgressAction(courseId: string): Promise<{
  success: boolean;
  progress?: Map<
    string,
    { completed: boolean; watched: number; completed_at?: Date | string }
  >;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    const userId = session.userId;

    const progressMap = await getLessonProgressQuery(userId, courseId);

    return {
      success: true,
      progress: progressMap,
    };
  } catch (error: any) {
    console.error("Error in getLessonProgressAction:", error);
    return {
      success: false,
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}
