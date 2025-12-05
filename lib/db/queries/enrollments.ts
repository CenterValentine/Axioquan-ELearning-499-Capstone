// /lib/db/queries/enrollments.ts

import { sql } from '../index';

/**
 * Get all active course enrollments for a user, joined with course and category data.
 * This is intentionally a low-level DB helper – mapping to UI shapes should be done
 * in the calling layer (e.g. server components or actions).
 */
export async function getUserEnrolledCourses(userId: string): Promise<any[]> {
  try {
    const rows = await sql`
      SELECT 
        -- Course fields
        c.id,
        c.slug,
        c.title,
        c.subtitle,
        c.short_description,
        c.description_html,
        c.difficulty_level,
        c.language,
        c.content_type,
        c.price_cents,
        c.is_published,
        c.is_featured,
        c.total_video_duration,
        c.total_lessons,
        c.total_quizzes,
        c.enrolled_students_count,
        c.average_rating,
        c.review_count,
        c.thumbnail_url,
        c.promo_video_url,
        c.certificate_available,
        c.created_at,
        c.updated_at,
        -- Enrollment fields
        e.progress_percentage as progress,
        e.status as enrollment_status,
        e.enrolled_at,
        e.last_accessed_at,
        e.current_lesson_id,
        e.current_module_id,
        e.completed_lessons,
        e.total_time_spent,
        -- Instructor fields
        u.name as instructor_name,
        u.email as instructor_email,
        u.image as instructor_image,
        u.bio as instructor_bio,
        -- Category fields
        cat.name as category_name,
        cat.slug as category_slug,
        -- Computed counts
        (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) as module_count,
        (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id AND l.is_published = true) as published_lessons_count
      FROM enrollments e
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE e.user_id = ${userId} AND e.status = 'active'
      ORDER BY e.enrolled_at DESC;
    `;

    return rows as any[];
  } catch (error) {
    console.error('❌ Error fetching user enrolled courses:', error);
    return [];
  }
}

/**
 * Get enrollment for a specific user and course
 */
export async function getEnrollmentByUserAndCourse(
  userId: string,
  courseId: string
): Promise<any | null> {
  try {
    const rows = await sql`
      SELECT * FROM enrollments
      WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'active'
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('❌ Error fetching enrollment:', error);
    return null;
  }
}

/**
 * Create a new enrollment
 */
export async function createEnrollment(
  userId: string,
  courseId: string,
  priceCents: number,
  accessType: string = 'open'
): Promise<{ success: boolean; message: string; enrollment?: any; errors?: string[] }> {
  try {
    console.log('📝 createEnrollment called:', { userId, courseId, priceCents, accessType });
    
    // Check if active enrollment already exists
    const existing = await getEnrollmentByUserAndCourse(userId, courseId);
    if (existing) {
      console.log('⚠️ Active enrollment already exists');
      return {
        success: false,
        message: 'Already enrolled',
        errors: ['You are already enrolled in this course']
      };
    }

    // Check if there's a cancelled enrollment that we can reactivate
    const cancelledEnrollment = await sql`
      SELECT * FROM enrollments
      WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'cancelled'
      LIMIT 1
    `;

    if (cancelledEnrollment.length > 0) {
      // Reactivate the cancelled enrollment
      const reactivated = await sql`
        UPDATE enrollments
        SET status = 'active',
            enrolled_at = NOW(),
            enrolled_price_cents = ${priceCents},
            access_type = ${accessType || 'open'},
            last_activity_at = NOW()
        WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'cancelled'
        RETURNING *
      `;

      if (reactivated.length === 0) {
        console.error('❌ Failed to reactivate cancelled enrollment');
        // Fall through to create new enrollment
      } else {
        // Update course enrolled_students_count
        await sql`
          UPDATE courses
          SET enrolled_students_count = enrolled_students_count + 1
          WHERE id = ${courseId}
        `;

        return {
          success: true,
          message: 'Successfully re-enrolled in course',
          enrollment: reactivated[0]
        };
      }
    }

    // Get course data for enrollment defaults
    const course = await sql`
      SELECT total_lessons, access_type FROM courses WHERE id = ${courseId} LIMIT 1
    `;
    
    if (course.length === 0) {
      return {
        success: false,
        message: 'Course not found',
        errors: ['Course not found']
      };
    }

    console.log('📝 Creating new enrollment...');
    const newEnrollment = await sql`
      INSERT INTO enrollments (
        user_id,
        course_id,
        enrolled_price_cents,
        access_type,
        enrollment_source,
        status,
        progress_percentage,
        total_lessons,
        completed_lessons
      ) VALUES (
        ${userId},
        ${courseId},
        ${priceCents},
        ${accessType || course[0].access_type || 'open'},
        'web',
        'active',
        0,
        ${course[0].total_lessons || 0},
        0
      )
      RETURNING *
    `;

    console.log('✅ Enrollment created:', newEnrollment.length > 0 ? 'Success' : 'Failed');

    if (!newEnrollment || newEnrollment.length === 0) {
      console.error('❌ Enrollment insert returned no rows');
      return {
        success: false,
        message: 'Failed to create enrollment',
        errors: ['Database error: Enrollment was not created']
      };
    }

    // Update course enrolled_students_count
    await sql`
      UPDATE courses
      SET enrolled_students_count = enrolled_students_count + 1
      WHERE id = ${courseId}
    `;

    console.log('✅ Enrollment process completed successfully');
    return {
      success: true,
      message: 'Successfully enrolled in course',
      enrollment: newEnrollment[0]
    };
  } catch (error: any) {
    console.error('❌ Error creating enrollment:', error);
    console.error('❌ Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    return {
      success: false,
      message: 'Failed to enroll in course',
      errors: [error?.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Cancel/unenroll from a course (soft delete - sets status to 'cancelled')
 */
export async function cancelEnrollment(
  userId: string,
  courseId: string
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  try {
    const result = await sql`
      UPDATE enrollments
      SET status = 'cancelled',
          last_activity_at = NOW()
      WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'active'
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Enrollment not found',
        errors: ['Enrollment not found']
      };
    }

    // Update course enrolled_students_count
    await sql`
      UPDATE courses
      SET enrolled_students_count = GREATEST(enrolled_students_count - 1, 0)
      WHERE id = ${courseId}
    `;

    return {
      success: true,
      message: 'Successfully unenrolled from course'
    };
  } catch (error: any) {
    console.error('❌ Error cancelling enrollment:', error);
    return {
      success: false,
      message: 'Failed to unenroll from course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}


