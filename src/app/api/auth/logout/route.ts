
// /src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting logout process...');
    
    // Destroy the session
    await destroySession();
    
    console.log('Session destroyed successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    }, {
      headers: {
        'Set-Cookie': 'axioquan-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; secure; sameSite=lax'
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to clear the cookie
    return NextResponse.json({ 
      success: false, 
      message: 'Logout failed' 
    }, { 
      status: 500,
      headers: {
        'Set-Cookie': 'axioquan-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; secure; sameSite=lax'
      }
    });
  }
}