
// /lib/db/queries/courses.ts

import { sql } from '../index';
import { Course, CourseTag, CreateCourseData, UpdateCourseData } from '@/types/courses';

/**
 * Get all courses with filters
 */
export async function getAllCourses(filters?: {
  category_slug?: string;
  instructor_id?: string;
  is_published?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Course[]> {
  try {
    let query = sql`
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.image as instructor_image,
        u.bio as instructor_bio,
        cat.name as category_name,
        cat.slug as category_slug

      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE 1=1
    `;

    if (filters?.category_slug) {
      query = sql`${query} AND cat.slug = ${filters.category_slug}`;
    }

    if (filters?.instructor_id) {
      query = sql`${query} AND c.instructor_id = ${filters.instructor_id}`;
    }

    if (filters?.is_published !== undefined) {
      query = sql`${query} AND c.is_published = ${filters.is_published}`;
    }

    if (filters?.is_featured) {
      query = sql`${query} AND c.is_featured = true`;
    }

    query = sql`${query} ORDER BY c.created_at DESC`;

    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }

    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const courses = await query;
    
    // Get tags for each course
    for (const course of courses) {
      const tags = await sql`
        SELECT t.* 
        FROM tags t
        JOIN course_tags ct ON t.id = ct.tag_id
        WHERE ct.course_id = ${course.id}
      `;
      course.tags = tags as CourseTag[];
    }

    return courses as Course[];
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    return [];
  }
}

/**
 * Get course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const courses = await sql`
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.image as instructor_image,
        u.bio as instructor_bio,
        cat.name as category_name,
        cat.slug as category_slug

      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ${id}
      LIMIT 1
    `;

    if (courses.length === 0) return null;

    const course = courses[0];
    
    // Get tags for the course
    const tags = await sql`
      SELECT t.* 
      FROM tags t
      JOIN course_tags ct ON t.id = ct.tag_id
      WHERE ct.course_id = ${course.id}
    `;
    
    return {
      ...course,
      tags: tags as CourseTag[]
    } as Course;
  } catch (error) {
    console.error('❌ Error fetching course by ID:', error);
    return null;
  }
}

/**
 * Get course by slug
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const courses = await sql`
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.image as instructor_image,
        u.bio as instructor_bio,
        cat.name as category_name,
        cat.slug as category_slug
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.slug = ${slug} AND c.is_published = true
      LIMIT 1
    `;

    if (courses.length === 0) return null;

    const course = courses[0];
    
    // Get tags for the course
    const tags = await sql`
      SELECT t.* 
      FROM tags t
      JOIN course_tags ct ON t.id = ct.tag_id
      WHERE ct.course_id = ${course.id}
    `;
    
    return {
      ...course,
      tags: tags as CourseTag[]
    } as Course;
  } catch (error) {
    console.error('❌ Error fetching course by slug:', error);
    return null;
  }
}

/**
 * Get instructor's courses
 */
export async function getInstructorCourses(instructorId: string): Promise<Course[]> {
  try {
    const courses = await sql`
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.image as instructor_image,
        u.bio as instructor_bio,
        cat.name as category_name,
        cat.slug as category_slug

      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.instructor_id = ${instructorId}
      ORDER BY c.created_at DESC
    `;

    // Get tags for each course
    for (const course of courses) {
      const tags = await sql`
        SELECT t.* 
        FROM tags t
        JOIN course_tags ct ON t.id = ct.tag_id
        WHERE ct.course_id = ${course.id}
      `;
      course.tags = tags as CourseTag[];
    }

    return courses as Course[];
  } catch (error) {
    console.error('❌ Error fetching instructor courses:', error);
    return [];
  }
}

/**
 * Create a new course
 */
export async function createCourse(courseData: CreateCourseData, instructorId: string): Promise<{
  success: boolean;
  message: string;
  course?: Course;
  errors?: string[];
}> {
  try {
    // Generate slug from title
    const slug = courseData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check if slug already exists
    const existing = await sql`
      SELECT id FROM courses WHERE slug = ${slug} LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: false,
        message: 'Course creation failed',
        errors: ['A course with this title already exists']
      };
    }


        const newCourse = await sql`
      INSERT INTO courses (
        slug,
        instructor_id,
        title,
        subtitle,
        description_html,
        short_description,
        learning_objectives,
        prerequisites,
        target_audience,
        category_id,
        difficulty_level,
        language,
        content_type,
        thumbnail_url,
        promo_video_url,
        materials_url,               -- ADDED
        price_cents,
        certificate_available,
        has_lifetime_access,
        allow_downloads,
        access_type,
        total_video_duration        -- ✅ ADDED: store duration (minutes)
      ) VALUES (
        ${slug},
        ${instructorId},
        ${courseData.title},
        ${courseData.subtitle},
        ${courseData.description_html},
        ${courseData.short_description},
        ${courseData.learning_objectives || []},
        ${courseData.prerequisites || []},
        ${courseData.target_audience || []},
        ${courseData.category_id},
        ${courseData.difficulty_level || 'beginner'},
        ${courseData.language || 'English'},
        ${courseData.content_type || 'video'},
        ${courseData.thumbnail_url},
        ${courseData.promo_video_url},
        ${courseData.materials_url},  -- ADDED
        ${courseData.price_cents || 0},
        ${courseData.certificate_available || false},
        ${courseData.has_lifetime_access || true},
        ${courseData.allow_downloads || false},
        ${courseData.access_type || 'open'},
        ${courseData.total_video_duration || 0}  -- ADDED
      )
      RETURNING *
    `;


    // const newCourse = await sql`
    //   INSERT INTO courses (
    //     slug,
    //     instructor_id,
    //     title,
    //     subtitle,
    //     description_html,
    //     short_description,
    //     learning_objectives,
    //     prerequisites,
    //     target_audience,
    //     category_id,
    //     difficulty_level,
    //     language,
    //     content_type,
    //     thumbnail_url,
    //     promo_video_url,
    //     price_cents,
    //     certificate_available,
    //     has_lifetime_access,
    //     allow_downloads,
    //     access_type
    //   ) VALUES (
    //     ${slug},
    //     ${instructorId},
    //     ${courseData.title},
    //     ${courseData.subtitle},
    //     ${courseData.description_html},
    //     ${courseData.short_description},
    //     ${courseData.learning_objectives || []},
    //     ${courseData.prerequisites || []},
    //     ${courseData.target_audience || []},
    //     ${courseData.category_id},
    //     ${courseData.difficulty_level || 'beginner'},
    //     ${courseData.language || 'English'},
    //     ${courseData.content_type || 'video'},
    //     ${courseData.thumbnail_url},
    //     ${courseData.promo_video_url},
    //     ${courseData.price_cents || 0},
    //     ${courseData.certificate_available || false},
    //     ${courseData.has_lifetime_access || true},
    //     ${courseData.allow_downloads || false},
    //     ${courseData.access_type || 'open'}
    //   )
    //   RETURNING *
    // `;

    const course = newCourse[0] as Course;

    // Add tags if provided
    if (courseData.tag_ids && courseData.tag_ids.length > 0) {
      for (const tagId of courseData.tag_ids) {
        await sql`
          INSERT INTO course_tags (course_id, tag_id)
          VALUES (${course.id}, ${tagId})
        `;
      }
    }

    return {
      success: true,
      message: 'Course created successfully',
      course
    };
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
 * Update course
 */
export async function updateCourse(id: string, courseData: UpdateCourseData, instructorId?: string): Promise<{
  success: boolean;
  message: string;
  course?: Course;
  errors?: string[];
}> {
  try {
    // Check if course exists and belongs to instructor (if instructorId provided)
    let courseCheck;
    if (instructorId) {
      courseCheck = await sql`
        SELECT id FROM courses WHERE id = ${id} AND instructor_id = ${instructorId} LIMIT 1
      `;
    } else {
      courseCheck = await sql`
        SELECT id FROM courses WHERE id = ${id} LIMIT 1
      `;
    }

    if (courseCheck.length === 0) {
      return {
        success: false,
        message: 'Course update failed',
        errors: ['Course not found or access denied']
      };
    }

    // Generate new slug if title is being updated
    let slug;
    if (courseData.title) {
      slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Check if new slug already exists (excluding current course)
      const existing = await sql`
        SELECT id FROM courses WHERE slug = ${slug} AND id != ${id} LIMIT 1
      `;

      if (existing.length > 0) {
        return {
          success: false,
          message: 'Course update failed',
          errors: ['A course with this title already exists']
        };
      }
    }

    const updatedCourse = await sql`
      UPDATE courses 
      SET 
        title = COALESCE(${courseData.title}, title),
        subtitle = COALESCE(${courseData.subtitle}, subtitle),
        description_html = COALESCE(${courseData.description_html}, description_html),
        short_description = COALESCE(${courseData.short_description}, short_description),
        learning_objectives = COALESCE(${courseData.learning_objectives}, learning_objectives),
        prerequisites = COALESCE(${courseData.prerequisites}, prerequisites),
        target_audience = COALESCE(${courseData.target_audience}, target_audience),
        category_id = ${courseData.category_id},
        difficulty_level = COALESCE(${courseData.difficulty_level}, difficulty_level),
        language = COALESCE(${courseData.language}, language),
        content_type = COALESCE(${courseData.content_type}, content_type),
        thumbnail_url = COALESCE(${courseData.thumbnail_url}, thumbnail_url),
        promo_video_url = COALESCE(${courseData.promo_video_url}, promo_video_url),
        materials_url = COALESCE(${courseData.materials_url}, materials_url), 
        price_cents = COALESCE(${courseData.price_cents}, price_cents),
        certificate_available = COALESCE(${courseData.certificate_available}, certificate_available),
        has_lifetime_access = COALESCE(${courseData.has_lifetime_access}, has_lifetime_access),
        allow_downloads = COALESCE(${courseData.allow_downloads}, allow_downloads),
        access_type = COALESCE(${courseData.access_type}, access_type),
        is_published = COALESCE(${courseData.is_published}, is_published),
        total_video_duration = COALESCE(${courseData.total_video_duration}, total_video_duration), -- ✅ ADDED
        slug = COALESCE(${slug}, slug),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedCourse.length === 0) {
      return {
        success: false,
        message: 'Course not found',
        errors: ['Course not found']
      };
    }

    // Update tags if provided
    if (courseData.tag_ids) {
      // Remove existing tags
      await sql`DELETE FROM course_tags WHERE course_id = ${id}`;
      
      // Add new tags
      if (courseData.tag_ids.length > 0) {
        for (const tagId of courseData.tag_ids) {
          await sql`
            INSERT INTO course_tags (course_id, tag_id)
            VALUES (${id}, ${tagId})
          `;
        }
      }
    }

    return {
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse[0] as Course
    };
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
 * Delete course
 */
export async function deleteCourse(id: string, instructorId?: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // Check if course exists and belongs to instructor (if instructorId provided)
    let courseCheck;
    if (instructorId) {
      courseCheck = await sql`
        SELECT id FROM courses WHERE id = ${id} AND instructor_id = ${instructorId} LIMIT 1
      `;
    } else {
      courseCheck = await sql`
        SELECT id FROM courses WHERE id = ${id} LIMIT 1
      `;
    }

    if (courseCheck.length === 0) {
      return {
        success: false,
        message: 'Course deletion failed',
        errors: ['Course not found or access denied']
      };
    }

    // Delete course tags first
    await sql`DELETE FROM course_tags WHERE course_id = ${id}`;

    // Delete course
    const result = await sql`
      DELETE FROM courses WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Course not found',
        errors: ['Course not found']
      };
    }

    return {
      success: true,
      message: 'Course deleted successfully'
    };
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
 * Publish course
 */
export async function publishCourse(id: string, instructorId: string): Promise<{
  success: boolean;
  message: string;
  course?: Course;
  errors?: string[];
}> {
  try {
    const result = await sql`
      UPDATE courses 
      SET 
        is_published = true,
        published_at = NOW(),
        updated_at = NOW()
      WHERE id = ${id} AND instructor_id = ${instructorId}
      RETURNING *
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Course not found or access denied',
        errors: ['Course not found or access denied']
      };
    }

    return {
      success: true,
      message: 'Course published successfully',
      course: result[0] as Course
    };
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
 * Unpublish course
 */
export async function unpublishCourse(id: string, instructorId: string): Promise<{
  success: boolean;
  message: string;
  course?: Course;
  errors?: string[];
}> {
  try {
    const result = await sql`
      UPDATE courses 
      SET 
        is_published = false,
        updated_at = NOW()
      WHERE id = ${id} AND instructor_id = ${instructorId}
      RETURNING *
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Course not found or access denied',
        errors: ['Course not found or access denied']
      };
    }

    return {
      success: true,
      message: 'Course unpublished successfully',
      course: result[0] as Course
    };
  } catch (error: any) {
    console.error('❌ Error unpublishing course:', error);
    return {
      success: false,
      message: 'Failed to unpublish course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}