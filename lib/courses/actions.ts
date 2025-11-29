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
import { getCourseCurriculum } from '@/lib/db/queries/curriculum';
import { createEnrollment, cancelEnrollment, getEnrollmentByUserAndCourse } from '@/lib/db/queries/enrollments';
import { requireAuth } from '@/lib/auth/utils';
import { getSession } from '@/lib/auth/session';
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
 * Get course curriculum (public)
 */
export async function getCourseCurriculumAction(courseId: string): Promise<{
  success: boolean;
  curriculum?: any[];
  errors?: string[];
}> {
  try {
    const curriculum = await getCourseCurriculum(courseId);
    
    return {
      success: true,
      curriculum
    };
  } catch (error: any) {
    console.error('❌ Error fetching course curriculum:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred'],
      curriculum: []
    };
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
    const session = await requireAuth();
    
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
    const session = await requireAuth();
    
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
    const session = await requireAuth();

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
    const session = await requireAuth();

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
    const session = await requireAuth();

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
    const session = await requireAuth();

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
 * Create enrollment (authenticated users only)
 */
export async function createEnrollmentAction(courseId: string): Promise<{
  success: boolean;
  message: string;
  enrollment?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();

    // Get course to retrieve price and access type
    const course = await getCourseById(courseId);
    
    if (!course) {
      return {
        success: false,
        message: 'Course not found',
        errors: ['Course not found']
      };
    }

    // Check if course is published
    if (!course.is_published) {
      return {
        success: false,
        message: 'Course not available',
        errors: ['This course is not currently available for enrollment']
      };
    }

    const priceCents = course.price_cents || 0;
    const accessType = course.access_type || 'open';

    return await createEnrollment(session.userId, courseId, priceCents, accessType);
  } catch (error: any) {
    console.error('❌ Error creating enrollment:', error);
    return {
      success: false,
      message: 'Failed to enroll in course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Cancel enrollment (authenticated users only)
 */
export async function cancelEnrollmentAction(courseId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();

    return await cancelEnrollment(session.userId, courseId);
  } catch (error: any) {
    console.error('❌ Error cancelling enrollment:', error);
    return {
      success: false,
      message: 'Failed to unenroll from course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Check enrollment status for current user (works for both authenticated and unauthenticated users)
 */
export async function checkEnrollmentAction(courseId: string): Promise<{
  success: boolean;
  isEnrolled: boolean;
  errors?: string[];
}> {
  try {
    const session = await getSession();

    // If user is not authenticated, they are not enrolled
    if (!session) {
      return {
        success: true,
        isEnrolled: false
      };
    }

    // Check if user has an active enrollment for this course
    const enrollment = await getEnrollmentByUserAndCourse(session.userId, courseId);

    return {
      success: true,
      isEnrolled: !!enrollment
    };
  } catch (error: any) {
    console.error('❌ Error checking enrollment:', error);
    return {
      success: false,
      isEnrolled: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}