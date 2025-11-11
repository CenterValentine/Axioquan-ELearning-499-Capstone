// /lib/auth/session.ts

'use server';

import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  image?: string; // Added profile image property
  roles: string[];
  primaryRole: string;
  expires: number;
}

// Session duration - 1 hour
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function createSession(sessionData: Omit<SessionData, 'expires'>) {
  'use server';
  
  const cookieStore = await cookies();
  
  const expiresAt = Date.now() + SESSION_DURATION;
  
  const sessionWithExpiry: SessionData = {
    ...sessionData,
    expires: expiresAt
  };
  
  cookieStore.set('axioquan-user', JSON.stringify(sessionWithExpiry), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour in seconds
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  'use server';
  
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('axioquan-user')?.value;

  if (!userCookie) return null;

  try {
    const sessionData = JSON.parse(userCookie) as SessionData;
    
    // Check if session has expired
    if (Date.now() > sessionData.expires) {
      await destroySession();
      return null;
    }
    
    return sessionData;
  } catch (error) {
    await destroySession();
    return null;
  }
}

export async function destroySession() {
  'use server';
  
  const cookieStore = await cookies();
  cookieStore.delete('axioquan-user');
}

export async function validateSession(): Promise<boolean> {
  'use server';
  
  const session = await getSession();
  return !!session && Date.now() <= session.expires;
}

/**
 * Check if session needs refresh (within last 15 minutes of expiration)
 */
export async function shouldRefreshSession(): Promise<boolean> {
  'use server';
  
  const session = await getSession();
  if (!session) return false;

  const timeUntilExpiry = session.expires - Date.now();
  const refreshThreshold = 15 * 60 * 1000; // 15 minutes
  
  return timeUntilExpiry <= refreshThreshold;
}

/**
 * Refresh session expiration time when user is active
 * This extends the session by another hour from current time
 */
export async function refreshSession(): Promise<boolean> {
  'use server';
  
  const session = await getSession();
  if (!session) {
    return false;
  }

  // Only refresh if session is about to expire
  if (!(await shouldRefreshSession())) {
    return true; // Session is still valid, no need to refresh
  }

  console.log('🔄 Refreshing session...');
  
  // Create new session with same data but updated expiration
  await createSession({
    userId: session.userId,
    email: session.email,
    name: session.name,
    image: session.image, // Include image in session refresh
    roles: session.roles,
    primaryRole: session.primaryRole,
  });

  return true;
}

/**
 * Update user session with new role and profile information
 * This should be called when user roles or profile changes
 */
export async function updateUserSession(userId: string): Promise<boolean> {
  'use server';
  
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('axioquan-user')?.value;

    if (!userCookie) {
      console.log('❌ No session cookie found for user:', userId);
      return false;
    }

    const sessionData = JSON.parse(userCookie) as SessionData;
    
    // Only update if it's the same user
    if (sessionData.userId !== userId) {
      console.log('❌ Session user ID mismatch:', sessionData.userId, 'vs', userId);
      return false;
    }

    console.log('🔄 Updating session for user:', userId);

    // Get updated user data from database
    const { sql } = await import('@/lib/db');
    const userWithRoles = await sql`
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
      WHERE u.id = ${userId} AND u.is_active = true
      GROUP BY u.id
      LIMIT 1
    `;

    const user = userWithRoles[0] as any;
    if (!user) {
      console.log('❌ User not found in database:', userId);
      return false;
    }

    // Filter out null roles and ensure we have valid arrays
    const userRoles = user.roles?.filter((r: string | null) => r !== null) || [];
    const primaryRole = user.primary_role || 'student';

    console.log('📊 Database roles:', userRoles);
    console.log('🎯 Database primary role:', primaryRole);
    console.log('🖼️ Database profile image:', user.image);

    // Update session with new roles and profile data
    const updatedSession: SessionData = {
      userId: sessionData.userId,
      email: sessionData.email,
      name: sessionData.name,
      image: user.image || sessionData.image, // Preserve existing image or update with new one
      roles: userRoles,
      primaryRole: primaryRole,
      expires: Date.now() + SESSION_DURATION, // Refresh expiration
    };

    console.log('🔄 Updated session data:', {
      roles: updatedSession.roles,
      primaryRole: updatedSession.primaryRole,
      image: updatedSession.image
    });

    // Save updated session
    cookieStore.set('axioquan-user', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/',
    });

    console.log('✅ Session updated successfully with new roles and profile data');
    return true;
  } catch (error) {
    console.error('❌ Error updating user session:', error);
    return false;
  }
}

/**
 * Update only the profile image in the session
 * This is more efficient than updating the entire session
 */
export async function updateSessionImage(userId: string, imageUrl: string): Promise<boolean> {
  'use server';
  
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('axioquan-user')?.value;

    if (!userCookie) {
      console.log('❌ No session cookie found for user:', userId);
      return false;
    }

    const sessionData = JSON.parse(userCookie) as SessionData;
    
    // Only update if it's the same user
    if (sessionData.userId !== userId) {
      console.log('❌ Session user ID mismatch:', sessionData.userId, 'vs', userId);
      return false;
    }

    console.log('🔄 Updating session image for user:', userId);

    // Update session with new image
    const updatedSession: SessionData = {
      ...sessionData,
      image: imageUrl,
      expires: Date.now() + SESSION_DURATION, // Refresh expiration
    };

    // Save updated session
    cookieStore.set('axioquan-user', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/',
    });

    console.log('✅ Session image updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating session image:', error);
    return false;
  }
}

/**
 * Remove profile image from session
 */
export async function removeSessionImage(userId: string): Promise<boolean> {
  'use server';
  
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('axioquan-user')?.value;

    if (!userCookie) {
      console.log('❌ No session cookie found for user:', userId);
      return false;
    }

    const sessionData = JSON.parse(userCookie) as SessionData;
    
    // Only update if it's the same user
    if (sessionData.userId !== userId) {
      console.log('❌ Session user ID mismatch:', sessionData.userId, 'vs', userId);
      return false;
    }

    console.log('🔄 Removing session image for user:', userId);

    // Update session by removing image
    const updatedSession: SessionData = {
      ...sessionData,
      image: undefined, // Remove image from session
      expires: Date.now() + SESSION_DURATION, // Refresh expiration
    };

    // Save updated session
    cookieStore.set('axioquan-user', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/',
    });

    console.log('✅ Session image removed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error removing session image:', error);
    return false;
  }
}

/**
 * Invalidate all sessions for a specific user
 * This forces the user to log in again
 */
export async function invalidateUserSessions(userId: string): Promise<boolean> {
  'use server';
  
  try {
    const { sql } = await import('@/lib/db');
    
    // Delete all sessions for this user from the database
    await sql`
      DELETE FROM sessions 
      WHERE user_id = ${userId}
    `;
    
    console.log(`✅ Invalidated all sessions for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error invalidating user sessions:', error);
    return false;
  }
}

/**
 * Invalidate current session cookie
 */
export async function invalidateCurrentSession(): Promise<boolean> {
  'use server';
  
  try {
    const cookieStore = await cookies();
    cookieStore.delete('axioquan-user');
    console.log('✅ Invalidated current session cookie');
    return true;
  } catch (error) {
    console.error('❌ Error invalidating session cookie:', error);
    return false;
  }
}