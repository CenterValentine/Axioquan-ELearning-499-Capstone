
// /app/api/dashboard/data/route.ts

import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { sql } from '@/lib/db/index'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || !session.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let roleSpecificData = {
      enrolledCourses: 0,
      learningProgress: 0,
      instructorCourses: 0,
      totalStudents: 0,
      pendingRoleRequests: 0,
      totalUsers: 0,
      certificatesEarned: 0
    }

    // Explicitly type the arrays
    let instructorCoursesList: any[] = []
    let enrolledCoursesList: any[] = []

    // Role-based data fetching
    if (session.primaryRole === 'student') {
      // Get student enrolled courses
      const enrolledCourses = await sql`
        SELECT c.*, e.progress_percentage as progress 
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = ${session.userId} AND e.status = 'active'
      `
      enrolledCoursesList = enrolledCourses as any[]
      roleSpecificData.enrolledCourses = enrolledCourses.length

      // Calculate learning progress
      const totalProgress = enrolledCourses.reduce((sum: number, course: any) => sum + (course.progress || 0), 0)
      roleSpecificData.learningProgress = enrolledCourses.length > 0 ? 
        Math.round(totalProgress / enrolledCourses.length) : 0

    } else if (session.primaryRole === 'instructor') {
      // Get instructor courses
      const instructorCourses = await sql`
        SELECT c.*, 
               COUNT(e.id) as students_count,
               COUNT(m.id) as modules_count
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
        LEFT JOIN modules m ON c.id = m.course_id
        WHERE c.instructor_id = ${session.userId}
        GROUP BY c.id
      `
      instructorCoursesList = instructorCourses as any[]
      roleSpecificData.instructorCourses = instructorCourses.length

      // Calculate total students
      const totalStudents = instructorCourses.reduce((total: number, course: any) => {
        return total + (parseInt(course.students_count) || 0)
      }, 0)
      roleSpecificData.totalStudents = totalStudents

      // Calculate published courses percentage
      const publishedCourses = instructorCourses.filter((course: any) => course.is_published)
      roleSpecificData.learningProgress = instructorCourses.length > 0 ? 
        Math.round((publishedCourses.length / instructorCourses.length) * 100) : 0

    } else if (session.primaryRole === 'admin') {
      // Get pending role requests
      const pendingRequests = await sql`
        SELECT COUNT(*) as count FROM role_requests WHERE status = 'pending'
      `
      roleSpecificData.pendingRoleRequests = parseInt(pendingRequests[0]?.count || '0')

      // Get total users
      const totalUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_active = true`
      roleSpecificData.totalUsers = parseInt(totalUsers[0]?.count || '0')

      // Get total published courses
      const totalCourses = await sql`SELECT COUNT(*) as count FROM courses WHERE is_published = true`
      roleSpecificData.enrolledCourses = parseInt(totalCourses[0]?.count || '0')
    }

    // Calculate session expiry
    const sessionExpiry = session.expires ? 
      Math.round((new Date(session.expires).getTime() - Date.now()) / (60 * 1000)) : 0

    return Response.json({
      roleSpecificData,
      sessionExpiry,
      instructorCoursesList,
      enrolledCoursesList
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}