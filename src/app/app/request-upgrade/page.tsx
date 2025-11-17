

// /src/app/dashboard/request-upgrade/page.tsx


import { withSessionRefresh } from '@/lib/auth/utils';
import { getAvailableRolesForUpgrade, getUserRoleRequests } from '@/lib/auth/role-actions';
import { RoleUpgradeForm } from '@/components/users/role-upgrade-form';
import { RoleRequestsList } from '@/components/users/role-requests-list';
import { getAllRoles } from '@/lib/db/queries/roles';

export default async function RequestUpgradePage() {
  const session = await withSessionRefresh();
  
  // Get available roles with better error handling
  let availableRoles = [];
  try {
    const rolesResult = await getAvailableRolesForUpgrade();
    availableRoles = rolesResult.roles || [];
    
    // If no roles from database, use fallback
    if (availableRoles.length === 0) {
      console.log('🔄 No roles from database, using fallback...');
      const allRoles = await getAllRoles();
      // Filter to only show roles that allow self-assignment (instructor, teaching_assistant)
      availableRoles = allRoles.filter(role => 
        role.allow_self_assign && 
        role.name !== 'student' && // Don't show student as upgrade option
        role.name !== 'admin'      // Don't show admin as self-assignable
      );
    }
  } catch (error) {
    console.error('❌ Error fetching available roles:', error);
    // Use hardcoded fallback roles
    availableRoles = [
      {
        id: 'fallback-instructor',
        name: 'instructor',
        description: 'Content creator & course manager with teaching capabilities',
        permissions: {
          can_create_courses: true,
          can_manage_content: true,
          can_grade_students: true,
          can_manage_own_courses: true
        },
        hierarchy_level: 3,
        is_system_role: true,
        allow_self_assign: false,
        created_at: new Date()
      },
      {
        id: 'fallback-teaching-assistant',
        name: 'teaching_assistant',
        description: 'Grading support and student assistance for instructors',
        permissions: {
          can_grade_students: true,
          can_assist_courses: true,
          can_communicate_students: true
        },
        hierarchy_level: 2,
        is_system_role: true,
        allow_self_assign: false,
        created_at: new Date()
      }
    ];
  }

  // Get user's role requests
  let userRequests = [];
  try {
    const requestsResult = await getUserRoleRequests();
    userRequests = requestsResult.requests || [];
  } catch (error) {
    console.error('❌ Error fetching user role requests:', error);
    userRequests = [];
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Request Role Upgrade
        </h1>
        <p className="text-gray-600 mt-2">
          Request additional permissions and capabilities for your account.
        </p>
        {availableRoles.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Note:</strong> No upgrade roles are currently available. 
              This might be a temporary issue. Please try again later.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upgrade Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Request New Role
          </h2>
          <RoleUpgradeForm availableRoles={availableRoles} />
        </div>

        {/* Previous Requests */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Role Requests
          </h2>
          <RoleRequestsList requests={userRequests} />
        </div>
      </div>
    </div>
  );
}