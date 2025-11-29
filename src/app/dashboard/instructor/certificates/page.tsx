// /app/dashboard/instructor/certificates/page.tsx

import { getSession } from '@/lib/auth/session'
import AppShellSidebar from '@/components/layout/AppSidebarNav'
import InstructorCertificatesPage from '@/components/dashboard/instructor-certificates-page'

export default async function InstructorCertificates() {
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
      <main className="flex-1 overflow-auto">
        <InstructorCertificatesPage />
      </main>
    </div>
  )
}