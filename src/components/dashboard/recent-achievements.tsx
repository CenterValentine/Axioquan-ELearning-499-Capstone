
// /components/dashboard/recent-achievements.tsx

'use client'

export default function RecentAchievements() {
  const achievements = [
    {
      id: 1,
      title: 'Python Basics',
      description: 'Completed Python fundamentals module',
      icon: '🏆',
      date: 'Today',
    },
    {
      id: 2,
      title: 'Quiz Master',
      description: 'Scored 100% on 5 quizzes',
      icon: '⭐',
      date: '3 days ago',
    },
    {
      id: 3,
      title: 'Week Warrior',
      description: 'Learned 7 days in a row',
      icon: '🎯',
      date: '1 week ago',
    },
  ]

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h2>
      <p className="text-xs text-gray-600 mb-4">Your latest accomplishments</p>
      
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">{achievement.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
              <p className="text-xs text-gray-600">{achievement.description}</p>
              <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

