// /app/courses/watch/[courseId]/[lessonId]/page.tsx

import { getSession } from "@/lib/auth/session";
import VideoPlayerPage from "@/components/courses/video-player";
import { getLessonAction } from "@/lib/courses/curriculum-actions";
import { getCourseById } from "@/lib/db/queries/courses";

interface WatchVideoPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function WatchVideoPage({
  params,
}: WatchVideoPageProps) {
  const { courseId, lessonId } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unauthorized
          </h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // Fetch lesson data
  const lessonResult = await getLessonAction(lessonId);

  if (!lessonResult.success || !lessonResult.lesson) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lesson Not Found
          </h1>
          <p className="text-gray-600">
            The lesson you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Fetch course data for title/description
  const course = await getCourseById(courseId);

  return (
    <VideoPlayerPage
      courseId={courseId}
      lessonId={lessonId}
      lesson={lessonResult.lesson}
      courseTitle={course?.title}
      courseDescription={course?.short_description || course?.description_html || undefined}
    />
  );
}