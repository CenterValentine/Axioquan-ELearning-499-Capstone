// /lib/db/queries/curriculum.ts

import { sql } from "../index";

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  slug: string;
  order_index: number;
  is_published: boolean;
  is_preview_available: boolean;
  is_required: boolean;
  estimated_duration: number;
  lesson_count: number;
  video_duration: number;
  learning_objectives: string[];
  key_concepts: string[];
  created_at: Date | string; // Date in DB queries, string when serialized from server actions
  updated_at: Date | string; // Date in DB queries, string when serialized from server actions
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string | null;
  lesson_type:
    | "video"
    | "text"
    | "document"
    | "quiz"
    | "assignment"
    | "live_session"
    | "audio"
    | "interactive"
    | "code"
    | "discussion";
  content_type: "free" | "premium" | "trial";
  difficulty: string;
  video_url: string | null;
  video_duration: number;
  video_thumbnail: string | null;
  video_quality: any;
  document_url: string | null;
  document_type: string | null;
  document_size: number;
  audio_url: string | null;
  audio_duration: number;
  content_html: string | null;
  interactive_content: any;
  code_environment: any;
  has_transcript: boolean;
  has_captions: boolean;
  has_interactive_exercises: boolean;
  has_downloadable_resources: boolean;
  requires_passing_grade: boolean;
  downloadable_resources: string[];
  attached_files: string[];
  external_links: any;
  recommended_readings: string[];
  order_index: number;
  is_published: boolean;
  is_preview: boolean;
  requires_completion: boolean;
  allow_comments: boolean;
  estimated_prep_time: number;
  completion_criteria: any;
  passing_score: number;
  view_count: number;
  average_completion_time: number;
  completion_rate: number;
  engagement_score: number;
  created_at: Date | string; // Date in DB queries, string when serialized from server actions
  updated_at: Date | string; // Date in DB queries, string when serialized from server actions
  transcripts?: LessonTranscript[];
}

export interface LessonTranscript {
  id: string;
  lesson_id: string;
  language: string;
  content: string;
  word_count: number;
  is_auto_generated: boolean;
  confidence_score: number;
  created_at: Date | string; // Date in DB queries, string when serialized from server actions
  updated_at: Date | string; // Date in DB queries, string when serialized from server actions
}

/**
 * Get course curriculum with modules and lessons
 */
export async function getCourseCurriculum(courseId: string): Promise<Module[]> {
  try {
    const curriculum = await sql`
      SELECT 
        m.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', l.id,
              'module_id', l.module_id,
              'course_id', l.course_id,
              'title', l.title,
              'slug', l.slug,
              'description', l.description,
              'lesson_type', l.lesson_type,
              'content_type', l.content_type,
              'difficulty', l.difficulty,
              'video_url', l.video_url,
              'video_duration', l.video_duration,
              'video_thumbnail', l.video_thumbnail,
              'video_quality', l.video_quality,
              'document_url', l.document_url,
              'document_type', l.document_type,
              'document_size', l.document_size,
              'audio_url', l.audio_url,
              'audio_duration', l.audio_duration,
              'content_html', l.content_html,
              'interactive_content', l.interactive_content,
              'code_environment', l.code_environment,
              'has_transcript', l.has_transcript,
              'has_captions', l.has_captions,
              'has_interactive_exercises', l.has_interactive_exercises,
              'has_downloadable_resources', l.has_downloadable_resources,
              'requires_completion', l.requires_completion,
              'requires_passing_grade', l.requires_passing_grade,
              'allow_comments', l.allow_comments,
              'downloadable_resources', l.downloadable_resources,
              'attached_files', l.attached_files,
              'external_links', l.external_links,
              'recommended_readings', l.recommended_readings,
              'order_index', l.order_index,
              'is_published', l.is_published,
              'is_preview', l.is_preview,
              'estimated_prep_time', l.estimated_prep_time,
              'completion_criteria', l.completion_criteria,
              'passing_score', l.passing_score,
              'view_count', l.view_count,
              'average_completion_time', l.average_completion_time,
              'completion_rate', l.completion_rate,
              'engagement_score', l.engagement_score,
              'created_at', l.created_at,
              'updated_at', l.updated_at
            ) ORDER BY l.order_index ASC
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'::json
        ) as lessons
      FROM modules m
      LEFT JOIN lessons l ON m.id = l.module_id AND l.is_published = true
      WHERE m.course_id = ${courseId} AND m.is_published = true
      GROUP BY m.id, m.title, m.description, m.order_index, m.created_at, m.updated_at
      ORDER BY m.order_index ASC
    `;

    return curriculum as Module[];
  } catch (error) {
    console.error("❌ Error fetching course curriculum:", error);
    return [];
  }
}

