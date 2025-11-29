
// /app/dashboard/progress/page.tsx

import { getSession } from '@/lib/auth/session'
import AppShellSidebar from '@/components/layout/AppSidebarNav'
import ProgressPage from '@/components/dashboard/progress-page'

export default async function Progress() {
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

  // Create user object with placeholder data
  const user = {
    id: session.userId,
    name: 'Student User',
    email: 'student@example.com',
    primaryRole: session.primaryRole || 'student',
    image: undefined
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppShellSidebar user={user} />
      <main className="flex-1 overflow-auto">
        <ProgressPage />
      </main>
    </div>
  )
}