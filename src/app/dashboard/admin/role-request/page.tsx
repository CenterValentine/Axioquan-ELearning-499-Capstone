// /src/app/dashboard/admin/role-requests/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { checkAuthStatus } from '@/lib/auth/actions';
import { getRoleRequests } from '@/lib/db/queries/roles';
import { RoleRequestsTable } from '@/components/admin/role-requests-table';
import Link from 'next/link';

interface RoleRequest {
  id: string;
  requester_name: string;
  requester_email: string;
  requested_role_name: string;
  justification: string;
  qualifications?: string;
  portfolio_links: string[];
  teaching_experience?: string;
  created_at: string;
  user_id: string;
}

export default async function AdminRoleRequestsPage() {
  const session = await withSessionRefresh();
  const authStatus = await checkAuthStatus();

  // Redirect if not admin
  if (session.primaryRole !== 'admin' && !session.roles?.includes('admin')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You do not have permission to access this page.</p>
          <Link 
            href="/dashboard" 
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Fetch role requests
  let roleRequests: RoleRequest[] = [];
  let error: string | null = null;
  
  try {
    const result = await getRoleRequests({ status: 'pending' });
    roleRequests = result as unknown as RoleRequest[];
  } catch (err) {
    console.error('Error fetching role requests:', err);
    error = 'Failed to load role requests';
  }

  // Count different types of requests
  const instructorCount = roleRequests.filter(r => r.requested_role_name === 'instructor').length;
  const assistantCount = roleRequests.filter(r => r.requested_role_name === 'teaching_assistant').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Requests Management</h1>
            <p className="text-gray-600 mt-2">
              Review and manage user role upgrade requests
            </p>
          </div>
          <div className="flex space-x-3">
            <Link 
              href="/dashboard/admin"
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <Link 
              href="/dashboard/admin"
              className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              View Admin Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Pending Requests</h3>
          <p className="text-3xl font-bold text-orange-600">{roleRequests.length}</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Instructor Requests</h3>
          <p className="text-3xl font-bold text-blue-600">{instructorCount}</p>
          <p className="text-sm text-gray-600 mt-1">Requesting instructor role</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Assistant Requests</h3>
          <p className="text-3xl font-bold text-green-600">{assistantCount}</p>
          <p className="text-sm text-gray-600 mt-1">Requesting teaching assistant</p>
        </div>
      </div>

      {/* Role Requests Table - Main Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <Link 
              href="/dashboard/admin/role-requests" 
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </Link>
          </div>
        ) : (
          <RoleRequestsTable initialRequests={roleRequests} />
        )}
      </div>

      {/* Instructions Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to Review Requests</h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-800">
          <li>Check the user's qualifications and experience</li>
          <li>Review portfolio links (if provided)</li>
          <li>Consider the justification for role upgrade</li>
          <li>Use "Approve" for valid requests or "Reject" with a reason</li>
          <li>Users will receive notifications about their request status</li>
        </ul>
        <div className="mt-4 text-sm text-blue-700">
          <p><strong>Note:</strong> All requests are processed in real-time. Approved users will receive their new roles immediately.</p>
        </div>
      </div>

      {/* Recent Processed Requests - FIXED: No onClick in Server Component */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recently Processed</h3>
          <Link 
            href="/dashboard/admin/role-requests" 
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Refresh Page
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Recently approved/rejected requests will appear here</p>
          <p className="text-sm mt-2">This helps track your decision history</p>
        </div>
      </div>
    </div>
  );
}