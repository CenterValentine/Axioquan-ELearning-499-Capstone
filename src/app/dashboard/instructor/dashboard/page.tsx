// /app/dashboard/instructor/dashboard/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { requireRole } from '@/lib/auth/utils';
import { getInstructorCoursesAction } from '@/lib/courses/actions';
import { sql } from '@/lib/db/index';

export default async function InstructorDashboardPage() {
  const session = await withSessionRefresh();
  await requireRole(['instructor', 'admin']);

  // Fetch instructor's courses and stats
  const [coursesResult, stats] = await Promise.all([
    getInstructorCoursesAction(),
    sql`
      SELECT 
        COUNT(DISTINCT e.id) as total_students,
        COUNT(DISTINCT c.id) as total_courses,
        COALESCE(SUM(e.enrolled_price_cents), 0) as total_revenue
      FROM courses c
      LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'active'
      WHERE c.instructor_id = ${session.userId}
    `
  ]);

  const courses = coursesResult.courses || [];
  const statsData = stats[0] || {
    total_students: 0,
    total_courses: 0,
    total_revenue: 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your courses and student engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statsData.total_courses || courses.length}
              </p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statsData.total_students || 0}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${((statsData.total_revenue || 0) / 100).toFixed(2)}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/instructor/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mr-4">➕</div>
            <div>
              <p className="font-medium text-gray-900">Create New Course</p>
              <p className="text-sm text-gray-600">Start building your next course</p>
            </div>
          </a>
          <a
            href="/dashboard/instructor/courses"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mr-4">📝</div>
            <div>
              <p className="font-medium text-gray-900">Manage Courses</p>
              <p className="text-sm text-gray-600">Edit and update your courses</p>
            </div>
          </a>
          <a
            href="/dashboard/instructor/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mr-4">📊</div>
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-600">Track course performance</p>
            </div>
          </a>
          <a
            href="/dashboard/instructor/students"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mr-4">👥</div>
            <div>
              <p className="font-medium text-gray-900">Manage Students</p>
              <p className="text-sm text-gray-600">View and manage your students</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Courses */}
      {courses.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Courses</h2>
          <div className="space-y-4">
            {courses.slice(0, 5).map((course: any) => (
              <a
                key={course.id}
                href={`/dashboard/instructor/courses/${course.id}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-600">
                    {course.is_published ? 'Published' : 'Draft'}
                  </p>
                </div>
                <div className="text-gray-400">→</div>
              </a>
            ))}
          </div>
          {courses.length > 5 && (
            <a
              href="/dashboard/instructor/courses"
              className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700"
            >
              View all courses →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

