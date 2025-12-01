
// /src/components/social/like-button.tsx

'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  courseId: string;
  initialLikeCount?: number;
  initialLiked?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showCount?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function LikeButton({
  courseId,
  initialLikeCount = 0,
  initialLiked = false,
  size = 'default',
  showCount = true,
  className,
  variant = 'outline'
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Sync with initial props
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const handleLikeToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
    
    try {
      const response = await fetch(`/api/courses/${courseId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update on error
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
        
        if (data.requiresAuth) {
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to like courses',
            variant: 'destructive',
          });
          return;
        }
        throw new Error(data.error || 'Failed to toggle like');
      }

      if (data.success) {
        // Update with actual server state
        setIsLiked(data.liked);
        setLikeCount(data.likeCount || (data.liked ? previousCount + 1 : Math.max(0, previousCount - 1)));
        
        toast({
          title: data.liked ? 'Course Liked' : 'Course Unliked',
          description: data.message,
        });
      }
    } catch (error: any) {
      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to toggle like',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    default: 'h-9 px-3 text-sm',
    lg: 'h-10 px-4 text-base',
    icon: 'h-9 w-9'
  };

  const iconSizes = {
    sm: 14,
    default: 16,
    lg: 18,
    icon: 16
  };

  // Determine button variant and styles based on like state
  const getButtonStyles = () => {
    if (isLiked) {
      return "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-md";
    } else {
      if (variant === 'outline') {
        return "border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 text-gray-700";
      } else {
        return "bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 border-gray-200";
      }
    }
  };

  return (
    <Button
      variant={isLiked ? "default" : variant}
      size={size}
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200 group font-medium",
        getButtonStyles(),
        sizeClasses[size],
        "hover:scale-105 active:scale-95",
        className
      )}
    >
      <Heart 
        className={cn(
          "transition-all duration-200",
          isLiked ? "fill-current scale-110" : "group-hover:scale-110",
          isLoading ? "animate-pulse" : ""
        )} 
        size={iconSizes[size]} 
      />
      {showCount && (
        <span className={cn(
          "ml-1 font-semibold transition-all duration-200",
          isLiked ? "text-white" : "text-gray-700 group-hover:text-red-600"
        )}>
          {likeCount}
        </span>
      )}
    </Button>
  );
}