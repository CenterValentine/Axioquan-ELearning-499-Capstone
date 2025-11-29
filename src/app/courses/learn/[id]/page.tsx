
//  /app/courses/learn/[id]/page.tsx

import { getSession } from '@/lib/auth/session'
import AppShellSidebar from '@/components/layout/AppSidebarNav'
import CourseLearningPage from '@/components/courses/course-learning'
import { getCourseCurriculumAction } from '@/lib/courses/curriculum-actions';
import { type Module as DbModule, type Lesson as DbLesson } from '@/lib/db/queries/curriculum';

// UI-specific types for CourseLearningPage component
interface UiLesson {
  id: string;
  title: string;
  duration: number;
  watched: number;
  type: "video" | "pdf" | "document";
  completed: boolean;
  bookmarks?: number[];
}

interface UiModule {
  id: string;
  title: string;
  progress: number;
  lessons: UiLesson[];
}

interface LearnCoursePageProps {
  params: {
    id: string
  }
}

export default async function LearnCoursePage({ params }: LearnCoursePageProps) {
  const { id } = await params; // Unwrap params Promise
  const session = await getSession()
  const curriculumResult = await getCourseCurriculumAction(id);
  
  console.log('🔍 [SERVER] getCourseCurriculumAction called with courseId:', id);
  console.log('🔍 [SERVER] curriculumResult:', {
    success: curriculumResult.success,
    modulesCount: curriculumResult.modules?.length || 0,
    hasModules: !!curriculumResult.modules
  });
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


  console.log('🔍 [SERVER] dbModules received:', {
    count: dbModules.length,
    modules: dbModules.map(m => ({
      id: m.id,
      title: m.title,
      hasLessons: !!m.lessons,
      lessonsType: Array.isArray(m.lessons) ? 'array' : typeof m.lessons,
      lessonsCount: Array.isArray(m.lessons) ? m.lessons.length : 'N/A',
      lessons: m.lessons ? (Array.isArray(m.lessons) ? m.lessons.map(l => ({ id: l.id, title: l.title })) : 'not-array') : 'undefined'
    }))
  });

  const uiModules: UiModule[] = dbModules.map((m: DbModule): UiModule => {
    // Ensure lessons is always an array, this may be overkill.
    const dbLessons = Array.isArray(m.lessons) ? m.lessons : [];
    console.log(`🔍 [SERVER] Module "${m.title}" (${m.id}):`, {
      hasLessons: !!m.lessons,
      lessonsType: typeof m.lessons,
      isArray: Array.isArray(m.lessons),
      dbLessonsCount: dbLessons.length,
      dbLessons: dbLessons.map(l => ({ id: l.id, title: l.title }))
    });
    
    const uiLessons: UiLesson[] = dbLessons.map((l: DbLesson): UiLesson => ({
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
      lessons: uiLessons, // Always an array, never undefined
    };
  });

  console.log('🔍 [SERVER] uiModules mapped:', {
    count: uiModules.length,
    modules: uiModules.map(m => ({
      id: m.id,
      title: m.title,
      lessonsCount: m.lessons.length,
      lessons: m.lessons.map(l => ({ id: l.id, title: l.title }))
    }))
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AppShellSidebar user={user} />
      <CourseLearningPage courseId={id} modules={uiModules} />
    </div>
  )
}