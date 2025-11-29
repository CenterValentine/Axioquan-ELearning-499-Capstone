
// /app/dashboard/instructor/students/page.tsx

import { getSession } from '@/lib/auth/session'
import AppShellSidebar from '@/components/layout/AppSidebarNav'

export default async function InstructorStudents() {
  const session = await getSession()
  
  if (!session || !session.userId) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  const user = {
    id: session.userId,
    name: 'Instructor User',
    email: 'instructor@example.com',
    primaryRole: session.primaryRole || 'instructor',
    image: undefined
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppShellSidebar user={user} />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Students</h1>
          <p className="text-gray-600 mb-8">View and manage students enrolled in your courses</p>
          
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Management</h2>
            <p className="text-gray-600">
              Student management interface will be displayed here with enrollment data and progress tracking.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}