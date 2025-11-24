
// /src/app/api/auth/session-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ 
        image: null 
      });
    }

    return NextResponse.json({
      image: session.image || null
    });
  } catch (error) {
    console.error('Error getting session image:', error);
    return NextResponse.json({ 
      image: null 
    }, { status: 500 });
  }
}