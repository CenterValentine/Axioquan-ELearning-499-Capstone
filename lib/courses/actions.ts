// /lib/courses/actions.ts

'use server';

import { 
  getAllCourses, 
  getCourseById, 
  getCourseBySlug, 
  getInstructorCourses,
  createCourse, 
  updateCourse, 
  deleteCourse,
  publishCourse,
  unpublishCourse
} from '@/lib/db/queries/courses';
import {getCourseModules, Module} from '@/lib/db/queries/curriculum'
import {
  createEnrollment,
  cancelEnrollment,
  getEnrollmentByUserAndCourse
} from '@/lib/db/queries/enrollments';
import { requireRole, requireAuth } from '@/lib/auth/utils'; // USE requireAuth instead
import type { CreateCourseData, UpdateCourseData } from '@/types/courses';

/**
 * Get all courses (public)
 */
export async function getCoursesAction(filters?: {
  category_slug?: string;
  is_published?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{
  success: boolean;
  courses?: any[];
  errors?: string[];
}> {
  try {
    const courses = await getAllCourses(filters);
    
    return {
      success: true,
      courses
    };
  } catch (error: any) {
    console.error('❌ Error fetching courses:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get course by ID (public)
 */
export async function getCourseByIdAction(id: string): Promise<{
  success: boolean;
  course?: any;
  errors?: string[];
}> {
  try {
    const course = await getCourseById(id);
    
    if (!course) {
      return {
        success: false,
        errors: ['Course not found']
      };
    }

    return {
      success: true,
      course
    };
  } catch (error: any) {
    console.error('❌ Error fetching course:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get course by slug (public)
 */
export async function getCourseBySlugAction(slug: string): Promise<{
  success: boolean;
  course?: any;
  errors?: string[];
}> {
  try {
    const course = await getCourseBySlug(slug);
    
    if (!course) {
      return {
        success: false,
        errors: ['Course not found']
      };
    }

    return {
      success: true,
      course
    };
  } catch (error: any) {
    console.error('❌ Error fetching course:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get course modules
 */

export async function getCourseModulesAction(courseId : string): Promise <{
  success: boolean;
  modules?: Module[];
  errors?: string[];
}> {
  try {
    const modules = await getCourseModules(courseId, true);
    if (!modules){
      return {success: false,
        errors: ['No modules found']
      };
    }
    return {
      success: true,
      modules
    };
  } catch (error: any) {
    console.error('❌ Error fetching course modules:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occured'],
    }
  }
}



/**
 * Get instructor's courses
 */
export async function getInstructorCoursesAction(): Promise<{
  success: boolean;
  courses?: any[];
  errors?: string[];
}> {
  try {
    const session = await requireAuth(); // USE requireAuth instead of getSession
    
    const courses = await getInstructorCourses(session.userId);
    
    return {
      success: true,
      courses
    };
  } catch (error: any) {
    console.error('❌ Error fetching instructor courses:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Create course (instructor only)
 */
export async function createCourseAction(courseData: CreateCourseData): Promise<{
  success: boolean;
  message: string;
  course?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth(); // USE requireAuth instead of getSession
    
    // Check if user is instructor or admin
    if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
      return {
        success: false,
        message: 'Access denied',
        errors: ['Only instructors can create courses']
      };
    }

    return await createCourse(courseData, session.userId);
  } catch (error: any) {
    console.error('❌ Error creating course:', error);
    return {
      success: false,
      message: 'Failed to create course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Update course (instructor or admin)
 */
export async function updateCourseAction(id: string, courseData: UpdateCourseData): Promise<{
  success: boolean;
  message: string;
  course?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth(); // USE requireAuth instead of getSession

    // If user is admin, allow updating any course
    // If user is instructor, only allow updating their own courses
    const instructorId = session.roles.includes('admin') ? undefined : session.userId;

    return await updateCourse(id, courseData, instructorId);
  } catch (error: any) {
    console.error('❌ Error updating course:', error);
    return {
      success: false,
      message: 'Failed to update course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Delete course (instructor or admin)
 */
export async function deleteCourseAction(id: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await requireAuth(); // USE requireAuth instead of getSession

    // If user is admin, allow deleting any course
    // If user is instructor, only allow deleting their own courses
    const instructorId = session.roles.includes('admin') ? undefined : session.userId;

    return await deleteCourse(id, instructorId);
  } catch (error: any) {
    console.error('❌ Error deleting course:', error);
    return {
      success: false,
      message: 'Failed to delete course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Publish course (instructor only)
 */
export async function publishCourseAction(id: string): Promise<{
  success: boolean;
  message: string;
  course?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth(); // USE requireAuth instead of getSession

    // Only instructors can publish courses
    if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
      return {
        success: false,
        message: 'Access denied',
        errors: ['Only instructors can publish courses']
      };
    }

    return await publishCourse(id, session.userId);
  } catch (error: any) {
    console.error('❌ Error publishing course:', error);
    return {
      success: false,
      message: 'Failed to publish course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Unpublish course (instructor only)
 */
export async function unpublishCourseAction(id: string): Promise<{
  success: boolean;
  message: string;
  course?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth(); // USE requireAuth instead of getSession

    // Only instructors can unpublish courses
    if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
      return {
        success: false,
        message: 'Access denied',
        errors: ['Only instructors can unpublish courses']
      };
    }

    return await unpublishCourse(id, session.userId);
  } catch (error: any) {
    console.error('❌ Error unpublishing course:', error);
    return {
      success: false,
      message: 'Failed to unpublish course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Enroll in a course (authenticated users only)
 */
export async function createEnrollmentAction(courseId: string): Promise<{
  success: boolean;
  message: string;
  enrollment?: any;
  errors?: string[];
}> {
  'use server';
  
  // Validate input
  if (!courseId || typeof courseId !== 'string' || courseId.trim() === '') {
    console.error('❌ Invalid courseId provided:', courseId);
    return {
      success: false,
      message: 'Invalid course ID',
      errors: ['Invalid course ID provided']
    };
  }
  
  try {
    console.log('🚀 createEnrollmentAction called with courseId:', courseId);
    
    // Use getSession instead of requireAuth to avoid redirect issues
    const { getSession } = await import('@/lib/auth/session');
    const session = await getSession();
    
    if (!session || !session.userId) {
      console.log('❌ No session found in createEnrollmentAction');
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to enroll in a course']
      };
    }
    
    console.log('✅ Session found, userId:', session.userId);
    
    // Get course to get price and access type
    const course = await getCourseById(courseId);
    if (!course) {
      console.log('❌ Course not found:', courseId);
      return {
        success: false,
        message: 'Course not found',
        errors: ['Course not found']
      };
    }

    if (!course.is_published) {
      console.log('❌ Course not published:', courseId);
      return {
        success: false,
        message: 'Course not available',
        errors: ['This course is not yet published']
      };
    }

    console.log('📝 Calling createEnrollment with:', {
      userId: session.userId,
      courseId,
      priceCents: course.price_cents || 0,
      accessType: course.access_type || 'open'
    });

    let result;
    try {
      result = await createEnrollment(
        session.userId,
        courseId,
        course.price_cents || 0,
        course.access_type || 'open'
      );
      console.log('📝 createEnrollment returned:', {
        success: result?.success,
        message: result?.message,
        hasEnrollment: !!result?.enrollment,
        errors: result?.errors,
        resultType: typeof result,
        isNull: result === null,
        isUndefined: result === undefined
      });
    } catch (enrollmentError: any) {
      console.error('❌ createEnrollment threw an error:', enrollmentError);
      console.error('❌ Enrollment error details:', {
        message: enrollmentError?.message,
        stack: enrollmentError?.stack,
        name: enrollmentError?.name
      });
      return {
        success: false,
        message: 'Failed to create enrollment',
        errors: [enrollmentError?.message || 'An unexpected error occurred during enrollment']
      };
    }

    // Ensure result is always a proper object with serializable data
    if (!result) {
      console.error('❌ createEnrollment returned null/undefined');
      return {
        success: false,
        message: 'Failed to enroll in course',
        errors: ['Enrollment function returned no result']
      };
    }

    if (typeof result !== 'object') {
      console.error('❌ Invalid result type from createEnrollment:', typeof result, result);
      return {
        success: false,
        message: 'Failed to enroll in course',
        errors: ['Invalid response from enrollment service']
      };
    }

    // Ensure result has required properties
    if (typeof result.success === 'undefined') {
      console.error('❌ Result missing success property:', result);
      return {
        success: false,
        message: 'Failed to enroll in course',
        errors: ['Invalid response format from enrollment service']
      };
    }

    // Clean up enrollment object to ensure it's serializable
    const cleanedResult: {
      success: boolean;
      message: string;
      enrollment?: any;
      errors?: string[];
    } = {
      success: Boolean(result.success),
      message: String(result.message || 'Enrollment processed'),
    };

    if (result.errors && Array.isArray(result.errors)) {
      cleanedResult.errors = result.errors.map(e => String(e));
    }

    if (result.enrollment && typeof result.enrollment === 'object') {
      try {
        cleanedResult.enrollment = {
          id: String(result.enrollment.id || ''),
          user_id: String(result.enrollment.user_id || ''),
          course_id: String(result.enrollment.course_id || ''),
          status: String(result.enrollment.status || ''),
          progress_percentage: Number(result.enrollment.progress_percentage || 0)
        };
        
        if (result.enrollment.enrolled_at) {
          const date = result.enrollment.enrolled_at instanceof Date 
            ? result.enrollment.enrolled_at 
            : new Date(result.enrollment.enrolled_at);
          if (!isNaN(date.getTime())) {
            cleanedResult.enrollment.enrolled_at = date.toISOString();
          }
        }
      } catch (cleanError) {
        console.error('❌ Error cleaning enrollment object:', cleanError);
        // Don't include enrollment if it can't be cleaned
      }
    }

    console.log('✅ Returning cleaned result:', JSON.stringify(cleanedResult, null, 2));
    return cleanedResult;
  } catch (error: any) {
    console.error('❌ Error enrolling in course:', error);
    console.error('❌ Error stack:', error?.stack);
    console.error('❌ Error name:', error?.name);
    console.error('❌ Error message:', error?.message);
    
    // Handle redirect errors from requireAuth
    if (error?.digest?.startsWith('NEXT_REDIRECT') || error?.message?.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to enroll in a course']
      };
    }
    
    return {
      success: false,
      message: 'Failed to enroll in course',
      errors: [error?.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Unenroll from a course (authenticated users only)
 */
export async function cancelEnrollmentAction(courseId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    
    const result = await cancelEnrollment(session.userId, courseId);
    return result;
  } catch (error: any) {
    console.error('❌ Error unenrolling from course:', error);
    return {
      success: false,
      message: 'Failed to unenroll from course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Check if user is enrolled in a course
 */
export async function checkEnrollmentAction(courseId: string): Promise<{
  success: boolean;
  isEnrolled: boolean;
  enrollment?: any;
}> {
  try {
    const session = await requireAuth();
    
    const enrollment = await getEnrollmentByUserAndCourse(session.userId, courseId);
    
    return {
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || undefined
    };
  } catch (error: any) {
    // If not authenticated, return not enrolled
    return {
      success: true,
      isEnrolled: false
    };
  }
}