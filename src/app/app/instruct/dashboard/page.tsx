

// /src/app/dashboard/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { checkAuthStatus } from '@/lib/auth/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui/card';  


export default async function DashboardPage() {
  // Use withSessionRefresh to automatically refresh session if needed
  const session = await withSessionRefresh();
  const authStatus = await checkAuthStatus();

  // Calculate session expiry time safely
  const sessionExpiry = session.expires ? Math.round((new Date(session.expires).getTime() - Date.now()) / (60 * 1000)) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s what&apos;s happening with your learning journey today.
        </p>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

<Card>
  <CardHeader>
    <CardTitle>Active Courses</CardTitle>
    <CardContent className=" p-0 text-green-600 capitalize">
2
    </CardContent>
  </CardHeader>
</Card>


<Card>
  <CardHeader>
    <CardTitle>Total Students</CardTitle>
    <CardContent className=" p-0 text-purple-600 capitalize">
38
    </CardContent>
  </CardHeader>
</Card>



<Card>
  <CardHeader>
    <CardTitle>Avg. Rating</CardTitle>
    <CardContent className=" p-0 text-blue-600 capitalize">
3.7
    </CardContent>
  </CardHeader>
</Card>


<Card>
  <CardHeader>
    <CardTitle>Course Revenue</CardTitle>
    <CardContent className=" p-0 text-green-600 capitalize">
$12,450
    </CardContent>
  </CardHeader>
</Card>
        
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <a 
            href="app/courses" 
            className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Browse Courses</div>
            <div className="text-sm text-gray-600">Explore available courses</div>
          </a>
          
          {session.roles.includes('instructor') && (
            <a 
              href="app/instructor" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Instructor Dashboard</div>
              <div className="text-sm text-gray-600">Manage your courses and students</div>
            </a>
          )}
          
          <a 
            href="app/dashboard/profile" 
            className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Update Profile</div>
            <div className="text-sm text-gray-600">Complete your profile information</div>
          </a>

          {session.primaryRole === 'student' && (
            <a 
              href="app/request-upgrade" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Request Role Upgrade</div>
              <div className="text-sm text-gray-600">Upgrade to instructor or admin role</div>
            </a>
          )}
        </div>
      </div>

      {/* Session Info (for debugging - remove in production) */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Session Information</h4>
        <p className="text-sm text-blue-700">
          Session expires in: {sessionExpiry} minutes
        </p>
        <p className="text-sm text-blue-700">
          Roles: {session.roles?.join(', ') || 'No roles assigned'}
        </p>
        <p className="text-sm text-blue-700">
          Auth Status: {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </p>
        {authStatus.user && (
          <p className="text-sm text-blue-700">
            User: {authStatus.user.name} ({authStatus.user.email})
          </p>
        )}
      </div>
    </div>
  );
}
