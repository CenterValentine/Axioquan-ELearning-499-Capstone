
// /app/api/student/courses/route.ts

import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || !session.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, return mock data - you'll replace this with actual database queries
    const mockCourses = [
      {
        id: 1,
        title: "Introduction to Python Programming",
        description: "Master the fundamentals of Python through interactive coding challenges and real-world projects.",
        level: "Beginner",
        duration: "6 weeks",
        category: "Programming",
        status: "in-progress",
        progress: 65,
        slug: "introduction-to-python-programming"
      },
      // ... more mock courses
    ]

    return Response.json({ 
      courses: mockCourses,
      total: mockCourses.length,
      inProgress: mockCourses.filter(c => c.status === 'in-progress').length,
      completed: mockCourses.filter(c => c.status === 'completed').length
    })

  } catch (error) {
    console.error('Student courses API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}