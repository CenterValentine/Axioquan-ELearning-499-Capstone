
// /src/components/reviews/star-rating.tsx

'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showLabel = true,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: {
      star: 'h-4 w-4',
      text: 'text-sm'
    },
    md: {
      star: 'h-5 w-5',
      text: 'text-base'
    },
    lg: {
      star: 'h-6 w-6',
      text: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  const handleClick = (newRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={cn(
              'transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded',
              !readonly && 'hover:scale-110 active:scale-95 cursor-pointer',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                currentSize.star,
                star <= displayRating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
      
      {showLabel && (
        <span className={cn('font-medium text-gray-700', currentSize.text)}>
          {rating.toFixed(1)} out of 5
        </span>
      )}
    </div>
  );
}