
// /src/app/dashboard/admin/page.tsx

import { requireRole } from '@/lib/auth/utils';
import { getPendingRoleRequests } from '@/lib/auth/role-actions';
import { RoleRequestsTable } from '@/components/admin/role-requests-table';

export default async function AdminDashboardPage() {
  const session = await requireRole('admin');
  const { requests } = await getPendingRoleRequests();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage users, roles, and platform settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Pending Requests</h3>
          <p className="text-2xl font-bold text-orange-600">
            {requests?.length || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">-</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Your Role</h3>
          <p className="text-2xl font-bold text-purple-600 capitalize">
            {session.primaryRole}
          </p>
        </div>
      </div>

      {/* Role Requests Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Role Requests
        </h2>
        {requests && requests.length > 0 ? (
          <RoleRequestsTable initialRequests={requests} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-lg font-medium">No pending role requests</p>
            <p className="text-sm">All role requests have been processed.</p>
          </div>
        )}
      </div>

      {/* Admin Tools Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Admin Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a 
            href="/dashboard/admin/users" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">User Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage all users and their roles</p>
          </a>
          
          <a 
            href="/dashboard/admin/analytics" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">View platform usage statistics</p>
          </a>
          
          <a 
            href="/dashboard/admin/settings" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">System Settings</h3>
            <p className="text-sm text-gray-600 mt-1">Configure platform settings</p>
          </a>
        </div>
      </div>
    </div>
  );
}