
// /app/api/student/progress/route.ts

import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || !session.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock data - replace with actual database queries later
    const progressData = {
      coursesInProgress: 3,
      hoursLearned: 24,
      certificatesEarned: 2,
      currentStreak: 7,
      weeklyGoal: { completed: 5, target: 7 },
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
      achievements: [
        { id: 1, name: "Python Basics", icon: "🐍", description: "Completed Python fundamentals module" },
        { id: 2, name: "Quiz Master", icon: "🏆", description: "Scored 100% on 5 quizzes" },
        { id: 3, name: "Week Warrior", icon: "⚡", description: "Learned 7 days in a row" },
      ]
    }

    return Response.json(progressData)

  } catch (error) {
    console.error('Student progress API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}