/**
 * Get all modules for a course
 */
export async function getCourseModules(
  courseId: string,
  includeLessons: boolean = false
): Promise<Module[]> {
  try {
    // console.log('[DB] getCourseModules called with:', { courseId, includeLessons });

    const modules = await sql`
      SELECT * FROM modules 
      WHERE course_id = ${courseId} 
      ORDER BY order_index ASC, created_at ASC
    `;

    // console.log('🔍 [DB] Raw modules query result:', {
    //   count: modules.length,
    //   modules: modules.map(m => ({
    //     id: m.id,
    //     title: m.title,
    //     course_id: m.course_id,
    //     is_published: m.is_published
    //   }))
    // });

    if (includeLessons) {
      for (const module of modules) {
        const lessons = await sql`
          SELECT * FROM lessons 
          WHERE module_id = ${module.id} AND is_published = true
          ORDER BY order_index ASC, created_at ASC
        `;
        module.lessons = (lessons as Lesson[]) || [];
        // console.log(`[DB] Module "${module.title}" has ${module.lessons.length} lessons`);
      }
    } else {
      // Ensure lessons is always an array, even when not included
      for (const module of modules) {
        module.lessons = [];
      }
    }

    // console.log(' [DB] getCourseModules returning:', {
    //   count: modules.length,
    //   modules: modules.map(m => ({
    //     id: m.id,
    //     title: m.title,
    //     lessonsCount: m.lessons?.length || 0
    //   }))
    // });

    return modules as Module[];
  } catch (error) {
    console.error("❌ Error fetching course modules:", error);
    return [];
  }
}

/**
 * Get module by ID
 */
export async function getModuleById(moduleId: string): Promise<Module | null> {
  try {
    const modules = await sql`
      SELECT * FROM modules WHERE id = ${moduleId} LIMIT 1
    `;
    return (modules[0] as Module) || null;
  } catch (error) {
    console.error("❌ Error fetching module by ID:", error);
    return null;
  }
}

/**
 * Create a new module
 */
