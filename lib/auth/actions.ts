
// /lib/auth/actions.ts

'use server';

import { sql } from '@lib/db';
import { hashPassword, validatePasswordStrength, verifyPassword } from './password';
import { SignUpFormData, LoginFormData, AuthUser, ChangePasswordData, PasswordResetRequestData, PasswordResetConfirmData, TokenValidationResponse } from '@/types/auth';
import { User } from '@/types/database';
import { getSession, createSession, destroySession, refreshSession } from './session';
import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email/utils';
import { createPasswordResetEmail } from '@/lib/email/templates/password-reset';

/*import { notifyUserRegistration } from "@/lib/notifications/actions";

await notifyUserRegistration({
  id: newUser.id,
  email: newUser.email
});*/


/**
 * Handles secure user signup with optional role parameter
 */
export async function signUpUser(formData: SignUpFormData): Promise<{
  success: boolean;
  message: string;
  user?: User;
  errors?: string[];
}> {
  try {
    // 1️⃣ Validate password strength
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors,
      };
    }

    // 2️⃣ Confirm password match
    if (formData.password !== formData.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
        errors: ['Passwords do not match'],
      };
    }

    // 3️⃣ Check for existing user
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${formData.email} OR username = ${formData.username}
    `;

    if (existingUser.length > 0) {
      return {
        success: false,
        message: 'User already exists',
        errors: ['Email or username already registered'],
      };
    }

    // 4️⃣ Hash password
    const hashedPassword = await hashPassword(formData.password);

    // 5️⃣ Create new user
    const newUserRows = await sql`
      INSERT INTO users (username, email, password, name)
      VALUES (${formData.username}, ${formData.email}, ${hashedPassword}, ${formData.name})
      RETURNING id, username, email, name, created_at, is_active, locale, timezone
    `;

    const newUser = newUserRows[0] as User;
    if (!newUser) throw new Error('User creation failed — no record returned');

    // 6️⃣ Determine role to assign (default: student, or provided role)
    const roleNameToAssign = formData.role || 'student';
    const roleRows = await sql`
      SELECT id FROM roles WHERE name = ${roleNameToAssign} LIMIT 1
    `;
    
    if (roleRows.length === 0) {
      throw new Error(`Role '${roleNameToAssign}' not found in database`);
    }

    const roleId = roleRows[0].id;

    // 7️⃣ Assign the chosen role
    await sql`
      INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
      VALUES (${newUser.id}, ${roleId}, true, NOW())
    `;

    // 8️⃣ Create empty profile
    await sql`
      INSERT INTO user_profiles (
        user_id,
        skills,
        portfolio_urls,
        learning_goals,
        preferred_topics,
        expertise_levels,
        achievements,
        social_links
      )
      VALUES (
        ${newUser.id},
        ARRAY[]::text[],
        ARRAY[]::text[],
        ARRAY[]::text[],
        ARRAY[]::text[],
        '{}'::jsonb,
        '{}'::jsonb,
        '{}'::jsonb
      )
    `;

    // ✅ Return success
    return {
      success: true,
      message: `User registered successfully as ${roleNameToAssign}`,
      user: newUser,
    };
  } catch (error: any) {
    console.error('❌ User registration error:', error);
    return {
      success: false,
      message: 'Registration failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Authenticate user with email and password
 * Returns user data without password if successful
 */
export async function loginUser(credentials: LoginFormData): Promise<{
  success: boolean;
  message: string;
  user?: AuthUser;
  errors?: string[];
}> {
  try {
    // 1️⃣ Get user and roles
    const userWithPassword = await sql`
      SELECT 
        u.*,
        ARRAY_AGG(r.name) AS roles,
        (
          SELECT r.name 
          FROM user_roles ur 
          JOIN roles r ON ur.role_id = r.id 
          WHERE ur.user_id = u.id AND ur.is_primary = true 
          LIMIT 1
        ) AS primary_role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = ${credentials.email} AND u.is_active = true
      GROUP BY u.id
      LIMIT 1
    `;

    const user = userWithPassword[0] as (User & { roles: string[]; primary_role: string });
    if (!user) {
      return {
        success: false,
        message: 'Authentication failed',
        errors: ['Invalid email or password'],
      };
    }

    // 2️⃣ Verify password
    if (!user.password || !(await verifyPassword(credentials.password, user.password))) {
      return {
        success: false,
        message: 'Authentication failed',
        errors: ['Invalid email or password'],
      };
    }

    // 3️⃣ Update last login
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

    // 4️⃣ Build safe user object
    const { password: _, ...userWithoutPassword } = user;
    const authUser: AuthUser = {
      id: userWithoutPassword.id,
      username: userWithoutPassword.username,
      email: userWithoutPassword.email,
      name: userWithoutPassword.name,
      image: userWithoutPassword.image,
      roles: userWithoutPassword.roles?.filter((r) => r !== null) || [],
      primaryRole: userWithoutPassword.primary_role || 'student',
    };

    return {
      success: true,
      message: 'Login successful',
      user: authUser,
    };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: 'Login failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Login user and create session
 */
export async function loginWithSession(credentials: LoginFormData): Promise<{
  success: boolean;
  message: string;
  user?: AuthUser;
  errors?: string[];
}> {
  try {
    const result = await loginUser(credentials);

    if (result.success && result.user) {
      // ✅ Create session with proper parameters
      await createSession({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        roles: result.user.roles,
        primaryRole: result.user.primaryRole,
      });

      return result;
    }

    return result;
  } catch (error: any) {
    console.error('❌ Login with session error:', error);
    return {
      success: false,
      message: 'Login failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Logout user and destroy session
 * @deprecated Use logoutAction instead for server actions
 */
export async function logoutUser() {
  await destroySession();
  return { success: true, message: 'Logged out successfully' };
}

/**
 * Verify user's current password (for password change functionality)
 */
export async function verifyCurrentPassword(userId: string, password: string): Promise<boolean> {
  try {
    const user = await sql`
      SELECT password FROM users WHERE id = ${userId} AND is_active = true LIMIT 1
    `;
    if (!user[0]?.password) return false;
    return await verifyPassword(password, user[0].password);
  } catch (error) {
    console.error('❌ Password verification error:', error);
    return false;
  }
}

/**
 * Fetch user by email (active only)
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} AND is_active = true LIMIT 1
    `;
    return users[0] as User || null;
  } catch (error) {
    console.error('❌ Error getting user by email:', error);
    return null;
  }
}

