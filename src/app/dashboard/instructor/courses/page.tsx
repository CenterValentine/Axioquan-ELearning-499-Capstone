
// /app/dashboard/instructor/courses/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { requireRole } from '@/lib/auth/utils';
import { getInstructorCoursesAction } from '@/lib/courses/actions';
import { getCategoriesAction } from '@/lib/categories/actions';
import { CourseManager } from '@/components/courses/course-manager';

export default async function InstructorCoursesPage() {
  const session = await withSessionRefresh();
  await requireRole(['instructor', 'admin']);

  // Fetch instructor's courses and categories in parallel
  const [coursesResult, categoriesResult] = await Promise.all([
    getInstructorCoursesAction(),
    getCategoriesAction()
  ]);

  const courses = coursesResult.courses || [];
  const categories = categoriesResult.categories || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">
          Manage and create your courses
        </p>
      </div>

      <CourseManager 
        initialCourses={courses}
        categories={categories}
      />
    </div>
  );
}