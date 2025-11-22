
// /components/dashboard/progress-page.tsx

'use client'

const progressData = {
  coursesInProgress: 3,
  hoursLearned: 24,
  certificatesEarned: 2,
  currentStreak: 7,
  courses: [
    {
      id: 1,
      title: "Introduction to Python Programming",
      category: "Programming",
      progress: 85,
      lastUpdated: "2 days ago",
      nextLesson: "Advanced Functions",
    },
    {
      id: 2,
      title: "Modern Web Design Principles",
      category: "Design",
      progress: 60,
      lastUpdated: "Today",
      nextLesson: "Responsive Design",
    },
    {
      id: 3,
      title: "Data Structures and Algorithms",
      category: "Programming",
      progress: 25,
      lastUpdated: "5 days ago",
      nextLesson: "Linked Lists",
    },
  ],
}

const achievements = [
  { id: 1, name: "Python Basics", icon: "🐍", description: "Completed Python fundamentals module" },
  { id: 2, name: "Quiz Master", icon: "🏆", description: "Scored 100% on 5 quizzes" },
  { id: 3, name: "Week Warrior", icon: "⚡", description: "Learned 7 days in a row" },
]

export default function ProgressPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Course Progress</h1>
        <p className="text-gray-600 mt-1">Track your learning journey and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm md:text-base">Courses in Progress</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{progressData.coursesInProgress}</p>
            </div>
            <div className="text-3xl md:text-4xl">📚</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm md:text-base">Hours Learned</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{progressData.hoursLearned}</p>
            </div>
            <div className="text-3xl md:text-4xl">⏱️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm md:text-base">Certificates</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{progressData.certificatesEarned}</p>
            </div>
            <div className="text-3xl md:text-4xl">📜</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm md:text-base">Current Streak</p>
              <p className="text-2xl md:text-3xl font-bold text-orange-600 mt-2">
                {progressData.currentStreak} days
              </p>
            </div>
            <div className="text-3xl md:text-4xl">🔥</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Course Progress Details */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Course Progress</h2>
          {progressData.courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base md:text-lg">{course.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{course.category}</p>
                </div>
                <span className="text-sm md:text-base font-bold text-blue-600">{course.progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-900">{course.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-gray-600">Next Lesson</p>
                  <p className="font-medium text-gray-900">{course.nextLesson}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Goal and Achievements */}
        <div className="space-y-6">
          {/* Weekly Goal */}
          <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 text-base md:text-lg mb-4">Weekly Goal</h3>
            <div className="text-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${(5 / 7) * 282.74}`}
                    strokeDashoffset="0"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg md:text-2xl font-bold text-gray-900">5/7</p>
                    <p className="text-xs md:text-sm text-gray-600">hours</p>
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-4">2 more hours to reach your weekly goal</p>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 text-base md:text-lg mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                >
                  <div className="text-2xl md:text-3xl flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base">{achievement.name}</p>
                    <p className="text-xs md:text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}