export async function createModule(moduleData: {
  course_id: string;
  title: string;
  description?: string;
  order_index?: number;
  is_published?: boolean;
  is_preview_available?: boolean;
  is_required?: boolean;
  estimated_duration?: number;
  learning_objectives?: string[];
  key_concepts?: string[];
}): Promise<{
  success: boolean;
  message: string;
  module?: Module;
  errors?: string[];
}> {
  try {
    // Generate slug from title
    const slug = moduleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug already exists in this course
    const existing = await sql`
      SELECT id FROM modules WHERE course_id = ${moduleData.course_id} AND slug = ${slug} LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: false,
        message: "Module creation failed",
        errors: ["A module with this title already exists in this course"],
      };
    }

    const newModule = await sql`
      INSERT INTO modules (
        course_id,
        title,
        description,
        slug,
        order_index,
        is_published,
        is_preview_available,
        is_required,
        estimated_duration,
        learning_objectives,
        key_concepts
      ) VALUES (
        ${moduleData.course_id},
        ${moduleData.title},
        ${moduleData.description || null},
        ${slug},
        ${moduleData.order_index || 0},
        ${moduleData.is_published ?? true},
        ${moduleData.is_preview_available ?? false},
        ${moduleData.is_required ?? true},
        ${moduleData.estimated_duration || 0},
        ${moduleData.learning_objectives || []},
        ${moduleData.key_concepts || []}
      )
      RETURNING *
    `;

    return {
      success: true,
      message: "Module created successfully",
      module: newModule[0] as Module,
    };
  } catch (error: any) {
    console.error("❌ Error creating module:", error);
    return {
      success: false,
      message: "Failed to create module",
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}

/**
 * Update module
 */
export async function updateModule(
  moduleId: string,
  moduleData: {
    title?: string;
    description?: string;
    order_index?: number;
    is_published?: boolean;
    is_preview_available?: boolean;
    is_required?: boolean;
    estimated_duration?: number;
    learning_objectives?: string[];
    key_concepts?: string[];
  }
): Promise<{
  success: boolean;
  message: string;
  module?: Module;
  errors?: string[];
}> {
  try {
    let slug;
    if (moduleData.title) {
      slug = moduleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // Check if new slug conflicts
      const existing = await sql`
        SELECT id FROM modules WHERE slug = ${slug} AND id != ${moduleId} LIMIT 1
      `;

      if (existing.length > 0) {
        return {
          success: false,
          message: "Module update failed",
          errors: ["A module with this title already exists"],
        };
      }
    }

    const updatedModule = await sql`
      UPDATE modules 
      SET 
        title = COALESCE(${moduleData.title}, title),
        description = COALESCE(${moduleData.description}, description),
        order_index = COALESCE(${moduleData.order_index}, order_index),
        is_published = COALESCE(${moduleData.is_published}, is_published),
        is_preview_available = COALESCE(${moduleData.is_preview_available}, is_preview_available),
        is_required = COALESCE(${moduleData.is_required}, is_required),
        estimated_duration = COALESCE(${moduleData.estimated_duration}, estimated_duration),
        learning_objectives = COALESCE(${moduleData.learning_objectives}, learning_objectives),
        key_concepts = COALESCE(${moduleData.key_concepts}, key_concepts),
        slug = COALESCE(${slug}, slug),
        updated_at = NOW()
      WHERE id = ${moduleId}
      RETURNING *
    `;

    if (updatedModule.length === 0) {
      return {
        success: false,
        message: "Module not found",
        errors: ["Module not found"],
      };
    }

    return {
      success: true,
      message: "Module updated successfully",
      module: updatedModule[0] as Module,
    };
  } catch (error: any) {
    console.error("❌ Error updating module:", error);
    return {
      success: false,
      message: "Failed to update module",
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}

/**
 * Delete module
 */
export async function deleteModule(
  moduleId: string
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  try {
    // Delete associated lessons first
    await sql`DELETE FROM lessons WHERE module_id = ${moduleId}`;

    const result = await sql`
      DELETE FROM modules WHERE id = ${moduleId}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: "Module not found",
        errors: ["Module not found"],
      };
    }

    return {
      success: true,
      message: "Module deleted successfully",
    };
  } catch (error: any) {
    console.error("❌ Error deleting module:", error);
    return {
      success: false,
      message: "Failed to delete module",
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}

/**
 * Create a new lesson
 */
export async function createLesson(lessonData: {
  module_id: string;
  course_id: string;
  title: string;
  description?: string;
  lesson_type: string;
  content_type?: string;
  difficulty?: string;
  order_index?: number;
  is_published?: boolean;
  is_preview?: boolean;
}): Promise<{
  success: boolean;
  message: string;
  lesson?: Lesson;
  errors?: string[];
}> {
  try {
    // Generate slug from title
    const slug = lessonData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug already exists in this module
    const existing = await sql`
      SELECT id FROM lessons WHERE module_id = ${lessonData.module_id} AND slug = ${slug} LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: false,
        message: "Lesson creation failed",
        errors: ["A lesson with this title already exists in this module"],
      };
    }

    const newLesson = await sql`
      INSERT INTO lessons (
        module_id,
        course_id,
        title,
        description,
        slug,
        lesson_type,
        content_type,
        difficulty,
        order_index,
        is_published,
        is_preview
      ) VALUES (
        ${lessonData.module_id},
        ${lessonData.course_id},
        ${lessonData.title},
        ${lessonData.description || null},
        ${slug},
        ${lessonData.lesson_type},
        ${lessonData.content_type || "free"},
        ${lessonData.difficulty || "beginner"},
        ${lessonData.order_index || 0},
        ${lessonData.is_published ?? true},
        ${lessonData.is_preview ?? false}
      )
      RETURNING *
    `;

    return {
      success: true,
      message: "Lesson created successfully",
      lesson: newLesson[0] as Lesson,
    };
  } catch (error: any) {
    console.error("❌ Error creating lesson:", error);
    return {
      success: false,
      message: "Failed to create lesson",
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}

/**
 * Update lesson
 */
export async function updateLesson(
  lessonId: string,
  lessonData: any
): Promise<{
  success: boolean;
  message: string;
  lesson?: Lesson;
  errors?: string[];
}> {
  try {
    let slug;
    if (lessonData.title) {
      slug = lessonData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // Check if new slug conflicts
      const existing = await sql`
        SELECT id FROM lessons WHERE slug = ${slug} AND id != ${lessonId} LIMIT 1
      `;

      if (existing.length > 0) {
        return {
          success: false,
          message: "Lesson update failed",
          errors: ["A lesson with this title already exists"],
        };
      }
    }

    const updatedLesson = await sql`
      UPDATE lessons 
      SET 
        ${lessonData.title ? sql`title = ${lessonData.title},` : sql``}
        ${
          lessonData.description !== undefined
            ? sql`description = ${lessonData.description},`
            : sql``
        }
        ${
          lessonData.lesson_type
            ? sql`lesson_type = ${lessonData.lesson_type},`
            : sql``
        }
        ${
          lessonData.content_type
            ? sql`content_type = ${lessonData.content_type},`
            : sql``
        }
        ${
          lessonData.difficulty
            ? sql`difficulty = ${lessonData.difficulty},`
            : sql``
        }
        ${
          lessonData.video_url !== undefined
            ? sql`video_url = ${lessonData.video_url},`
            : sql``
        }
        ${
          lessonData.video_duration !== undefined
            ? sql`video_duration = ${lessonData.video_duration},`
            : sql``
        }
        ${
          lessonData.document_url !== undefined
            ? sql`document_url = ${lessonData.document_url},`
            : sql``
        }
        ${
          lessonData.document_type !== undefined
            ? sql`document_type = ${lessonData.document_type},`
            : sql``
        }
        ${
          lessonData.content_html !== undefined
            ? sql`content_html = ${lessonData.content_html},`
            : sql``
        }
        ${
          lessonData.order_index !== undefined
            ? sql`order_index = ${lessonData.order_index},`
            : sql``
        }
        ${
          lessonData.is_published !== undefined
            ? sql`is_published = ${lessonData.is_published},`
            : sql``
        }
        ${
          lessonData.is_preview !== undefined
            ? sql`is_preview = ${lessonData.is_preview},`
            : sql``
        }
        slug = COALESCE(${slug}, slug),
        updated_at = NOW()
      WHERE id = ${lessonId}
      RETURNING *
    `;

    if (updatedLesson.length === 0) {
      return {
        success: false,
        message: "Lesson not found",
        errors: ["Lesson not found"],
      };
    }

    return {
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson[0] as Lesson,
    };
  } catch (error: any) {
    console.error("❌ Error updating lesson:", error);
    return {
      success: false,
      message: "Failed to update lesson",
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}

/**
 * Get lesson by ID
 */
export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  try {
    const lessons = await sql`
      SELECT * FROM lessons WHERE id = ${lessonId} LIMIT 1
    `;
    return (lessons[0] as Lesson) || null;
  } catch (error) {
    console.error("❌ Error fetching lesson by ID:", error);
    return null;
  }
}

/**
 * Delete lesson
 */
export async function deleteLesson(
  lessonId: string
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  try {
    const result = await sql`
      DELETE FROM lessons WHERE id = ${lessonId}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: "Lesson not found",
        errors: ["Lesson not found"],
      };
    }

    return {
      success: true,
      message: "Lesson deleted successfully",
    };
  } catch (error: any) {
    console.error("❌ Error deleting lesson:", error);
    return {
      success: false,
      message: "Failed to delete lesson",
      errors: [error.message || "An unexpected error occurred"],
    };
  }
}
