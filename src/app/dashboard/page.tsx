

// // /src/app/dashboard/page.tsx

// // /src/app/dashboard/page.tsx

// import { withSessionRefresh } from '@/lib/auth/utils';
// import { checkAuthStatus } from '@/lib/auth/actions';

// export default async function DashboardPage() {
//   // Use withSessionRefresh to automatically refresh session if needed
//   const session = await withSessionRefresh();
//   const authStatus = await checkAuthStatus();

//   // Calculate session expiry time safely
//   const sessionExpiry = session.expires ? Math.round((new Date(session.expires).getTime() - Date.now()) / (60 * 1000)) : 0;

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Welcome back, {session.name}!
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Here&apos;s what&apos;s happening with your learning journey today.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h3 className="font-semibold text-gray-900 mb-2">Your Role</h3>
//           <div className="flex items-center space-x-2">
//             <p className="text-2xl font-bold text-blue-600 capitalize">
//               {session.primaryRole}
//             </p>
//             {session.primaryRole !== 'student' && (
//               <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                 Upgraded
//               </span>
//             )}
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h3 className="font-semibold text-gray-900 mb-2">Enrolled Courses</h3>
//           <p className="text-2xl font-bold text-green-600">0</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h3 className="font-semibold text-gray-900 mb-2">Learning Progress</h3>
//           <p className="text-2xl font-bold text-purple-600">0%</p>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm border">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
//         <div className="space-y-3">
//           <a 
//             href="/courses" 
//             className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             <div className="font-medium text-gray-900">Browse Courses</div>
//             <div className="text-sm text-gray-600">Explore available courses</div>
//           </a>
          
//           {session.roles.includes('instructor') && (
//             <a 
//               href="/dashboard/instructor" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Instructor Dashboard</div>
//               <div className="text-sm text-gray-600">Manage your courses and students</div>
//             </a>
//           )}
          
//           <a 
//             href="/dashboard/profile" 
//             className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             <div className="font-medium text-gray-900">Update Profile</div>
//             <div className="text-sm text-gray-600">Complete your profile information</div>
//           </a>

//           {session.primaryRole === 'student' && (
//             <a 
//               href="/dashboard/request-upgrade" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Request Role Upgrade</div>
//               <div className="text-sm text-gray-600">Upgrade to instructor or admin role</div>
//             </a>
//           )}
//         </div>
//       </div>

//       {/* Session Info (for debugging - remove in production) */}
//       <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <h4 className="font-semibold text-blue-900 mb-2">Session Information</h4>
//         <p className="text-sm text-blue-700">
//           Session expires in: {sessionExpiry} minutes
//         </p>
//         <p className="text-sm text-blue-700">
//           Roles: {session.roles?.join(', ') || 'No roles assigned'}
//         </p>
//         <p className="text-sm text-blue-700">
//           Auth Status: {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
//         </p>
//         {authStatus.user && (
//           <p className="text-sm text-blue-700">
//             User: {authStatus.user.name} ({authStatus.user.email})
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }





















// /src/app/dashboard/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { checkAuthStatus } from '@/lib/auth/actions';
import { getInstructorCourses } from '@/lib/db/queries/courses';
import { getRoleRequests } from '@/lib/db/queries/roles';
import { sql } from '@/lib/db/index';

