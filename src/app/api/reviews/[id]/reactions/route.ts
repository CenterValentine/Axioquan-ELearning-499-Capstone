
// /src/app/api/reviews/[id]/reactions/route.ts

import { NextRequest } from 'next/server';
import { 
  toggleReviewReactionAction, 
  getReviewReactionsAction,
  removeReviewReactionAction 
} from '@/lib/social/review-actions';
import { getSession } from '@/lib/auth/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { 
          error: 'Authentication required',
          requiresAuth: true 
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { reactionType } = body;
    
    if (!id) {
      return Response.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    if (!reactionType) {
      return Response.json(
        { error: 'Reaction type is required' },
        { status: 400 }
      );
    }

    // Validate reaction type
    const validReactionTypes = ['like', 'dislike', 'helpful', 'love', 'insightful', 'funny'];
    if (!validReactionTypes.includes(reactionType)) {
      return Response.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    const result = await toggleReviewReactionAction(id, reactionType);
    
    if (!result.success) {
      if (result.requiresAuth) {
        return Response.json(
          { 
            error: result.message,
            requiresAuth: true 
          },
          { status: 401 }
        );
      }
      
      return Response.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return Response.json(result);
  } catch (error: any) {
    console.error('❌ API Error toggling review reaction:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const result = await getReviewReactionsAction(id);
    
    if (!result.success) {
      return Response.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return Response.json(result);
  } catch (error: any) {
    console.error('❌ API Error fetching review reactions:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { 
          error: 'Authentication required',
          requiresAuth: true 
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const result = await removeReviewReactionAction(id);
    
    if (!result.success) {
      if (result.requiresAuth) {
        return Response.json(
          { 
            error: result.message,
            requiresAuth: true 
          },
          { status: 401 }
        );
      }
      
      return Response.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return Response.json(result);
  } catch (error: any) {
    console.error('❌ API Error removing review reaction:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}