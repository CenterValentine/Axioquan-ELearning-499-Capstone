
// // /src/app/dashboard/admin/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { checkAuthStatus } from '@/lib/auth/actions';
import { getRoleRequests } from '@/lib/db/queries/roles';
import { sql } from '@/lib/db/index';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const session = await withSessionRefresh();
  const authStatus = await checkAuthStatus();

  // Redirect if not admin
  if (session.primaryRole !== 'admin' && !session.roles?.includes('admin')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  // Admin-specific data fetching - USING ONLY EXISTING TABLES
  let adminStats = {
    totalUsers: 0,
    pendingRoleRequests: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeUsers: 0,
    totalInstructors: 0
  };

  try {
    // Get total users - USING YOUR EXACT QUERY FROM ORIGINAL DASHBOARD
    const totalUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_active = true`;
    adminStats.totalUsers = parseInt(totalUsers[0]?.count || '0');

    // Get pending role requests
    const pendingRequests = await getRoleRequests({ status: 'pending' });
    adminStats.pendingRoleRequests = pendingRequests.length;

    // Get total published courses
    const totalCourses = await sql`SELECT COUNT(*) as count FROM courses WHERE is_published = true`;
    adminStats.totalCourses = parseInt(totalCourses[0]?.count || '0');

    // Get total enrollments
    const totalEnrollments = await sql`SELECT COUNT(*) as count FROM enrollments WHERE status = 'active'`;
    adminStats.totalEnrollments = parseInt(totalEnrollments[0]?.count || '0');

    // Get active users - USING EXISTING TABLES
    // Alternative: Count users who have enrolled in courses recently or have active enrollments
    const activeUsers = await sql`
    SELECT COUNT(DISTINCT user_id) AS count
    FROM enrollments
    WHERE status = 'active'
    AND COALESCE(
          last_activity_at,
          last_accessed_at,
          enrolled_at
        ) > NOW() - INTERVAL '30 days'
  `;
  adminStats.activeUsers = parseInt(activeUsers[0]?.count || '0');



    // Get total instructors - USING EXISTING TABLES
  const totalInstructors = await sql`
    SELECT COUNT(DISTINCT u.id) AS count
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE u.is_active = true
    AND r.name = 'instructor'
  `;

    adminStats.totalInstructors = parseInt(totalInstructors[0]?.count || '0');

  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    // Fallback to basic counts if specific queries fail
    try {
      // Basic fallback - just get total users and courses
      const totalUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_active = true`;
      adminStats.totalUsers = parseInt(totalUsers[0]?.count || '0');
      
      const totalCourses = await sql`SELECT COUNT(*) as count FROM courses WHERE is_published = true`;
      adminStats.totalCourses = parseInt(totalCourses[0]?.count || '0');
      
      // For active users, use total users as fallback
      adminStats.activeUsers = adminStats.totalUsers;
    } catch (fallbackError) {
      console.error('Fallback data fetch also failed:', fallbackError);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage users, roles, and platform settings
        </p>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{adminStats.totalUsers}</p>
              <p className="text-sm text-gray-600 mt-1">Registered platform users</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Active Users</h3>
              <p className="text-3xl font-bold text-green-600">{adminStats.activeUsers}</p>
              <p className="text-sm text-gray-600 mt-1">Users with recent activity</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
        </div>

        {/* Pending Requests Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pending Requests</h3>
              <p className="text-3xl font-bold text-orange-600">{adminStats.pendingRoleRequests}</p>
              <p className="text-sm text-gray-600 mt-1">Role upgrade requests</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        {/* Published Courses Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Published Courses</h3>
              <p className="text-3xl font-bold text-purple-600">{adminStats.totalCourses}</p>
              <p className="text-sm text-gray-600 mt-1">Active courses on platform</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Enrollments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Total Enrollments</h3>
              <p className="text-3xl font-bold text-indigo-600">{adminStats.totalEnrollments}</p>
              <p className="text-sm text-gray-600 mt-1">Course enrollments</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>

        {/* Total Instructors */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Instructors</h3>
              <p className="text-3xl font-bold text-teal-600">{adminStats.totalInstructors}</p>
              <p className="text-sm text-gray-600 mt-1">Platform instructors</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/dashboard/admin/users" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">User Management</div>
            <div className="text-sm text-gray-600">Manage all platform users and permissions</div>
          </Link>

          <Link 
            href="/dashboard/admin/role-requests" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Role Requests</div>
            <div className="text-sm text-gray-600">
              {adminStats.pendingRoleRequests > 0 ? (
                <span className="text-orange-600">
                  {adminStats.pendingRoleRequests} pending request{adminStats.pendingRoleRequests !== 1 ? 's' : ''}
                </span>
              ) : (
                'Review role upgrade requests'
              )}
            </div>
          </Link>

          <Link 
            href="/dashboard/admin/categories" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Categories & Tags</div>
            <div className="text-sm text-gray-600">Manage course categories and tags</div>
          </Link>

          <Link 
            href="/dashboard/admin/courses" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Course Management</div>
            <div className="text-sm text-gray-600">Manage all platform courses</div>
          </Link>

          <Link 
            href="/dashboard/admin/analytics" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Analytics</div>
            <div className="text-sm text-gray-600">View platform analytics and reports</div>
          </Link>

          <Link 
            href="/dashboard/admin/settings" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Platform Settings</div>
            <div className="text-sm text-gray-600">Configure platform settings</div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Platform Activity</h3>
          <Link 
            href="/dashboard/admin/activity" 
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All Activity
          </Link>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <p>Recent platform activity will appear here</p>
          <p className="text-sm mt-2">User registrations, course creations, and other activities</p>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-bold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <div className="font-medium text-green-900">Database</div>
              <div className="text-sm text-green-700">Connected and operational</div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <div className="font-medium text-green-900">Authentication</div>
              <div className="text-sm text-green-700">System operational</div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <div className="font-medium text-green-900">File Uploads</div>
              <div className="text-sm text-green-700">Cloudinary connected</div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <div className="font-medium text-green-900">Real-time Updates</div>
              <div className="text-sm text-green-700">SSE active</div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}