/**
 * Fetch user by ID (active only)
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE id = ${id} AND is_active = true LIMIT 1
    `;
    return users[0] as User || null;
  } catch (error) {
    console.error('❌ Error getting user by ID:', error);
    return null;
  }
}

/**
 * Server action to handle user logout with redirect
 * Use this for client components that need to trigger logout
 */
export async function logoutAction() {
  'use server';
  
  await destroySession();
  redirect('/');
}

/**
 * Refresh user session - can be called from client components
 * Returns success status and message
 */
export async function refreshUserSession(): Promise<{
  success: boolean;
  message: string;
}> {
  'use server';
  
  const refreshed = await refreshSession();
  
  if (refreshed) {
    return {
      success: true,
      message: 'Session refreshed successfully',
    };
  } else {
    return {
      success: false,
      message: 'Failed to refresh session - user not authenticated',
    };
  }
}

/**
 * Check if user is authenticated (for client components)
 * Returns basic auth status without exposing sensitive data
 */
export async function checkAuthStatus(): Promise<{
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    primaryRole: string;
  };
}> {
  'use server';
  
  const { getSession } = await import('./session');
  const session = await getSession();
  
  if (!session) {
    return { isAuthenticated: false };
  }
  
  return {
    isAuthenticated: true,
    user: {
      name: session.name,
      email: session.email,
      primaryRole: session.primaryRole,
    },
  };
}

/**
 * Update user profile information
 */
