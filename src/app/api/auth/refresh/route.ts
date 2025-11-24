
// /src/app/api/auth/refresh/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { refreshSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const refreshed = await refreshSession();
    
    if (refreshed) {
      return NextResponse.json({ 
        success: true, 
        message: 'Session refreshed successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Session refresh failed' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Session refresh failed' 
    }, { status: 500 });
  }
}