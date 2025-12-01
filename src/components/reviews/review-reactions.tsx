
// /src/components/reviews/review-reactions.tsx

'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Lightbulb, 
  Laugh, 
  CheckCircle
} from 'lucide-react';

interface ReviewReactionsProps {
  reviewId: string;
  initialCounts?: {
    like?: number;
    dislike?: number;
    helpful?: number;
    love?: number;
    insightful?: number;
    funny?: number;
  };
  initialUserReaction?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const reactionConfig = {
  like: {
    icon: ThumbsUp,
    label: 'Like',
    activeColor: 'text-blue-600',
    activeBg: 'bg-blue-50',
    activeBorder: 'border-blue-200',
    inactiveColor: 'text-gray-500',
    countLabel: 'likes'
  },
  helpful: {
    icon: CheckCircle,
    label: 'Helpful',
    activeColor: 'text-green-600',
    activeBg: 'bg-green-50',
    activeBorder: 'border-green-200',
    inactiveColor: 'text-gray-500',
    countLabel: 'helpful'
  },
  love: {
    icon: Heart,
    label: 'Love',
    activeColor: 'text-pink-600',
    activeBg: 'bg-pink-50',
    activeBorder: 'border-pink-200',
    inactiveColor: 'text-gray-500',
    countLabel: 'love'
  },
  insightful: {
    icon: Lightbulb,
    label: 'Insightful',
    activeColor: 'text-yellow-600',
    activeBg: 'bg-yellow-50',
    activeBorder: 'border-yellow-200',
    inactiveColor: 'text-gray-500',
    countLabel: 'insightful'
  },
  funny: {
    icon: Laugh,
    label: 'Funny',
    activeColor: 'text-purple-600',
    activeBg: 'bg-purple-50',
    activeBorder: 'border-purple-200',
    inactiveColor: 'text-gray-500',
    countLabel: 'funny'
  }
};

export function ReviewReactions({
  reviewId,
  initialCounts = {},
  initialUserReaction = null,
  size = 'md',
  className
}: ReviewReactionsProps) {
  const [counts, setCounts] = useState(initialCounts);
  const [userReaction, setUserReaction] = useState(initialUserReaction);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Sync with initial props
  useEffect(() => {
    setCounts(initialCounts);
    setUserReaction(initialUserReaction);
  }, [initialCounts, initialUserReaction]);

  const handleReaction = async (reactionType: string) => {
    if (isLoading) return;
    
    setIsLoading(reactionType);
    
    // Optimistic update with proper state management
    const previousReaction = userReaction;
    const previousCounts = { ...counts };
    
    // Calculate new state optimistically
    let newUserReaction: string | null = null;
    const newCounts = { ...previousCounts };
    
    if (userReaction === reactionType) {
      // Remove reaction
      newUserReaction = null;
      newCounts[reactionType as keyof typeof newCounts] = Math.max(
        0, 
        (newCounts[reactionType as keyof typeof newCounts] || 0) - 1
      );
    } else {
      // Add or change reaction
      newUserReaction = reactionType;
      
      // Remove previous reaction count
      if (previousReaction) {
        newCounts[previousReaction as keyof typeof newCounts] = Math.max(
          0, 
          (newCounts[previousReaction as keyof typeof newCounts] || 0) - 1
        );
      }
      
      // Add new reaction count
      newCounts[reactionType as keyof typeof newCounts] = 
        (newCounts[reactionType as keyof typeof newCounts] || 0) + 1;
    }
    
    // Apply optimistic update
    setUserReaction(newUserReaction);
    setCounts(newCounts);
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reactionType }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update on error
        setUserReaction(previousReaction);
        setCounts(previousCounts);
        
        if (data.requiresAuth) {
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to react to reviews',
            variant: 'destructive',
          });
          return;
        }
        throw new Error(data.error || 'Failed to update reaction');
      }

      if (data.success) {
        // Update with actual server state - THIS ENSURES REAL-TIME SYNC
        setUserReaction(data.userReaction);
        setCounts(data.counts || {});
        
        const actionMessages = {
          created: 'added',
          updated: 'updated',
          deleted: 'removed'
        };
        
        if (data.action && data.action !== 'deleted') {
          toast({
            title: 'Reaction Updated',
            description: `You ${actionMessages[data.action] || 'updated'} your reaction`,
          });
        }
      }
    } catch (error: any) {
      // Revert optimistic update on error
      setUserReaction(previousReaction);
      setCounts(previousCounts);
      
      console.error('Error updating reaction:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update reaction',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'h-7 px-2 text-xs',
      icon: 14,
      count: 'text-xs'
    },
    md: {
      button: 'h-8 px-3 text-sm',
      icon: 16,
      count: 'text-sm'
    },
    lg: {
      button: 'h-9 px-3 text-base',
      icon: 18,
      count: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  // Only show reactions that have config
  const availableReactions = Object.entries(reactionConfig);

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {availableReactions.map(([reactionType, config]) => {
        const Icon = config.icon;
        const count = counts[reactionType as keyof typeof counts] || 0;
        const isActive = userReaction === reactionType;
        const isDisabled = isLoading === reactionType;

        return (
          <button
            key={reactionType}
            onClick={() => handleReaction(reactionType)}
            disabled={isDisabled}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 font-medium',
              'hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1',
              isActive
                ? `${config.activeBg} ${config.activeBorder} ${config.activeColor} border-2`
                : `bg-white border-gray-300 ${config.inactiveColor} hover:bg-gray-50 hover:border-gray-400`,
              currentSize.button,
              isDisabled && 'opacity-50 cursor-not-allowed'
            )}
            title={config.label}
          >
            <Icon 
              size={currentSize.icon} 
              className={cn(
                isActive && 'fill-current',
                isDisabled && 'animate-pulse'
              )} 
            />
            {count > 0 && (
              <span className={cn('font-semibold', currentSize.count)}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}