export async function updateUserProfile(userId: string, profileData: {
  name?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
}): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const updatedUser = await sql`
      UPDATE users 
      SET 
        name = COALESCE(${profileData.name}, name),
        bio = COALESCE(${profileData.bio}, bio),
        timezone = COALESCE(${profileData.timezone}, timezone),
        locale = COALESCE(${profileData.locale}, locale),
        updated_at = NOW()
      WHERE id = ${userId} AND is_active = true
      RETURNING id, name, email, bio, timezone, locale
    `;

    if (updatedUser.length === 0) {
      return {
        success: false,
        message: 'User not found or inactive',
        errors: ['User not found'],
      };
    }

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error: any) {
    console.error('❌ Profile update error:', error);
    return {
      success: false,
      message: 'Profile update failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}



// Add this to /lib/auth/actions.ts

/**
 * Delete user account with all associated data
 * Requires password confirmation for security
 */
export async function deleteUserAccount(
  userId: string, 
  password: string
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // Verify user identity with password
    const passwordValid = await verifyCurrentPassword(userId, password);
    if (!passwordValid) {
      return {
        success: false,
        message: 'Account deletion failed',
        errors: ['Invalid password provided'],
      };
    }

    // Import the deletion function
    const { deleteUserAccount: deleteAccount } = await import('@/lib/db/queries/users');
    const deletionResult = await deleteAccount(userId);

    if (deletionResult.success) {
      // Destroy the session after successful deletion
      await destroySession();
    }

    return deletionResult;
  } catch (error: any) {
    console.error('❌ Error in deleteUserAccount action:', error);
    return {
      success: false,
      message: 'Account deletion failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Server action to handle account deletion with redirect
 */
// Then update the deleteAccountAction function:
export async function deleteAccountAction(password: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  'use server';
  
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to delete your account'],
      };
    }

    const result = await deleteUserAccount(session.userId, password);
    
    if (result.success) {
      // Destroy session and redirect
      await destroySession();
      redirect('/?message=account-deleted');
    }
    
    return result;
  } catch (error: any) {
    console.error('❌ Delete account action error:', error);
    return {
      success: false,
      message: 'Account deletion failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}





/**
 * Change user password with current password verification
 */
export async function changePassword(
  userId: string, 
  passwordData: ChangePasswordData
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // 1️⃣ Verify current password
    const isCurrentPasswordValid = await verifyCurrentPassword(userId, passwordData.currentPassword);
    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: 'Password change failed',
        errors: ['Current password is incorrect'],
      };
    }

    // 2️⃣ Validate new password strength
    const passwordValidation = validatePasswordStrength(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors,
      };
    }

    // 3️⃣ Check if new password is different from current
    if (passwordData.currentPassword === passwordData.newPassword) {
      return {
        success: false,
        message: 'Password change failed',
        errors: ['New password must be different from current password'],
      };
    }

    // 4️⃣ Check password history (prevent reuse)
    const isPasswordInHistory = await checkPasswordHistory(userId, passwordData.newPassword);
    if (isPasswordInHistory) {
      return {
        success: false,
        message: 'Password change failed',
        errors: ['You cannot use a previously used password'],
      };
    }

    // 5️⃣ Hash new password
    const hashedNewPassword = await hashPassword(passwordData.newPassword);

    // 6️⃣ Update password in database
    await sql`
      UPDATE users 
      SET password = ${hashedNewPassword}, updated_at = NOW() 
      WHERE id = ${userId} AND is_active = true
    `;

    // 7️⃣ Add to password history
    await addToPasswordHistory(userId, hashedNewPassword);

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error: any) {
    console.error('❌ Password change error:', error);
    return {
      success: false,
      message: 'Password change failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Check if password exists in user's password history
 */
async function checkPasswordHistory(userId: string, newPassword: string): Promise<boolean> {
  try {
    const history = await sql`
      SELECT password FROM password_history 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    for (const record of history) {
      if (await verifyPassword(newPassword, record.password)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Password history check error:', error);
    return false;
  }
}


/**
 * Add password to history (keep last 5 passwords)
 */
async function addToPasswordHistory(userId: string, hashedPassword: string): Promise<void> {
  try {
    // Insert new password record
    await sql`
      INSERT INTO password_history (user_id, password) 
      VALUES (${userId}, ${hashedPassword})
    `;

    // Keep only last 5 passwords
    await sql`
      DELETE FROM password_history 
      WHERE user_id = ${userId} 
      AND id NOT IN (
        SELECT id FROM password_history 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT 5
      )
    `;
  } catch (error) {
    console.error('❌ Add to password history error:', error);
  }
}

/**
 * Server action for changing password (for use in client components)
 */
export async function changePasswordAction(formData: ChangePasswordData): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  'use server';

  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to change your password'],
      };
    }

    return await changePassword(session.userId, formData);
  } catch (error: any) {
    console.error('❌ Change password action error:', error);
    return {
      success: false,
      message: 'Password change failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}






// /lib/auth/actions.ts - Update both requestPasswordReset and resetPasswordWithToken functions

/**
 * Request password reset - sends email with reset link
/**
 * Request password reset - sends email with reset link
 */
export async function requestPasswordReset(
  data: PasswordResetRequestData
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // 1️⃣ Find user by email
    const users = await sql`
      SELECT id, email, name, is_active 
      FROM users 
      WHERE email = ${data.email} AND is_active = true 
      LIMIT 1
    `;

    const user = users[0] as (User & { name: string }) | undefined;

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // 2️⃣ Generate secure reset token
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // 3️⃣ Delete any existing reset tokens for this user
    await sql`
      DELETE FROM password_reset_tokens 
      WHERE user_id = ${user.id}
    `;

    // 4️⃣ Store new reset token
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires)
      VALUES (${user.id}, ${resetToken}, ${expiresAt})
    `;

    // 5️⃣ Generate reset link
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // 6️⃣ Send email
    const emailSent = await sendEmail({
      to: user.email,
      subject: 'Reset Your AxioQuan Password',
      html: createPasswordResetEmail(resetLink, user.name),
    });

    if (!emailSent) {
      // Don't throw error, just log and continue
      console.error('❌ Failed to send password reset email for:', user.email);
      // Still return success to prevent email enumeration
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // 7️⃣ Log the reset request (handle undefined IP properly)
    await sql`
      INSERT INTO user_audit_logs (user_id, action, ip_address, user_agent)
      VALUES (${user.id}, 'password_reset_requested', ${data.ipAddress || null}, ${data.userAgent || null})
    `;

    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  } catch (error: any) {
    console.error('❌ Password reset request error:', error);
    // Still return success to prevent email enumeration
    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }
}


/**
 * Validate password reset token
 */
export async function validateResetToken(token: string): Promise<TokenValidationResponse> {
  try {
    // 1️⃣ Find valid, unused token
    const tokens = await sql`
      SELECT prt.*, u.email, u.name, u.is_active
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = ${token} 
        AND prt.expires > NOW() 
        AND prt.used = false
        AND u.is_active = true
      LIMIT 1
    `;

    const resetToken = tokens[0] as any;

    if (!resetToken) {
      return {
        isValid: false,
        message: 'Invalid or expired reset token',
      };
    }

    return {
      isValid: true,
      message: 'Token is valid',
      user: {
        id: resetToken.user_id,
        email: resetToken.email,
        name: resetToken.name,
      },
    };
  } catch (error: any) {
    console.error('❌ Token validation error:', error);
    return {
      isValid: false,
      message: 'Token validation failed',
    };
  }
}


// /lib/auth/actions.ts

// In /lib/auth/actions.ts - Remove the duplicate verifyPasswordHistory function and update resetPasswordWithToken

// /lib/auth/actions.ts - Update resetPasswordWithToken function

/**
 * Reset password using token
 */
/**
 * Reset password using token
 */
export async function resetPasswordWithToken(
  data: PasswordResetConfirmData
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // 1️⃣ Validate token first
    const tokenValidation = await validateResetToken(data.token);
    if (!tokenValidation.isValid || !tokenValidation.user) {
      return {
        success: false,
        message: 'Invalid or expired reset token',
        errors: ['Please request a new password reset link'],
      };
    }

    const userId = tokenValidation.user.id;

    // 2️⃣ Validate new password strength
    const passwordValidation = validatePasswordStrength(data.newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors,
      };
    }

    // 3️⃣ Check password history (prevent reuse)
    const isPasswordInHistory = await checkPasswordHistory(userId, data.newPassword);
    if (isPasswordInHistory) {
      return {
        success: false,
        message: 'Password reset failed',
        errors: ['You cannot use a previously used password'],
      };
    }

    // 4️⃣ Hash new password
    const hashedNewPassword = await hashPassword(data.newPassword);

    // 5️⃣ Update password WITHOUT transaction
    // Update user password
    await sql`
      UPDATE users 
      SET password = ${hashedNewPassword}, updated_at = NOW() 
      WHERE id = ${userId}
    `;

    // Mark token as used
    await sql`
      UPDATE password_reset_tokens 
      SET used = true, used_at = NOW() 
      WHERE token = ${data.token}
    `;

    // Add to password history
    await sql`
      INSERT INTO password_history (user_id, hashed_password)
      VALUES (${userId}, ${hashedNewPassword})
    `;

    // 6️⃣ Log the password reset (handle undefined IP properly)
    await sql`
      INSERT INTO user_audit_logs (user_id, action, ip_address, user_agent)
      VALUES (${userId}, 'password_reset_completed', ${data.ipAddress || null}, ${data.userAgent || null})
    `;

    // 7️⃣ Invalidate all existing sessions for security
    await sql`
      UPDATE sessions 
      SET is_active = false 
      WHERE user_id = ${userId}
    `;

    return {
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    };
  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    return {
      success: false,
      message: 'Password reset failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}



