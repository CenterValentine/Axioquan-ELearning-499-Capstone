// /lib/db/queries/enrollments.ts

import { sql } from "../index";

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
    console.error("❌ Error fetching user enrolled courses:", error);
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
    console.error("❌ Error fetching enrollment:", error);
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
  accessType: string = "open"
): Promise<{
  success: boolean;
  message: string;
  enrollment?: any;
  errors?: string[];
}> {
  try {
    console.log("📝 createEnrollment called:", {
      userId,
      courseId,
      priceCents,
      accessType,
    });

    // Check if active enrollment already exists
    const existing = await getEnrollmentByUserAndCourse(userId, courseId);
    if (existing) {
      console.log("⚠️ Active enrollment already exists");
      return {
        success: false,
        message: "Already enrolled",
        errors: ["You are already enrolled in this course"],
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
            access_type = ${accessType || "open"},
            last_activity_at = NOW()
        WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'cancelled'
        RETURNING *
      `;

      if (reactivated.length === 0) {
        console.error("❌ Failed to reactivate cancelled enrollment");
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
          message: "Successfully re-enrolled in course",
          enrollment: reactivated[0],
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
        message: "Course not found",
        errors: ["Course not found"],
      };
    }

    console.log("📝 Creating new enrollment...");
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
        ${accessType || course[0].access_type || "open"},
        'web',
        'active',
        0,
        ${course[0].total_lessons || 0},
        0
      )
      RETURNING *
    `;

    console.log(
      "✅ Enrollment created:",
      newEnrollment.length > 0 ? "Success" : "Failed"
    );

    if (!newEnrollment || newEnrollment.length === 0) {
      console.error("❌ Enrollment insert returned no rows");
      return {
        success: false,
        message: "Failed to create enrollment",
        errors: ["Database error: Enrollment was not created"],
      };
    }

    // Update course enrolled_students_count
    await sql`
      UPDATE courses
      SET enrolled_students_count = enrolled_students_count + 1
      WHERE id = ${courseId}
    `;

    console.log("✅ Enrollment process completed successfully");
    return {
      success: true,
      message: "Successfully enrolled in course",
      enrollment: newEnrollment[0],
    };
  } catch (error: any) {
    console.error("❌ Error creating enrollment:", error);
    console.error("❌ Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return {
      success: false,
      message: "Failed to enroll in course",
      errors: [error?.message || "An unexpected error occurred"],
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
        message: "Enrollment not found",
        errors: ["Enrollment not found"],
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
      message: "Successfully unenrolled from course",
    };
  } catch (error: any) {
    console.error("❌ Error cancelling enrollment:", error);
    return {
      success: false,
      message: "Failed to unenroll from course",
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}

/**
 * Get lesson progress for a user in a course
 * Uses the existing user_progress table
 * Returns a map of lesson_id -> { completed, watched }
 */
export async function getLessonProgress(
  userId: string,
  courseId: string
): Promise<
  Map<
    string,
    { completed: boolean; watched: number; completed_at?: Date | string }
  >
> {
  try {
    // Verify enrollment exists
    const enrollment = await getEnrollmentByUserAndCourse(userId, courseId);
    if (!enrollment) {
      return new Map();
    }

    // Get progress from user_progress table, filtered by lessons in this course
    // Note: lesson_id is UUID in the actual table
    try {
      const progressRows = await sql`
        SELECT 
          up.lesson_id,
          up.is_completed as completed,
          up.completed_at,
          up.last_accessed_at,
          up.time_spent as watched
        FROM user_progress up
        INNER JOIN lessons l ON up.lesson_id = l.id
        WHERE up.user_id = ${userId}::uuid
          AND l.course_id = ${courseId}::uuid
      `;

      const progressMap = new Map<
        string,
        { completed: boolean; watched: number; completed_at?: Date | string }
      >();

      for (const row of progressRows) {
        // The actual table has time_spent (integer) for watched time
        progressMap.set(row.lesson_id.toString(), {
          completed: row.completed || false,
          watched: row.watched || 0, // Use time_spent from the table
          completed_at: row.completed_at,
        });
      }

      return progressMap;
    } catch (error: any) {
      // Table might not exist yet, return empty map
      if (
        error.message?.includes("does not exist") ||
        error.message?.includes("relation")
      ) {
        return new Map();
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ Error fetching lesson progress:", error);
    return new Map();
  }
}

/**
 * Mark lesson as complete and update enrollment progress
 */
export async function completeLesson(
  userId: string,
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
    // Get enrollment
    const enrollment = await getEnrollmentByUserAndCourse(userId, courseId);
    if (!enrollment) {
      return {
        success: false,
        message: "Enrollment not found",
        errors: ["You are not enrolled in this course"],
      };
    }

    // Get total published lessons count for the course (dynamic count for accuracy)
    const totalLessonsResult = await sql`
      SELECT COUNT(*) as count
      FROM lessons
      WHERE course_id = ${courseId}::uuid AND is_published = true
    `;
    const totalLessons = parseInt(totalLessonsResult[0]?.count || "0", 10);

    // Get module_id for this lesson
    const lessonData = await sql`
      SELECT module_id FROM lessons WHERE id = ${lessonId} LIMIT 1
    `;
    if (lessonData.length === 0) {
      return {
        success: false,
        message: "Lesson not found",
        errors: ["Lesson not found"],
      };
    }
    const moduleId = lessonData[0].module_id;

    // Insert or update user_progress record
    // Note: The actual table has UUID for id and lesson_id, and requires course_id and enrollment_id
    try {
      // Check if record already exists
      const existing = await sql`
        SELECT id FROM user_progress
        WHERE user_id = ${userId}::uuid AND lesson_id = ${lessonId}::uuid
        LIMIT 1
      `;

      if (existing.length > 0) {
        // Update existing record
        await sql`
          UPDATE user_progress
          SET 
            is_completed = true,
            completed_at = COALESCE(completed_at, NOW()),
            last_accessed_at = NOW()
          WHERE user_id = ${userId}::uuid AND lesson_id = ${lessonId}::uuid
        `;
      } else {
        // Insert new record
        // The actual table requires: user_id, lesson_id, course_id, enrollment_id
        // id is UUID and auto-generated, so we don't include it
        await sql`
          INSERT INTO user_progress (
            user_id,
            lesson_id,
            course_id,
            enrollment_id,
            is_completed,
            completed_at,
            last_accessed_at
          ) VALUES (
            ${userId}::uuid,
            ${lessonId}::uuid,
            ${courseId}::uuid,
            ${enrollment.id}::uuid,
            true,
            NOW(),
            NOW()
          )
        `;
      }
    } catch (error: any) {
      console.error("Error inserting/updating user_progress:", error);

      // If table doesn't exist, return helpful error
      if (
        error.message?.includes("does not exist") ||
        error.message?.includes("relation") ||
        error.code === "42P01"
      ) {
        return {
          success: false,
          message: "Database table not found",
          errors: ["Please contact support. Database migration required."],
        };
      }

      // Return a more descriptive error
      return {
        success: false,
        message: "Failed to update lesson progress",
        errors: [error.message || error.detail || "Database error occurred"],
      };
    }

    // Count completed lessons for this course using user_progress
    const completedCountResult = await sql`
        SELECT COUNT(*) as count
        FROM user_progress up
        INNER JOIN lessons l ON up.lesson_id = l.id
        WHERE up.user_id = ${userId}::uuid
          AND l.course_id = ${courseId}::uuid
          AND up.is_completed = true
      `;
    const completedLessons = parseInt(
      completedCountResult[0]?.count || "0",
      10
    );

    // Calculate module progress for the current module
    const moduleLessonsResult = await sql`
      SELECT COUNT(*) as total
      FROM lessons
      WHERE module_id = ${moduleId} AND is_published = true
    `;
    const moduleTotalLessons = parseInt(
      moduleLessonsResult[0]?.total || "0",
      10
    );

    const moduleCompletedResult = await sql`
        SELECT COUNT(*) as count
        FROM user_progress up
        INNER JOIN lessons l ON up.lesson_id = l.id
        WHERE up.user_id = ${userId}::uuid
          AND up.is_completed = true
          AND l.module_id = ${moduleId}::uuid
          AND l.is_published = true
      `;
    const moduleCompletedLessons = parseInt(
      moduleCompletedResult[0]?.count || "0",
      10
    );

    const moduleProgress =
      moduleTotalLessons > 0
        ? Math.round((moduleCompletedLessons / moduleTotalLessons) * 100)
        : 0;

    // Calculate overall progress using the same method as CourseLearningPageV2:
    // Average of all module progress percentages (treats modules equally)
    const modulesResult = await sql`
      SELECT m.id, m.title
      FROM modules m
      WHERE m.course_id = ${courseId}::uuid AND m.is_published = true
      ORDER BY m.order_index ASC
    `;

    let totalModuleProgress = 0;
    let moduleCount = 0;

    for (const moduleRow of modulesResult) {
      const modId = moduleRow.id;

      // Get total lessons in this module
      const modTotalResult = await sql`
        SELECT COUNT(*) as total
        FROM lessons
        WHERE module_id = ${modId}::uuid AND is_published = true
      `;
      const modTotalLessons = parseInt(modTotalResult[0]?.total || "0", 10);

      if (modTotalLessons > 0) {
        // Get completed lessons in this module
        const modCompletedResult = await sql`
          SELECT COUNT(*) as count
          FROM user_progress up
          INNER JOIN lessons l ON up.lesson_id = l.id
          WHERE up.user_id = ${userId}::uuid
            AND up.is_completed = true
            AND l.module_id = ${modId}::uuid
            AND l.is_published = true
        `;
        const modCompletedLessons = parseInt(
          modCompletedResult[0]?.count || "0",
          10
        );

        const modProgress = Math.round(
          (modCompletedLessons / modTotalLessons) * 100
        );
        totalModuleProgress += modProgress;
        moduleCount++;
      }
    }

    // Calculate overall progress as average of module progress percentages
    const overallProgress =
      moduleCount > 0 ? Math.round(totalModuleProgress / moduleCount) : 0;

    // Update enrollment progress
    await sql`
      UPDATE enrollments
      SET 
        completed_lessons = ${completedLessons},
        progress_percentage = ${overallProgress},
        last_activity_at = NOW()
      WHERE id = ${enrollment.id}
    `;

    return {
      success: true,
      message: "Lesson marked as complete",
      progress: {
        moduleProgress,
        overallProgress,
        completedLessons,
      },
    };
  } catch (error: any) {
    console.error("❌ Error completing lesson:", error);
    console.error("❌ Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
    });
    return {
      success: false,
      message: "Failed to complete lesson",
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}

/**
 * Update lesson watched time
 * Note: user_progress table doesn't have watched_seconds field
 * This function updates last_accessed_at to track access
 * If you need watched_seconds, you'll need to add that column to user_progress table
 */
export async function updateLessonWatchedTime(
  userId: string,
  courseId: string,
  lessonId: string,
  watchedSeconds: number
): Promise<{ success: boolean; errors?: string[] }> {
  try {
    // Get enrollment to verify user is enrolled
    const enrollment = await getEnrollmentByUserAndCourse(userId, courseId);
    if (!enrollment) {
      return {
        success: false,
        errors: ["You are not enrolled in this course"],
      };
    }

    try {
      // Update last_accessed_at in user_progress
      // The actual table has time_spent (integer) for watched time
      // We need enrollment_id and course_id for inserts

      // Get enrollment to get enrollment_id
      const enrollment = await getEnrollmentByUserAndCourse(userId, courseId);
      if (!enrollment) {
        return { success: true }; // Return success to avoid breaking the UI
      }

      // Check if record exists first
      const existing = await sql`
        SELECT id FROM user_progress
        WHERE user_id = ${userId}::uuid AND lesson_id = ${lessonId}::uuid
        LIMIT 1
      `;

      if (existing.length > 0) {
        // Update existing record - update time_spent and last_accessed_at
        await sql`
          UPDATE user_progress
          SET 
            last_accessed_at = NOW(),
            time_spent = COALESCE(time_spent, 0) + ${watchedSeconds}
          WHERE user_id = ${userId}::uuid AND lesson_id = ${lessonId}::uuid
        `;
      } else {
        // Insert new record (just for tracking access, not completion)
        await sql`
          INSERT INTO user_progress (
            user_id,
            lesson_id,
            course_id,
            enrollment_id,
            last_accessed_at,
            time_spent
          ) VALUES (
            ${userId}::uuid,
            ${lessonId}::uuid,
            ${courseId}::uuid,
            ${enrollment.id}::uuid,
            NOW(),
            ${watchedSeconds}
          )
        `;
      }

      return { success: true };
    } catch (error: any) {
      // If table doesn't exist, silently fail
      if (
        error.message?.includes("does not exist") ||
        error.message?.includes("relation")
      ) {
        return { success: true }; // Return success to avoid breaking the UI
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error updating watched time:", error);
    return {
      success: false,
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}
