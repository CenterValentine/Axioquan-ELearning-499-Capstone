
// /app/courses/watch/[courseId]/[lessonId]/page.tsx

import { getSession } from '@/lib/auth/session'
import AppShellSidebar from '@/components/shell/AppSidebarNav'
import VideoPlayerPage from '@/components/courses/video-player'

interface WatchVideoPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default async function WatchVideoPage({ params }: WatchVideoPageProps) {
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
    name: 'Student User',
    email: 'student@example.com',
    primaryRole: session.primaryRole || 'student',
    image: undefined
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppShellSidebar user={user} />
      <VideoPlayerPage courseId={params.courseId} lessonId={params.lessonId} />
    </div>
  )
}