export default async function DashboardPage() {
  // Use withSessionRefresh to automatically refresh session if needed
  const session = await withSessionRefresh();
  const authStatus = await checkAuthStatus();

  // Calculate session expiry time safely
  const sessionExpiry = session.expires ? Math.round((new Date(session.expires).getTime() - Date.now()) / (60 * 1000)) : 0;

  // Role-based data fetching
  let roleSpecificData = {
    enrolledCourses: 0,
    learningProgress: 0,
    instructorCourses: 0,
    totalStudents: 0,
    pendingRoleRequests: 0,
    totalUsers: 0
  };

  try {
    if (session.primaryRole === 'student') {
      // Get student-specific data
      const enrolledCourses = await sql`
        SELECT COUNT(*) as count FROM enrollments 
        WHERE user_id = ${session.userId} AND status = 'active'
      `;
      roleSpecificData.enrolledCourses = parseInt(enrolledCourses[0]?.count || '0');

      // Get learning progress (simplified - you'll need to implement this based on your progress tracking)
      const progress = await sql`
        SELECT COALESCE(AVG(progress_percentage), 0) as average_progress 
        FROM enrollments 
        WHERE user_id = ${session.userId} AND status = 'active'
      `;
      roleSpecificData.learningProgress = Math.round(parseFloat(progress[0]?.average_progress || '0'));

    } else if (session.primaryRole === 'instructor') {
      // Get instructor-specific data
      const instructorCourses = await getInstructorCourses(session.userId);
      roleSpecificData.instructorCourses = instructorCourses.length;

      // Calculate total students across all courses
      const totalStudents = instructorCourses.reduce((total, course) => {
        return total + (course.enrolled_students_count || 0);
      }, 0);
      roleSpecificData.totalStudents = totalStudents;

      // Get course completion stats
      const publishedCourses = instructorCourses.filter(course => course.is_published);
      const draftCourses = instructorCourses.filter(course => !course.is_published);
      
      // For demo - you might want more sophisticated progress tracking
      roleSpecificData.learningProgress = publishedCourses.length > 0 ? 
        Math.round((publishedCourses.length / instructorCourses.length) * 100) : 0;

    } else if (session.primaryRole === 'admin') {
      // Get admin-specific data
      const totalUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_active = true`;
      roleSpecificData.totalUsers = parseInt(totalUsers[0]?.count || '0');

      const pendingRequests = await getRoleRequests({ status: 'pending' });
      roleSpecificData.pendingRoleRequests = pendingRequests.length;

      // Get platform statistics
      const totalCourses = await sql`SELECT COUNT(*) as count FROM courses WHERE is_published = true`;
      roleSpecificData.enrolledCourses = parseInt(totalCourses[0]?.count || '0');
    }
  } catch (error) {
    console.error('Error fetching role-specific data:', error);
    // Continue with default values if there's an error
  }

  // Role-based dashboard sections
  const renderRoleSpecificCards = () => {
    switch (session.primaryRole) {
      case 'student':
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Enrolled Courses</h3>
              <p className="text-2xl font-bold text-green-600">{roleSpecificData.enrolledCourses}</p>
              <p className="text-sm text-gray-600 mt-1">Active courses you're taking</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Learning Progress</h3>
              <p className="text-2xl font-bold text-purple-600">{roleSpecificData.learningProgress}%</p>
              <p className="text-sm text-gray-600 mt-1">Average completion rate</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Certificates Earned</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Completed course certificates</p>
            </div>
          </>
        );

      case 'instructor':
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">My Courses</h3>
              <p className="text-2xl font-bold text-green-600">{roleSpecificData.instructorCourses}</p>
              <p className="text-sm text-gray-600 mt-1">Total courses created</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Total Students</h3>
              <p className="text-2xl font-bold text-purple-600">{roleSpecificData.totalStudents}</p>
              <p className="text-sm text-gray-600 mt-1">Across all your courses</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Course Performance</h3>
              <p className="text-2xl font-bold text-blue-600">{roleSpecificData.learningProgress}%</p>
              <p className="text-sm text-gray-600 mt-1">Published courses</p>
            </div>
          </>
        );

      case 'admin':
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Total Users</h3>
              <p className="text-2xl font-bold text-green-600">{roleSpecificData.totalUsers}</p>
              <p className="text-sm text-gray-600 mt-1">Active platform users</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Pending Requests</h3>
              <p className="text-2xl font-bold text-orange-600">{roleSpecificData.pendingRoleRequests}</p>
              <p className="text-sm text-gray-600 mt-1">Role upgrade requests</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Published Courses</h3>
              <p className="text-2xl font-bold text-blue-600">{roleSpecificData.enrolledCourses}</p>
              <p className="text-sm text-gray-600 mt-1">Active courses on platform</p>
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Enrolled Courses</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Learning Progress</h3>
              <p className="text-2xl font-bold text-purple-600">0%</p>
            </div>
          </>
        );
    }
  };

  const renderRoleSpecificActions = () => {
    switch (session.primaryRole) {
      case 'student':
        return (
          <>
            <a 
              href="/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Browse Courses</div>
              <div className="text-sm text-gray-600">Explore available courses to enroll</div>
            </a>
            
            <a 
              href="/dashboard/profile" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Update Profile</div>
              <div className="text-sm text-gray-600">Complete your profile information</div>
            </a>

            <a 
              href="/dashboard/request-upgrade" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Request Role Upgrade</div>
              <div className="text-sm text-gray-600">Upgrade to instructor or admin role</div>
            </a>

            {roleSpecificData.enrolledCourses > 0 && (
              <a 
                href="/dashboard/my-courses" 
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">My Learning</div>
                <div className="text-sm text-gray-600">Continue your enrolled courses</div>
              </a>
            )}
          </>
        );

      case 'instructor':
        return (
          <>
            <a 
              href="/dashboard/instructor/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Manage Courses</div>
              <div className="text-sm text-gray-600">View and edit your courses</div>
            </a>
            
            <a 
              href="/dashboard/instructor/create" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Create New Course</div>
              <div className="text-sm text-gray-600">Start building a new course</div>
            </a>

            <a 
              href="/dashboard/instructor" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Instructor Analytics</div>
              <div className="text-sm text-gray-600">View course performance and student progress</div>
            </a>

            <a 
              href="/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Browse Courses</div>
              <div className="text-sm text-gray-600">Explore other courses on the platform</div>
            </a>
          </>
        );

      case 'admin':
        return (
          <>
            <a 
              href="/dashboard/admin" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Admin Dashboard</div>
              <div className="text-sm text-gray-600">Manage users, roles, and platform settings</div>
            </a>

            {roleSpecificData.pendingRoleRequests > 0 && (
              <a 
                href="/dashboard/admin/role-requests" 
                className="block w-full text-left p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="font-medium text-orange-900">Review Role Requests</div>
                <div className="text-sm text-orange-700">
                  {roleSpecificData.pendingRoleRequests} pending request{roleSpecificData.pendingRoleRequests !== 1 ? 's' : ''}
                </div>
              </a>
            )}

            <a 
              href="/dashboard/admin/users" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">User Management</div>
              <div className="text-sm text-gray-600">Manage all platform users</div>
            </a>

            <a 
              href="/dashboard/admin/categories" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Category Management</div>
              <div className="text-sm text-gray-600">Manage course categories and tags</div>
            </a>

            <a 
              href="/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Browse Courses</div>
              <div className="text-sm text-gray-600">Explore available courses to enroll</div>
            </a>
            
          </>
        );

      default:
        return (
          <>
            <a 
              href="/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Browse Courses</div>
              <div className="text-sm text-gray-600">Explore available courses</div>
            </a>
            
            <a 
              href="/dashboard/profile" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Update Profile</div>
              <div className="text-sm text-gray-600">Complete your profile information</div>
            </a>
          </>
        );
    }
  };

  const getWelcomeMessage = () => {
    const name = session.name || 'there';
    
    switch (session.primaryRole) {
      case 'student':
        return `Ready to continue your learning journey, ${name}?`;
      case 'instructor':
        return `Welcome back, Instructor ${name}! Ready to inspire some learners today?`;
      case 'admin':
        return `Welcome back, Admin ${name}. Here's your platform overview.`;
      default:
        return `Welcome back, ${name}!`;
    }
  };

  const getRoleBadgeColor = () => {
    switch (session.primaryRole) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'instructor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              {getWelcomeMessage()}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
            {session.primaryRole?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Role-specific statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {renderRoleSpecificCards()}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {renderRoleSpecificActions()}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Your recent activity will appear here</p>
          <p className="text-sm mt-2">Start exploring the platform to see your activity</p>
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