
// /src/app/api/reviews/[id]/replies/route.ts

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { 
  getReviewReplies, 
  createReviewReply, 
  canUserReplyToReview 
} from '@/lib/db/queries/review-replies';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: reviewId } = await params;

    if (!reviewId) {
      return Response.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const replies = await getReviewReplies(reviewId);

    return Response.json({
      success: true,
      message: 'Replies fetched successfully',
      replies
    });

  } catch (error: any) {
    console.error('❌ API Error fetching review replies:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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

    const { id: reviewId } = await params;

    if (!reviewId) {
      return Response.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, parent_reply_id } = body;

    // Validate required fields
    if (!content || !content.trim()) {
      return Response.json(
        { error: 'Reply content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length < 2) {
      return Response.json(
        { error: 'Reply must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (content.trim().length > 500) {
      return Response.json(
        { error: 'Reply must be less than 500 characters' },
        { status: 400 }
      );
    }

    // Check if user can reply to this review
    const { canReply, isInstructor } = await canUserReplyToReview(reviewId, session.userId);

    if (!canReply) {
      return Response.json(
        { error: 'You do not have permission to reply to this review' },
        { status: 403 }
      );
    }

    // Create the reply
    const result = await createReviewReply(
      reviewId,
      session.userId,
      content.trim(),
      parent_reply_id,
      isInstructor
    );

    if (!result.success) {
      return Response.json(
        { error: result.error || 'Failed to create reply' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Reply submitted successfully',
      reply: result.reply
    });

  } catch (error: any) {
    console.error('❌ API Error creating review reply:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}