import { getSession } from '@/lib/auth/session'
import Sidebar from '@/components/dashboard/sidebar'
import MyCoursesPage from '@/components/dashboard/my-courses'

export default async function MyCourses() {
  const session = await getSession()
  
  // Create user object from session - using correct session structure
  const user = session ? {
    id: session.userId,
    name: 'User', // You might need to fetch this from your database
    email: 'user@example.com', // You might need to fetch this from your database  
    primaryRole: session.primaryRole || 'student',
    image: undefined // You might need to fetch this from your database
  } : null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto">
        <MyCoursesPage />
      </main>
    </div>
  )
}