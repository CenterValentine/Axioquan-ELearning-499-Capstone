
// /lib/courses/curriculum-actions.ts

'use server';

import { 
  getCourseModules, 
  createModule, 
  updateModule, 
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  type Module,
  type Lesson
} from '@/lib/db/queries/curriculum';
import { requireRole } from '@/lib/auth/utils';
import { getCourseById } from '@/lib/db/queries/courses';

/**
 * Get curriculum for a course
 */
export async function getCourseCurriculumAction(courseId: string) {
  try {
    const modules = await getCourseModules(courseId, true);
    return {
      success: true,
      modules
    };
  } catch (error) {
    console.error('❌ Error fetching course curriculum:', error);
    return {
      success: false,
      message: 'Failed to fetch curriculum',
      errors: ['Failed to fetch curriculum']
    };
  }
}

/**
 * Create module action
 */
export async function createModuleAction(moduleData: {
  course_id: string;
  title: string;
  description?: string;
  order_index?: number;
  is_published?: boolean;
}) {
  try {
    // Verify user has instructor access to this course
    await requireRole(['instructor', 'admin']);
    
    const course = await getCourseById(moduleData.course_id);
    if (!course) {
      return {
        success: false,
        message: 'Course not found',
        errors: ['Course not found']
      };
    }

    const result = await createModule(moduleData);
    return result;
  } catch (error: any) {
    console.error('❌ Error creating module:', error);
    return {
      success: false,
      message: 'Failed to create module',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Update module action
 */
export async function updateModuleAction(moduleId: string, moduleData: any) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const result = await updateModule(moduleId, moduleData);
    return result;
  } catch (error: any) {
    console.error('❌ Error updating module:', error);
    return {
      success: false,
      message: 'Failed to update module',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Delete module action
 */
export async function deleteModuleAction(moduleId: string) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const result = await deleteModule(moduleId);
    return result;
  } catch (error: any) {
    console.error('❌ Error deleting module:', error);
    return {
      success: false,
      message: 'Failed to delete module',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Create lesson action
 */
export async function createLessonAction(lessonData: {
  module_id: string;
  course_id: string;
  title: string;
  description?: string;
  lesson_type: string;
  content_type?: string;
  difficulty?: string;
  order_index?: number;
}) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const result = await createLesson(lessonData);
    return result;
  } catch (error: any) {
    console.error('❌ Error creating lesson:', error);
    return {
      success: false,
      message: 'Failed to create lesson',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Update lesson action
 */
export async function updateLessonAction(lessonId: string, lessonData: any) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const result = await updateLesson(lessonId, lessonData);
    return result;
  } catch (error: any) {
    console.error('❌ Error updating lesson:', error);
    return {
      success: false,
      message: 'Failed to update lesson',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Delete lesson action
 */
export async function deleteLessonAction(lessonId: string) {
  try {
    await requireRole(['instructor', 'admin']);
    
    const result = await deleteLesson(lessonId);
    return result;
  } catch (error: any) {
    console.error('❌ Error deleting lesson:', error);
    return {
      success: false,
      message: 'Failed to delete lesson',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get lesson action
 */
export async function getLessonAction(lessonId: string) {
  try {
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      return {
        success: false,
        message: 'Lesson not found',
        errors: ['Lesson not found']
      };
    }

    return {
      success: true,
      lesson
    };
  } catch (error: any) {
    console.error('❌ Error fetching lesson:', error);
    return {
      success: false,
      message: 'Failed to fetch lesson',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}