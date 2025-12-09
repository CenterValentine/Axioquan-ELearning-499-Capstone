// /lib/courses/progress-actions.ts

'use server';

import {
  getLessonProgress,
  completeLesson,
  updateLessonWatchedTime,
} from '@/lib/db/queries/enrollments';
import { requireAuth } from '@/lib/auth/utils';

/**
 * Get lesson progress for the current user in a course
 */
export async function getLessonProgressAction(
  courseId: string
): Promise<{
  success: boolean;
  progress?: Map<
    string,
    { completed: boolean; watched: number; completed_at?: Date | string }
  >;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();

    const progress = await getLessonProgress(session.userId, courseId);

    return {
      success: true,
      progress,
    };
  } catch (error: any) {
    console.error('❌ Error getting lesson progress:', error);

    if (error.message?.includes('unauthorized') || error.message?.includes('Unauthorized')) {
      throw new Error('unauthorized');
    }

    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Mark lesson as complete for the current user
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

    return await completeLesson(session.userId, courseId, lessonId);
  } catch (error: any) {
    console.error('❌ Error completing lesson:', error);

    if (error.message?.includes('unauthorized') || error.message?.includes('Unauthorized')) {
      throw new Error('unauthorized');
    }

    return {
      success: false,
      message: 'Failed to complete lesson',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Update watched time for a lesson for the current user
 */
export async function updateWatchedTimeAction(
  courseId: string,
  lessonId: string,
  watchedSeconds: number
): Promise<{
  success: boolean;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();

    return await updateLessonWatchedTime(
      session.userId,
      courseId,
      lessonId,
      watchedSeconds
    );
  } catch (error: any) {
    console.error('❌ Error updating watched time:', error);

    if (error.message?.includes('unauthorized') || error.message?.includes('Unauthorized')) {
      throw new Error('unauthorized');
    }

    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

