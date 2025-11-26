
// /src/components/social/share-button.tsx

'use client';

import { useState } from 'react';
import { Share2, Copy, Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  courseId: string;
  courseTitle: string;
  shareUrl?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showCount?: boolean;
  initialShareCount?: number;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function ShareButton({
  courseId,
  courseTitle,
  shareUrl,
  size = 'default',
  showCount = true,
  initialShareCount = 0,
  className,
  variant = 'outline'
}: ShareButtonProps) {
  const [shareCount, setShareCount] = useState(initialShareCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `Check out "${courseTitle}" on AxioQuan - an amazing course!`;

  const recordShare = async (shareType: string, sharedTo?: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          share_type: shareType,
          share_url: currentUrl,
          shared_to: sharedTo
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShareCount(prev => prev + 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error recording share:', error);
      return false;
    }
  };

  const handleShare = async (method: 'copy' | 'twitter' | 'linkedin' | 'facebook' | 'link') => {
    setIsLoading(true);
    setIsOpen(false);

    try {
      let shareRecorded = false;
      let successMessage = '';

      switch (method) {
        case 'copy':
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(currentUrl);
            shareRecorded = await recordShare('copy');
            successMessage = 'Course link copied to clipboard!';
          } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = currentUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            shareRecorded = await recordShare('copy');
            successMessage = 'Course link copied to clipboard!';
          }
          break;

        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
          window.open(twitterUrl, '_blank', 'width=600,height=400');
          shareRecorded = await recordShare('social', 'twitter');
          successMessage = 'Shared on Twitter!';
          break;

        case 'linkedin':
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
          window.open(linkedinUrl, '_blank', 'width=600,height=400');
          shareRecorded = await recordShare('social', 'linkedin');
          successMessage = 'Shared on LinkedIn!';
          break;

        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
          window.open(facebookUrl, '_blank', 'width=600,height=400');
          shareRecorded = await recordShare('social', 'facebook');
          successMessage = 'Shared on Facebook!';
          break;

        case 'link':
          shareRecorded = await recordShare('link');
          successMessage = 'Share recorded! Thank you for sharing!';
          break;
      }

      if (successMessage) {
        toast({
          title: 'Success!',
          description: successMessage,
        });
      }

      if (!shareRecorded && method !== 'copy') {
        console.log('Share might not have been recorded, but action completed');
      }
    } catch (error: any) {
      console.error('Error sharing:', error);
      toast({
        title: 'Error',
        description: 'Failed to share course. Please try again.',
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

  const getButtonStyles = () => {
    if (variant === 'outline') {
      return "border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 text-gray-700";
    } else {
      return "bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 border-gray-200";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isLoading}
          className={cn(
            "transition-all duration-200 group font-medium",
            getButtonStyles(),
            sizeClasses[size],
            "hover:scale-105 active:scale-95",
            className
          )}
        >
          <Share2 
            className={cn(
              isLoading ? "animate-pulse" : "group-hover:scale-110",
              "transition-transform duration-200"
            )} 
            size={iconSizes[size]} 
          />
          {showCount && shareCount > 0 && (
            <span className={cn(
              "ml-1 font-semibold transition-all duration-200",
              "text-gray-700 group-hover:text-blue-600"
            )}>
              {shareCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border-2 border-gray-200 rounded-xl shadow-xl"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem 
          onClick={() => handleShare('copy')}
          className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Copy className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium text-gray-900">Copy Link</div>
            <div className="text-xs text-gray-500">Copy course URL to clipboard</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Twitter className="h-4 w-4 text-blue-400" />
          <div>
            <div className="font-medium text-gray-900">Share on Twitter</div>
            <div className="text-xs text-gray-500">Share with your Twitter followers</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Linkedin className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium text-gray-900">Share on LinkedIn</div>
            <div className="text-xs text-gray-500">Share with professional network</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium text-gray-900">Share on Facebook</div>
            <div className="text-xs text-gray-500">Share with Facebook friends</div>
          </div>
        </DropdownMenuItem>

        <div className="border-t border-gray-200 my-1"></div>

        <DropdownMenuItem 
          onClick={() => handleShare('link')}
          className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-green-50 rounded-lg transition-colors"
        >
          <LinkIcon className="h-4 w-4 text-green-600" />
          <div>
            <div className="font-medium text-gray-900">Record Share</div>
            <div className="text-xs text-gray-500">Just record the share action</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}