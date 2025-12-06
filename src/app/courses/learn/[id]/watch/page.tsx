// /app/courses/learn/[id]/watch/page.tsx

import { getSession } from "@/lib/auth/session";
import VideoPlayerPage from "@/components/curriculum/video/video-player";
import { getCourseCurriculumAction } from "@/lib/courses/curriculum-actions";
import {
  type Module as DbModule,
  type Lesson as DbLesson,
} from "@/lib/db/queries/curriculum";
import { Lesson, Module, CourseData } from "@/types/lesson";
import { getCourseById } from "@/lib/db/queries/courses";
import { getLessonProgress } from "@/lib/db/queries/enrollments";
import { calculateModuleDuration } from "@/lib/utils/duration";
import Unauthorized from "@/components/auth/unauthorized";

interface WatchVideoPageProps {
  params: {
    id: string;
  };
  searchParams: {
    lessonId?: string;
  };
}

export default async function WatchVideoPage({
  params,
  searchParams,
}: WatchVideoPageProps) {
  const { id: courseId } = await params;
  const { lessonId } = await searchParams;
  const session = await getSession();

  if (!session || !session.userId) {
    return <Unauthorized />;
  }

  if (!lessonId) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lesson ID Required
          </h1>
          <p className="text-gray-600">
            Please specify a lesson ID in the URL parameters.
          </p>
        </div>
      </div>
    );
  }

  // Fetch curriculum and course data (same as learn page)
  const curriculumResult = await getCourseCurriculumAction(courseId);
  const course = await getCourseById(courseId);

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

  const dbModules = curriculumResult.modules;
  const lessonProgressMap = await getLessonProgress(session.userId, courseId);

  // Build CourseData structure (same as learn page)
  const uiModules: Module[] = dbModules.map((m: DbModule): Module => {
    const dbLessons = Array.isArray(m.lessons) ? m.lessons : [];

    const uiLessons: Lesson[] = dbLessons.map((l: DbLesson): Lesson => {
      const progress = lessonProgressMap.get(l.id);
      const completed = progress?.completed || false;
      const watched = progress?.watched || 0;

      return {
        id: l.id,
        title: l.title,
        duration: l.video_duration ?? 0,
        watched: watched,
        type:
          l.lesson_type === "video"
            ? "video"
            : l.lesson_type === "document"
            ? "document"
            : "pdf",
        completed: completed,
        bookmarks: [],
        module_id: l.module_id,
        course_id: l.course_id,
        slug: l.slug,
        description: l.description,
        lesson_type: l.lesson_type,
        content_type: l.content_type,
        difficulty: l.difficulty || "beginner",
        video_url: l.video_url,
        video_thumbnail: l.video_thumbnail,
        video_duration: l.video_duration ?? 0,
        video_quality: l.video_quality,
        audio_url: l.audio_url,
        audio_duration: l.audio_duration ?? 0,
        document_url: l.document_url,
        document_type: l.document_type,
        document_size: l.document_size ?? 0,
        content_html: l.content_html,
        interactive_content: l.interactive_content,
        code_environment: l.code_environment,
        is_preview: l.is_preview ?? false,
        has_transcript: l.has_transcript ?? false,
        has_captions: l.has_captions ?? false,
        has_interactive_exercises: l.has_interactive_exercises ?? false,
        has_downloadable_resources: l.has_downloadable_resources ?? false,
        requires_completion: l.requires_completion ?? false,
        requires_passing_grade: l.requires_passing_grade ?? false,
        allow_comments: l.allow_comments ?? false,
        downloadable_resources: l.downloadable_resources ?? [],
        attached_files: l.attached_files ?? [],
        external_links: l.external_links,
        recommended_readings: l.recommended_readings ?? [],
        order_index: l.order_index,
        is_published: l.is_published ?? false,
        estimated_prep_time: l.estimated_prep_time ?? 0,
        completion_criteria: l.completion_criteria,
        passing_score: l.passing_score ?? 0,
        view_count: l.view_count ?? 0,
        average_completion_time: l.average_completion_time ?? 0,
        completion_rate: l.completion_rate ?? 0,
        engagement_score: l.engagement_score ?? 0,
        created_at:
          l.created_at instanceof Date
            ? l.created_at.toISOString()
            : l.created_at,
        updated_at:
          l.updated_at instanceof Date
            ? l.updated_at.toISOString()
            : l.updated_at,
        transcripts: l.transcripts,
      };
    });

    const moduleDuration = calculateModuleDuration(uiLessons);
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
      lessons: uiLessons,
      duration: moduleDuration.total,
      video_duration: moduleDuration.video,
      audio_duration: moduleDuration.audio,
      estimated_duration: m.estimated_duration || 0,
    };
  });

  const courseData: CourseData = {
    id: courseId,
    title: course?.title || "",
    description: course?.short_description || course?.description_html || "",
    instructor: course?.instructor_name || "",
    modules: uiModules,
  };

  // Find the module and lesson indices for the specified lessonId
  let foundModuleIndex = -1;
  let foundLessonIndex = -1;

  for (let i = 0; i < courseData.modules.length; i++) {
    const index = courseData.modules[i].lessons.findIndex(
      (lesson) => lesson.id === lessonId
    );
    if (index !== -1) {
      foundModuleIndex = i;
      foundLessonIndex = index;
      break;
    }
  }

  if (foundModuleIndex === -1 || foundLessonIndex === -1) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lesson Not Found
          </h1>
          <p className="text-gray-600">
            The lesson you're looking for doesn't exist in this course.
          </p>
        </div>
      </div>
    );
  }

  return (
    <VideoPlayerPage
      courseData={courseData}
      currentModule={foundModuleIndex}
      currentLesson={foundLessonIndex}
      courseTitle={course?.title}
      courseDescription={
        course?.short_description || course?.description_html || undefined
      }
    />
  );
}
