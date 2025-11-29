
// /src/app/api/user/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    // Import the database query
    const { sql } = await import('@/lib/db');
    
    // Get user with profile data including image
    const userData = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.image,
        u.bio,
        u.timezone,
        u.locale,
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
      WHERE u.id = ${session.userId} AND u.is_active = true
      GROUP BY u.id
      LIMIT 1
    `;

    const user = userData[0];
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        timezone: user.timezone,
        locale: user.locale,
        roles: user.roles?.filter((r: string | null) => r !== null) || [],
        primaryRole: user.primary_role || 'student'
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user profile' 
    }, { status: 500 });
  }
}