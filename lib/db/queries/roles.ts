

// /lib/db/queries/roles.ts

import { sql } from '../index';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  hierarchy_level: number;
  is_system_role: boolean;
  allow_self_assign: boolean;
  created_at: Date;
}

export interface RoleRequest {
  id: string;
  user_id: string;
  requested_role_id: string;
  request_type: string;
  justification: string;
  qualifications?: string;
  portfolio_links: string[];
  teaching_experience?: string;
  supporting_documents: any;
  status: string;
  priority: string;
  reviewed_by?: string;
  reviewed_at?: Date;
  admin_notes?: string;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get all available roles
 */
export async function getAllRoles(): Promise<Role[]> {
  try {
    const roles = await sql`
      SELECT * FROM roles ORDER BY hierarchy_level ASC
    `;
    return roles as Role[];
  } catch (error) {
    console.error('❌ Error fetching roles:', error);
    return [];
  }
}

/**
 * Get role by name
 */
export async function getRoleByName(name: string): Promise<Role | null> {
  try {
    const roles = await sql`
      SELECT * FROM roles WHERE name = ${name} LIMIT 1
    `;
    return roles[0] as Role || null;
  } catch (error) {
    console.error('❌ Error fetching role by name:', error);
    return null;
  }
}

/**
 * Get role by ID
 */
export async function getRoleById(id: string): Promise<Role | null> {
  try {
    const roles = await sql`
      SELECT * FROM roles WHERE id = ${id} LIMIT 1
    `;
    return roles[0] as Role || null;
  } catch (error) {
    console.error('❌ Error fetching role by ID:', error);
    return null;
  }
}

/**
 * Create a new role request
 */
export async function createRoleRequest(requestData: {
  userId: string;
  requestedRoleId: string;
  justification: string;
  qualifications?: string;
  portfolioLinks?: string[];
  teachingExperience?: string;
  supportingDocuments?: any;
}): Promise<{
  success: boolean;
  message: string;
  request?: RoleRequest;
  errors?: string[];
}> {
  try {
    const newRequest = await sql`
      INSERT INTO role_requests (
        user_id,
        requested_role_id,
        justification,
        qualifications,
        portfolio_links,
        teaching_experience,
        supporting_documents,
        status
      ) VALUES (
        ${requestData.userId},
        ${requestData.requestedRoleId},
        ${requestData.justification},
        ${requestData.qualifications},
        ${requestData.portfolioLinks || []},
        ${requestData.teachingExperience},
        ${requestData.supportingDocuments || {}},
        'pending'
      )
      RETURNING *
    `;

    return {
      success: true,
      message: 'Role request submitted successfully',
      request: newRequest[0] as RoleRequest,
    };
  } catch (error: any) {
    console.error('❌ Error creating role request:', error);
    return {
      success: false,
      message: 'Failed to submit role request',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Get all role requests with filters
 */
export async function getRoleRequests(filters?: {
  status?: string;
  userId?: string;
  requestedRoleId?: string;
}): Promise<RoleRequest[]> {
  try {
    let query = sql`
      SELECT rr.*, 
             u.username as requester_username,
             u.email as requester_email,
             u.name as requester_name,
             r.name as requested_role_name
      FROM role_requests rr
      JOIN users u ON rr.user_id = u.id
      JOIN roles r ON rr.requested_role_id = r.id
      WHERE 1=1
    `;

    if (filters?.status) {
      query = sql`${query} AND rr.status = ${filters.status}`;
    }

    if (filters?.userId) {
      query = sql`${query} AND rr.user_id = ${filters.userId}`;
    }

    if (filters?.requestedRoleId) {
      query = sql`${query} AND rr.requested_role_id = ${filters.requestedRoleId}`;
    }

    query = sql`${query} ORDER BY rr.created_at DESC`;

    const requests = await query;
    return requests as RoleRequest[];
  } catch (error) {
    console.error('❌ Error fetching role requests:', error);
    return [];
  }
}

/**
 * Update role request status (approve/reject)
 */
export async function updateRoleRequestStatus(requestData: {
  requestId: string;
  status: 'approved' | 'rejected' | 'under_review';
  reviewedBy: string;
  adminNotes?: string;
  rejectionReason?: string;
}): Promise<{
  success: boolean;
  message: string;
  request?: RoleRequest;
  errors?: string[];
}> {
  try {
    const updatedRequest = await sql`
      UPDATE role_requests 
      SET 
        status = ${requestData.status},
        reviewed_by = ${requestData.reviewedBy},
        reviewed_at = NOW(),
        admin_notes = ${requestData.adminNotes},
        rejection_reason = ${requestData.rejectionReason},
        updated_at = NOW()
      WHERE id = ${requestData.requestId}
      RETURNING *
    `;

    if (updatedRequest.length === 0) {
      return {
        success: false,
        message: 'Role request not found',
        errors: ['Role request not found'],
      };
    }

    return {
      success: true,
      message: `Role request ${requestData.status} successfully`,
      request: updatedRequest[0] as RoleRequest,
    };
  } catch (error: any) {
    console.error('❌ Error updating role request:', error);
    return {
      success: false,
      message: 'Failed to update role request',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Assign role to user (used when approving role requests)
 */
export async function assignRoleToUser(assignmentData: {
  userId: string;
  roleId: string;
  assignedBy: string;
  isPrimary?: boolean;
}): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // First, check if user already has this role
    const existingRole = await sql`
      SELECT id FROM user_roles 
      WHERE user_id = ${assignmentData.userId} AND role_id = ${assignmentData.roleId}
      LIMIT 1
    `;

    if (existingRole.length > 0) {
      return {
        success: false,
        message: 'User already has this role',
        errors: ['User already has this role assigned'],
      };
    }

    // If setting as primary, first unset all other primary roles
    if (assignmentData.isPrimary) {
      await sql`
        UPDATE user_roles 
        SET is_primary = false 
        WHERE user_id = ${assignmentData.userId}
      `;
    }

    // Assign the new role
    await sql`
      INSERT INTO user_roles (
        user_id,
        role_id,
        assigned_by,
        is_primary
      ) VALUES (
        ${assignmentData.userId},
        ${assignmentData.roleId},
        ${assignmentData.assignedBy},
        ${assignmentData.isPrimary || false}
      )
    `;

    return {
      success: true,
      message: 'Role assigned successfully',
    };
  } catch (error: any) {
    console.error('❌ Error assigning role to user:', error);
    return {
      success: false,
      message: 'Failed to assign role',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Set user's primary role (and unset others)
 */
export async function setUserPrimaryRole(userId: string, roleId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // First, unset all primary roles for this user
    await sql`
      UPDATE user_roles 
      SET is_primary = false 
      WHERE user_id = ${userId}
    `;

    // Then set the new primary role
    const result = await sql`
      UPDATE user_roles 
      SET is_primary = true 
      WHERE user_id = ${userId} AND role_id = ${roleId}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Role assignment not found',
        errors: ['Role assignment not found for this user'],
      };
    }

    return {
      success: true,
      message: 'Primary role updated successfully',
    };
  } catch (error: any) {
    console.error('❌ Error setting primary role:', error);
    return {
      success: false,
      message: 'Failed to set primary role',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Get user's primary role
 */
export async function getUserPrimaryRole(userId: string): Promise<string | null> {
  try {
    const result = await sql`
      SELECT r.name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ${userId} AND ur.is_primary = true
      LIMIT 1
    `;

    return result[0]?.name || null;
  } catch (error) {
    console.error('❌ Error getting user primary role:', error);
    return null;
  }
}

/**
 * Remove role from user
 */
export async function removeRoleFromUser(removalData: {
  userId: string;
  roleId: string;
}): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const result = await sql`
      DELETE FROM user_roles 
      WHERE user_id = ${removalData.userId} AND role_id = ${removalData.roleId}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Role assignment not found',
        errors: ['Role assignment not found'],
      };
    }

    return {
      success: true,
      message: 'Role removed successfully',
    };
  } catch (error: any) {
    console.error('❌ Error removing role from user:', error);
    return {
      success: false,
      message: 'Failed to remove role',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Get user's current roles
 */
export async function getUserRoles(userId: string): Promise<Role[]> {
  try {
    const roles = await sql`
      SELECT r.* 
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ${userId}
      ORDER BY ur.is_primary DESC, r.hierarchy_level DESC
    `;
    return roles as Role[];
  } catch (error) {
    console.error('❌ Error fetching user roles:', error);
    return [];
  }
}

/**
 * Check if user can request a specific role
 */
export async function canUserRequestRole(userId: string, roleName: string): Promise<boolean> {
  try {
    const role = await getRoleByName(roleName);
    if (!role) return false;

    // Check if role allows self-assignment
    if (!role.allow_self_assign) return false;

    // Check if user already has this role
    const userRoles = await getUserRoles(userId);
    const hasRole = userRoles.some(userRole => userRole.name === roleName);
    
    return !hasRole;
  } catch (error) {
    console.error('❌ Error checking role request eligibility:', error);
    return false;
  }
}

/**
 * Delete role request
 */
export async function deleteRoleRequest(requestId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const result = await sql`
      DELETE FROM role_requests 
      WHERE id = ${requestId}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Role request not found',
        errors: ['Role request not found'],
      };
    }

    return {
      success: true,
      message: 'Role request deleted successfully',
    };
  } catch (error: any) {
    console.error('❌ Error deleting role request:', error);
    return {
      success: false,
      message: 'Failed to delete role request',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}