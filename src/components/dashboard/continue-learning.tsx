
// /components/dashboard/continue-learning.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ContinueLearningProps {
  courses: any[]
}

export default function ContinueLearning({ courses }: ContinueLearningProps) {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your learning journey</h3>
          <p className="text-gray-600 mb-6">
            Enroll in courses to track your progress and continue learning
          </p>
          <Link href="/courses">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Browse Courses
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">
                {course.icon || '📚'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {course.category || 'General'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{course.progress || 0}%</span>
                </div>
              </div>
            </div>
            
            {selectedCourse === course.id && (
              <div className="mt-4 pt-4 border-t border-gray-300 flex space-x-2">
                <Link 
                  href={`/courses/${course.slug || course.id}`}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex-1 text-center"
                >
                  Continue Course
                </Link>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex-1">
                  View Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}