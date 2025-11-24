
// /components/dashboard/trending-courses.tsx

'use client'

export default function TrendingCourses() {
  const courses = [
    {
      id: 1,
      title: 'Machine Learning Fundamentals',
      icon: '🤖',
      category: 'Trending',
    },
    {
      id: 2,
      title: 'Digital Marketing Essentials',
      icon: '📱',
      category: 'Popular',
    },
    {
      id: 3,
      title: 'Spoken for Beginners',
      icon: '🗣️',
      category: 'New',
    },
  ]

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Trending Courses</h2>
      
      <div className="space-y-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          >
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            <span className="text-2xl">{course.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{course.title}</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {course.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}