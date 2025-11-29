
// /src/components/reviews/review-reply-form.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send, X } from 'lucide-react';

interface ReviewReplyFormProps {
  reviewId: string;
  parentReplyId?: string;
  onReplySubmitted: () => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function ReviewReplyForm({ 
  reviewId, 
  parentReplyId, 
  onReplySubmitted, 
  onCancel,
  placeholder = "Write your reply...",
  autoFocus = false
}: ReviewReplyFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Reply content is required');
      return;
    }

    if (content.trim().length < 2) {
      setError('Reply must be at least 2 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/reviews/${reviewId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          parent_reply_id: parentReplyId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit reply');
      }

      if (data.success) {
        setContent('');
        onReplySubmitted();
      } else {
        throw new Error(data.error || 'Failed to submit reply');
      }
    } catch (err: any) {
      console.error('Error submitting reply:', err);
      setError(err.message || 'Failed to submit reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setError(null);
    onCancel?.();
  };

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder={placeholder}
            className="min-h-[80px] resize-none bg-white"
            disabled={isSubmitting}
            autoFocus={autoFocus}
          />
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {content.length}/500 characters
            </div>
            
            <div className="flex gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </Button>
              )}
              
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={16} className="mr-1" />
                {isSubmitting ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}