
//  /app/courses/learn/[id]/page.tsx

import { getSession } from '@/lib/auth/session'
import AppShellSidebar from '@/components/shell/AppSidebarNav'
import CourseLearningPage from '@/components/courses/course-learning'
import { getCourseCurriculumAction } from '@/lib/courses/curriculum-actions';
import { Module } from '@/lib/db/queries/curriculum';


interface LearnCoursePageProps {
  params: {
    id: string
  }
}

export default async function LearnCoursePage({ params }: LearnCoursePageProps) {
  const session = await getSession()
  const curriculumResult = await getCourseCurriculumAction(params.id);
  if (!curriculumResult.success || !curriculumResult.modules) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load curriculum.</p>
        </div>
      </div>
    )
  }

  const dbModules = curriculumResult.modules; // type: DbModule[]

  
  if (!session || !session.userId) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  const user = {
    id: session.userId,
    name: 'Student User',
    email: 'student@example.com',
    primaryRole: session.primaryRole || 'student',
    image: undefined
  }


  const uiModules: Module[] = dbModules.map((m) => {
    const uiLessons: Lesson[] = (m.lessons ?? []).map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.video_duration ?? 0,     // map DB duration → seconds
      watched: 0,                          // start at 0 or load from enrollments later
      type: l.lesson_type === 'video' ? 'video' : 'document', // simplify mapping
      completed: false,                    // or compute from enrollments/progress
      bookmarks: [],
    }));
  
    // Simple progress metric based on completed lessons
    const completedCount = uiLessons.filter((lesson) => lesson.completed).length;
    const progress =
      uiLessons.length > 0 ? Math.round((completedCount / uiLessons.length) * 100) : 0;
  
    return {
      id: m.id,
      title: m.title,
      progress,
      lessons: uiLessons,
    };
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AppShellSidebar user={user} />
      <CourseLearningPage courseId={params.id} modules={uiModules} />
    </div>
  )
}