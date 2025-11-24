
// /components/dashboard/instructor-courses.tsx

'use client'

import Link from 'next/link'

interface InstructorCoursesProps {
  courses: any[]
}

export default function InstructorCourses({ courses }: InstructorCoursesProps) {
  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-6">
            Start creating your first course to share your knowledge
          </p>
          <Link href="/dashboard/instructor/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Create Your First Course
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
        <Link href="/dashboard/instructor/create">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + New Course
          </button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                course.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {course.published ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{course.students_count || 0} students</span>
              <span>{course.modules_count || 0} modules</span>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Link 
                href={`/dashboard/instructor/courses/${course.id}`} 
                className="flex-1"
              >
                <button className="w-full border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-50">
                  Manage
                </button>
              </Link>
              <Link 
                href={`/dashboard/instructor/courses/${course.id}/curriculum`} 
                className="flex-1"
              >
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium">
                  Curriculum
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


