// /src/components/courses/CourseInstructorSection.tsx

'use client';

import { Course } from '@/types/courses';

export interface CourseInstructorSectionProps {
  course: Course;
}

export function CourseInstructorSection({ course }: CourseInstructorSectionProps) {
  // TODO: Render instructor section with:
  // - Instructor bio (or default text)
  // - Student enrollment count
  
  return (<section className="bg-gray-50 border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">About the Instructor</h2>
      <div className="flex gap-8 items-start">
        {course.instructor_image ? (
          <img
            src={course.instructor_image}
            alt={course.instructor_name || 'Instructor'}
            className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
            {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold mb-1 text-gray-900">{course.instructor_name}</h3>
          <p className="text-gray-600 mb-3">{course.instructor_bio || 'Experienced instructor'}</p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{course.enrolled_students_count?.toLocaleString() || 0}</span> students enrolled
          </p>
        </div>
      </div>
    </div>
  </section>
  )
}

