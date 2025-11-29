
// /src/components/reviews/review-replies.tsx

'use client';

import { useState, useEffect } from 'react';
import { ReviewReplyForm } from './review-reply-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Reply, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReviewReply {
  id: string;
  user_id: string;
  user_name: string;
  user_image?: string;
  content: string;
  is_instructor_reply: boolean;
  is_edited: boolean;
  created_at: string;
  like_count: number;
  nested_replies?: ReviewReply[];
}

interface ReviewRepliesProps {
  reviewId: string;
  initialReplies?: ReviewReply[];
  currentUserId?: string;
}

export function ReviewReplies({ reviewId, initialReplies = [], currentUserId }: ReviewRepliesProps) {
  const [replies, setReplies] = useState<ReviewReply[]>(initialReplies);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (initialReplies.length === 0) {
      fetchReplies();
    }
  }, [reviewId]);

  const fetchReplies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}/replies`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }

      const data = await response.json();
      
      if (data.success) {
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmitted = () => {
    setShowReplyForm(false);
    setReplyingTo(null);
    fetchReplies(); // Refresh replies
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderReply = (reply: ReviewReply, level = 0) => (
    <div key={reply.id} className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <Card className="mb-3 border border-gray-200">
        <CardContent className="p-4">
          {/* Reply Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {reply.user_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900">
                    {reply.user_name}
                  </span>
                  {reply.is_instructor_reply && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Instructor
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatDate(reply.created_at)}</span>
                  {reply.is_edited && <span>• Edited</span>}
                </div>
              </div>
            </div>

            {/* Reply Actions */}
            {currentUserId === reply.user_id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Reply Content */}
          <p className="text-gray-700 text-sm mb-3">{reply.content}</p>

          {/* Reply Actions */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {reply.like_count > 0 && (
              <span>{reply.like_count} like{reply.like_count !== 1 ? 's' : ''}</span>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
            >
              <Reply size={12} className="mr-1" />
              Reply
            </Button>
          </div>

          {/* Nested Reply Form */}
          {replyingTo === reply.id && (
            <div className="mt-3">
              <ReviewReplyForm
                reviewId={reviewId}
                parentReplyId={reply.id}
                onReplySubmitted={handleReplySubmitted}
                onCancel={() => setReplyingTo(null)}
                placeholder={`Reply to ${reply.user_name}...`}
              />
            </div>
          )}

          {/* Nested Replies */}
          {reply.nested_replies && reply.nested_replies.length > 0 && (
            <div className="mt-3">
              {reply.nested_replies.map(nestedReply => 
                renderReply(nestedReply, level + 1)
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Reply Count and Reply Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageCircle size={16} />
          <span>{replies.length} repl{replies.length === 1 ? 'y' : 'ies'}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Reply size={16} className="mr-1" />
          Add Reply
        </Button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mb-4">
          <ReviewReplyForm
            reviewId={reviewId}
            onReplySubmitted={handleReplySubmitted}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Write your reply to this review..."
            autoFocus={true}
          />
        </div>
      )}

      {/* Replies List */}
      <div className="space-y-3">
        {replies.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
            <CardContent className="py-6 text-center">
              <MessageCircle size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No replies yet. Be the first to reply!</p>
            </CardContent>
          </Card>
        ) : (
          replies.map(reply => renderReply(reply))
        )}
      </div>
    </div>
  );
}