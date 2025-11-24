
// // /lib/db/queries/users.ts - FIXED VERSION

import { sql } from '../index';

/**
 * Safely delete user account with proper foreign key handling
 * This follows the same pattern as your SQL queries
 */
// Alternative debug version if the above doesn't work
export async function deleteUserAccount(userId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    console.log(`🗑️ Starting account deletion for user: ${userId}`);

    // Test connection and verify user first
    const userCheck = await sql`
      SELECT id, email FROM users WHERE id = ${userId} AND is_active = true LIMIT 1
    `;

    if (userCheck.length === 0) {
      return {
        success: false,
        message: 'User not found or already deleted',
        errors: ['User account not found'],
      };
    }

    console.log(`✅ User found: ${userCheck[0].email}`);

    // Test each table deletion step by step
    const steps = [
      { name: 'sessions', query: sql`DELETE FROM sessions WHERE user_id = ${userId}` },
      { name: 'login_attempts', query: sql`DELETE FROM login_attempts WHERE user_id = ${userId}` },
      { name: 'role_requests (update)', query: sql`UPDATE role_requests SET reviewed_by = NULL WHERE reviewed_by = ${userId}` },
      { name: 'role_requests (delete)', query: sql`DELETE FROM role_requests WHERE user_id = ${userId}` },
      { name: 'user_roles', query: sql`DELETE FROM user_roles WHERE user_id = ${userId}` },
      { name: 'user_profiles', query: sql`DELETE FROM user_profiles WHERE user_id = ${userId}` },
      { name: 'accounts', query: sql`DELETE FROM accounts WHERE user_id = ${userId}` },
      { name: 'password_reset_tokens', query: sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}` },
      { name: 'password_history', query: sql`DELETE FROM password_history WHERE user_id = ${userId}` },
      { name: 'user_follows', query: sql`DELETE FROM user_follows WHERE follower_id = ${userId} OR following_id = ${userId}` },
      { name: 'user_audit_logs', query: sql`DELETE FROM user_audit_logs WHERE user_id = ${userId}` },
      { name: 'user_activities', query: sql`DELETE FROM user_activities WHERE user_id = ${userId}` },
      { name: 'notifications', query: sql`DELETE FROM notifications WHERE user_id = ${userId}` },
    ];

    for (const step of steps) {
      try {
        await step.query;
        console.log(`✅ Deleted from ${step.name}`);
      } catch (stepError: any) {
        console.error(`❌ Error deleting from ${step.name}:`, stepError.message);
        // Continue with other steps even if one fails
      }
    }

    // Final user deletion
    const deleteResult = await sql`
      DELETE FROM users 
      WHERE id = ${userId} 
      RETURNING id, email
    `;

    if (deleteResult.length === 0) {
      throw new Error('Failed to delete user record - no rows affected');
    }

    console.log(`✅ Successfully deleted user account: ${userCheck[0].email}`);
    
    return {
      success: true,
      message: 'Account deleted successfully',
    };

  } catch (error: any) {
    console.error('❌ Error in deleteUserAccount:', error);
    return {
      success: false,
      message: `Account deletion failed: ${error.message}`,
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Verify user's password before account deletion
 */
export async function verifyUserPassword(userId: string, password: string): Promise<boolean> {
  try {
    const user = await sql`
      SELECT password FROM users WHERE id = ${userId} AND is_active = true LIMIT 1
    `;
    
    if (!user[0]?.password) return false;
    
    // Import the verifyPassword function
    const { verifyPassword } = await import('@/lib/auth/password');
    return await verifyPassword(password, user[0].password);
  } catch (error) {
    console.error('❌ Password verification error:', error);
    return false;
  }
}