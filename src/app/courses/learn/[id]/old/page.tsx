//  /app/courses/learn/[id]/page.tsx

import { getSession } from "@/lib/auth/session";
import AppShellSidebar from "@/components/layout/AppSidebarNav";
import CourseLearningPage from "@/components/courses/course-learning";
import Unauthorized from "@/components/auth/unauthorized";
import { getCourseCurriculumAction } from "@/lib/courses/curriculum-actions";
import {
  type Module as DbModule,
  type Lesson as DbLesson,
} from "@/lib/db/queries/curriculum";
import { Lesson, Module } from "@/types/lesson";

// See src/types/lesson.ts for lesson types.

interface LearnCoursePageProps {
  params: {
    id: string;
  };
}

export default async function LearnCoursePage({
  params,
}: LearnCoursePageProps) {
  const { id } = await params; // Unwrap params Promise
  const session = await getSession();
  const curriculumResult = await getCourseCurriculumAction(id);

  // console.log('🔍 [SERVER] getCourseCurriculumAction called with courseId:', id);
  // console.log('🔍 [SERVER] curriculumResult:', {
  //   success: curriculumResult.success,
  //   modulesCount: curriculumResult.modules?.length || 0,
  //   hasModules: !!curriculumResult.modules
  // });
  if (!curriculumResult.success || !curriculumResult.modules) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load curriculum.</p>
        </div>
      </div>
    );
  }

  const dbModules = curriculumResult.modules; // type: DbModule[]

  if (!session || !session.userId) {
    return <Unauthorized />;
  }

  const user = {
    id: session.userId,
    name: "Student User",
    email: "student@example.com",
    primaryRole: session.primaryRole || "student",
    image: undefined,
  };

  // console.log('🔍 [SERVER] dbModules received:', {
  //   count: dbModules.length,
  //   modules: dbModules.map(m => ({
  //     id: m.id,
  //     title: m.title,
  //     hasLessons: !!m.lessons,
  //     lessonsType: Array.isArray(m.lessons) ? 'array' : typeof m.lessons,
  //     lessonsCount: Array.isArray(m.lessons) ? m.lessons.length : 'N/A',
  //     lessons: m.lessons ? (Array.isArray(m.lessons) ? m.lessons.map(l => ({ id: l.id, title: l.title })) : 'not-array') : 'undefined'
  //   }))
  // });

  const uiModules: Module[] = dbModules.map((m: DbModule): Module => {
    // Ensure lessons is always an array, this may be overkill.
    const dbLessons = Array.isArray(m.lessons) ? m.lessons : [];
    // console.log(`🔍 Query: [SERVER] Module "${m.title}" (${m.id}):`, {
    //   hasLessons: !!m.lessons,
    //   lessonsType: typeof m.lessons,
    //   isArray: Array.isArray(m.lessons),
    //   dbLessonsCount: dbLessons.length,
    //   dbLessons: dbLessons.map(l => ({ id: l.id, title: l.title }))
    // });

    const uiLessons: Lesson[] = dbLessons.map(
      (l: DbLesson): Lesson => ({
        // UI-specific fields for backward compatibility
        id: l.id,
        title: l.title,
        duration: l.video_duration ?? 0, // map DB duration → seconds
        watched: 0, // start at 0 or load from enrollments later
        type:
          l.lesson_type === "video"
            ? "video"
            : l.lesson_type === "document"
            ? "document"
            : "pdf", // simplify mapping
        completed: false, // or compute from enrollments/progress
        bookmarks: [],

        // Core lesson metadata
        module_id: l.module_id,
        course_id: l.course_id,
        slug: l.slug,
        description: l.description,
        lesson_type: l.lesson_type,
        content_type: l.content_type,
        difficulty: l.difficulty || "beginner",

        // Video-specific fields
        video_url: l.video_url,
        video_thumbnail: l.video_thumbnail,
        video_duration: l.video_duration ?? 0,
        video_quality: l.video_quality,

        // Audio-specific fields
        audio_url: l.audio_url,
        audio_duration: l.audio_duration ?? 0,

        // Document-specific fields
        document_url: l.document_url,
        document_type: l.document_type,
        document_size: l.document_size ?? 0,

        // Content fields
        content_html: l.content_html,
        interactive_content: l.interactive_content,
        code_environment: l.code_environment,

        // Feature flags
        is_preview: l.is_preview ?? false,
        has_transcript: l.has_transcript ?? false,
        has_captions: l.has_captions ?? false,
        has_interactive_exercises: l.has_interactive_exercises ?? false,
        has_downloadable_resources: l.has_downloadable_resources ?? false,
        requires_completion: l.requires_completion ?? false,
        requires_passing_grade: l.requires_passing_grade ?? false,
        allow_comments: l.allow_comments ?? false,

        // Resources and files
        downloadable_resources: l.downloadable_resources ?? [],
        attached_files: l.attached_files ?? [],
        external_links: l.external_links,
        recommended_readings: l.recommended_readings ?? [],

        // Metadata
        order_index: l.order_index,
        is_published: l.is_published ?? false,
        estimated_prep_time: l.estimated_prep_time ?? 0,
        completion_criteria: l.completion_criteria,
        passing_score: l.passing_score ?? 0,

        // Statistics
        view_count: l.view_count ?? 0,
        average_completion_time: l.average_completion_time ?? 0,
        completion_rate: l.completion_rate ?? 0,
        engagement_score: l.engagement_score ?? 0,

        // Timestamps
        created_at:
          l.created_at instanceof Date
            ? l.created_at.toISOString()
            : l.created_at,
        updated_at:
          l.updated_at instanceof Date
            ? l.updated_at.toISOString()
            : l.updated_at,

        // Optional transcripts
        transcripts: l.transcripts,
      })
    );

    // Simple progress metric based on completed lessons
    const completedCount = uiLessons.filter(
      (lesson) => lesson.completed
    ).length;
    const progress =
      uiLessons.length > 0
        ? Math.round((completedCount / uiLessons.length) * 100)
        : 0;

    return {
      id: m.id,
      title: m.title,
      progress,
      lessons: uiLessons, // Always an array, never undefined
    };
  });

  // console.log('🔍 Query: [SERVER] uiModules mapped:', {
  //   count: uiModules.length,
  //   modules: uiModules.map(m => ({
  //     id: m.id,
  //     title: m.title,
  //     lessonsCount: m.lessons.length,
  //     lessons: m.lessons.map(l => ({ id: l.id, title: l.title }))
  //   }))
  // });

  return (
    <div className="flex min-h-screen bg-background">
      <AppShellSidebar user={user} />
      <CourseLearningPage courseId={id} modules={uiModules} />
    </div>
  );
}
