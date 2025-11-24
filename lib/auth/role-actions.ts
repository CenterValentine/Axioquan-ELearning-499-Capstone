
// /lib/auth/role-actions.ts

'use server';

import { 
  createRoleRequest, 
  getRoleRequests, 
  updateRoleRequestStatus, 
  assignRoleToUser,
  getAllRoles,
  getRoleByName,
  getRoleById,
  canUserRequestRole,
  getUserRoles,
  deleteRoleRequest,
  setUserPrimaryRole
} from '@/lib/db/queries/roles';
import { getSession } from './session';
import { requireRole, requireAnyRole } from './utils';
import { notifyRoleUpdate, notifyRequestDeleted, notifyNewRequest } from '@/lib/sse/actions';
import { updateUserSession } from './session';

/**
 * Get available roles for upgrade with enhanced error handling
 */
export async function getAvailableRolesForUpgrade(): Promise<{
  success: boolean;
  roles?: any[];
  errors?: string[];
}> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        errors: ['Authentication required'],
      };
    }

    console.log('🔄 Fetching available roles for upgrade...');
    
    let allRoles: any[] = [];
    let userRoles: any[] = [];

    try {
      // Try to get roles from database
      allRoles = await getAllRoles();
      userRoles = await getUserRoles(session.userId);
      console.log(`✅ Found ${allRoles.length} total roles, user has ${userRoles.length} roles`);
    } catch (dbError) {
      console.error('❌ Database error, using fallback roles:', dbError);
      // Use fallback roles if database fails
      allRoles = [
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
        }
      ];
      userRoles = [{ name: 'student' }]; // Assume user is student as fallback
    }

    // FIXED: Filter roles that user can request
    const availableRoles = allRoles.filter(role => {
      // Allow these specific roles for upgrade (override allow_self_assign setting)
      const allowedUpgradeRoles = ['instructor', 'teaching_assistant'];
      
      // Only show allowed upgrade roles
      if (!allowedUpgradeRoles.includes(role.name)) return false;
      
      // Don't show roles the user already has
      const hasRole = userRoles.some(userRole => userRole.name === role.name);
      if (hasRole) {
        console.log(`❌ Skipping role ${role.name} - user already has it`);
        return false;
      }
      
      // Don't show student role as upgrade option
      if (role.name === 'student') return false;
      
      console.log(`✅ Allowing role ${role.name} for upgrade`);
      return true;
    });

    console.log(`✅ ${availableRoles.length} roles available for upgrade:`, availableRoles.map(r => r.name));
    
    return {
      success: true,
      roles: availableRoles,
    };
  } catch (error: any) {
    console.error('❌ Error in getAvailableRolesForUpgrade:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Get user's role requests with better error handling
 */
export async function getUserRoleRequests(): Promise<{
  success: boolean;
  requests?: any[];
  errors?: string[];
}> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        errors: ['Authentication required'],
      };
    }

    console.log('🔄 Fetching role requests for user:', session.userId);
    
    let requests: any[] = [];
    try {
      requests = await getRoleRequests({ userId: session.userId });
      console.log(`✅ Found ${requests.length} role requests for user`);
    } catch (dbError) {
      console.error('❌ Database error fetching role requests:', dbError);
      requests = [];
    }

    // Transform the data to match what the component expects
    const transformedRequests = requests.map(request => ({
      id: request.id,
      requested_role_name: request.requested_role_name || request.requested_role_id,
      justification: request.justification,
      status: request.status,
      created_at: request.created_at,
      reviewed_at: request.reviewed_at,
      rejection_reason: request.rejection_reason,
      admin_notes: request.admin_notes,
      qualifications: request.qualifications,
      portfolio_links: request.portfolio_links,
      teaching_experience: request.teaching_experience,
    }));

    return {
      success: true,
      requests: transformedRequests,
    };
  } catch (error: any) {
    console.error('❌ Error fetching user role requests:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Submit a role upgrade request with real-time notifications
 */
export async function submitRoleUpgradeRequest(requestData: {
  requestedRole: string;
  justification: string;
  qualifications?: string;
  portfolioLinks?: string[];
  teachingExperience?: string;
}): Promise<{
  success: boolean;
  message: string;
  requestId?: string;
  errors?: string[];
}> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to submit a role request'],
      };
    }

    // Check if user can request this role
    const canRequest = await canUserRequestRole(session.userId, requestData.requestedRole);
    if (!canRequest) {
      return {
        success: false,
        message: 'Cannot request this role',
        errors: ['You cannot request this role or you already have it'],
      };
    }

    // Get the role ID
    const role = await getRoleByName(requestData.requestedRole);
    if (!role) {
      return {
        success: false,
        message: 'Role not found',
        errors: ['Requested role does not exist'],
      };
    }

    // Create the role request
    const result = await createRoleRequest({
      userId: session.userId,
      requestedRoleId: role.id,
      justification: requestData.justification,
      qualifications: requestData.qualifications,
      portfolioLinks: requestData.portfolioLinks,
      teachingExperience: requestData.teachingExperience,
    });

    if (result.success && result.request) {
      // Notify admins about new request
      const adminUsers = await getAdminUsers();
      for (const admin of adminUsers) {
        await notifyNewRequest(admin.id, result.request);
      }
    }

    return {
      ...result,
      requestId: result.request?.id
    };
  } catch (error: any) {
    console.error('❌ Error submitting role upgrade request:', error);
    return {
      success: false,
      message: 'Failed to submit role request',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}



// /lib/auth/role-actions.ts - Add session refresh

// /lib/auth/role-actions.ts - Update the approveRoleRequest function

/**
 * Approve a role request with real-time updates, session refresh, and forced logout
 */
export async function approveRoleRequest(requestId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await requireRole('admin');

    // Update the request status
    const updateResult = await updateRoleRequestStatus({
      requestId,
      status: 'approved',
      reviewedBy: session.userId,
      adminNotes: 'Role request approved by admin',
    });

    if (!updateResult.success) {
      return updateResult;
    }

    // Get the request details to assign the role
    const requests = await getRoleRequests();
    const request = requests.find(req => req.id === requestId);
    
    if (!request) {
      return {
        success: false,
        message: 'Role request not found',
        errors: ['Role request not found'],
      };
    }

    // ✅ FIX: Get the role name from the role ID
    const requestedRole = await getRoleById(request.requested_role_id);
    const requestedRoleName = requestedRole?.name;

    console.log('🔄 Starting role upgrade for user:', request.user_id);
    console.log('🎯 Requested role ID:', request.requested_role_id);
    console.log('🎯 Requested role name:', requestedRoleName);

    // ✅ CRITICAL FIX: Get the student role ID to remove it
    const { sql } = await import('@/lib/db');
    const studentRole = await sql`
      SELECT id FROM roles WHERE name = 'student' LIMIT 1
    `;
    const studentRoleId = studentRole[0]?.id;

    // ✅ CRITICAL FIX: Remove the student role if it exists
    if (studentRoleId) {
      await sql`
        DELETE FROM user_roles 
        WHERE user_id = ${request.user_id} AND role_id = ${studentRoleId}
      `;
      console.log('✅ Removed student role');
    }

    // ✅ CRITICAL FIX: Remove ALL existing primary flags
    await sql`
      UPDATE user_roles 
      SET is_primary = false 
      WHERE user_id = ${request.user_id}
    `;
    console.log('✅ Unset all primary roles');

    // Check if user already has the requested role
    const existingRole = await sql`
      SELECT id FROM user_roles 
      WHERE user_id = ${request.user_id} AND role_id = ${request.requested_role_id}
      LIMIT 1
    `;

    if (existingRole.length > 0) {
      // User already has the role, just update it to primary
      console.log('🔄 User already has role, updating to primary');
      await sql`
        UPDATE user_roles 
        SET is_primary = true 
        WHERE user_id = ${request.user_id} AND role_id = ${request.requested_role_id}
      `;
    } else {
      // User doesn't have the role, assign it as primary
      console.log('🔄 Assigning new role as primary');
      await sql`
        INSERT INTO user_roles (
          user_id,
          role_id,
          assigned_by,
          is_primary
        ) VALUES (
          ${request.user_id},
          ${request.requested_role_id},
          ${session.userId},
          true
        )
      `;
    }

    // Verify the assignment worked
    const finalRoles = await sql`
      SELECT r.name, ur.is_primary
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ${request.user_id}
      ORDER BY ur.is_primary DESC
    `;
    console.log('✅ Final user roles:', finalRoles);

    // Get the new role name for notification
    const role = await getRoleById(request.requested_role_id);
    const newRoleName = role?.name;

    console.log('🎯 New primary role:', newRoleName);

    // ✅ CRITICAL: Invalidate all user sessions to force re-login
    console.log('🔄 Invalidating all sessions for user:', request.user_id);
    const { invalidateUserSessions } = await import('./session');
    const sessionsInvalidated = await invalidateUserSessions(request.user_id);
    
    if (sessionsInvalidated) {
      console.log('✅ Successfully invalidated all user sessions');
    } else {
      console.warn('⚠️ Failed to invalidate user sessions');
    }

    // Send real-time notification to the user about the forced logout
    await notifyRoleUpdate(request.user_id, requestId, 'approved', newRoleName);

    return {
      success: true,
      message: 'Role request approved, role assigned, and user sessions invalidated. User must log in again to see changes.',
    };
  } catch (error: any) {
    console.error('❌ Error approving role request:', error);
    return {
      success: false,
      message: 'Failed to approve role request',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}


/**
 * Reject a role request with real-time updates
 */
export async function rejectRoleRequest(requestId: string, rejectionReason: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await requireRole('admin');

    const result = await updateRoleRequestStatus({
      requestId,
      status: 'rejected',
      reviewedBy: session.userId,
      rejectionReason,
      adminNotes: `Role request rejected: ${rejectionReason}`,
    });

    if (result.success) {
      // Get the request to notify the user
      const requests = await getRoleRequests();
      const request = requests.find(req => req.id === requestId);
      
      if (request) {
        await notifyRoleUpdate(request.user_id, requestId, 'rejected');
      }
    }

    return result;
  } catch (error: any) {
    console.error('❌ Error rejecting role request:', error);
    return {
      success: false,
      message: 'Failed to reject role request',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Delete role request with real-time updates
 */
export async function deleteUserRoleRequest(requestId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in'],
      };
    }

    // Verify the request belongs to the user
    const requests = await getRoleRequests({ userId: session.userId });
    const userRequest = requests.find(req => req.id === requestId);
    
    if (!userRequest) {
      return {
        success: false,
        message: 'Role request not found',
        errors: ['Role request not found or access denied'],
      };
    }

    // Only allow deletion of pending requests
    if (userRequest.status !== 'pending') {
      return {
        success: false,
        message: 'Cannot delete processed request',
        errors: ['Only pending requests can be deleted'],
      };
    }

    const result = await deleteRoleRequest(requestId);
    
    if (result.success) {
      // Notify user about deletion
      await notifyRequestDeleted(session.userId, requestId);
    }

    return result;
  } catch (error: any) {
    console.error('❌ Error deleting role request:', error);
    return {
      success: false,
      message: 'Failed to delete role request',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Permanently remove a role request from user's history (any status)
 */
export async function permanentlyRemoveRoleRequest(requestId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in'],
      };
    }

    // Verify the request belongs to the user
    const requests = await getRoleRequests({ userId: session.userId });
    const userRequest = requests.find(req => req.id === requestId);
    
    if (!userRequest) {
      return {
        success: false,
        message: 'Role request not found',
        errors: ['Role request not found or access denied'],
      };
    }

    const result = await deleteRoleRequest(requestId);
    
    if (result.success) {
      // Notify user about deletion
      await notifyRequestDeleted(session.userId, requestId);
    }

    return result;
  } catch (error: any) {
    console.error('❌ Error permanently removing role request:', error);
    return {
      success: false,
      message: 'Failed to remove role request',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Clear all user's role request history
 */
export async function clearAllRoleRequests(): Promise<{
  success: boolean;
  message: string;
  deletedCount?: number;
  errors?: string[];
}> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in'],
      };
    }

    // Get all user's requests
    const requests = await getRoleRequests({ userId: session.userId });
    
    if (requests.length === 0) {
      return {
        success: true,
        message: 'No role requests to clear',
        deletedCount: 0,
      };
    }

    let deletedCount = 0;
    const errors: string[] = [];

    // Delete each request
    for (const request of requests) {
      try {
        const result = await deleteRoleRequest(request.id);
        if (result.success) {
          deletedCount++;
          // Notify about each deletion
          await notifyRequestDeleted(session.userId, request.id);
        } else {
          errors.push(`Failed to delete request ${request.id}: ${result.message}`);
        }
      } catch (error: any) {
        errors.push(`Error deleting request ${request.id}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: `Cleared ${deletedCount} requests, but encountered ${errors.length} errors`,
        deletedCount,
        errors,
      };
    }

    return {
      success: true,
      message: `Successfully cleared ${deletedCount} role requests`,
      deletedCount,
    };
  } catch (error: any) {
    console.error('❌ Error clearing all role requests:', error);
    return {
      success: false,
      message: 'Failed to clear role requests',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Get pending role requests (Admin only)
 */
export async function getPendingRoleRequests(): Promise<{
  success: boolean;
  requests?: any[];
  errors?: string[];
}> {
  try {
    // Check if user is admin
    await requireRole('admin');

    const requests = await getRoleRequests({ status: 'pending' });
    
    return {
      success: true,
      requests,
    };
  } catch (error: any) {
    console.error('❌ Error fetching pending role requests:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

// Helper function to get admin users
async function getAdminUsers(): Promise<{ id: string }[]> {
  try {
    const { sql } = await import('@/lib/db');
    const admins = await sql`
      SELECT u.id 
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE r.name = 'admin' AND u.is_active = true
    `;
    return admins as { id: string }[];
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}