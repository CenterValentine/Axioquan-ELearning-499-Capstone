// /src/components/courses/CourseEnrollmentCard.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Play, Award, Loader2 } from 'lucide-react';
import { Course } from '@/types/courses';
import { createEnrollmentAction, cancelEnrollmentAction } from '@/lib/courses/actions';
import { checkAuthStatus } from '@/lib/auth/actions';
import { useToast } from '@/hooks/use-toast';

export interface CourseEnrollmentCardProps {
  course: Course;
  isEnrolled: boolean;
  setIsEnrolled: (enrolled: boolean) => void;
}

export function CourseEnrollmentCard({ 
  course, 
  isEnrolled, 
  setIsEnrolled 
}: CourseEnrollmentCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEnrollClick = async () => {
    // Prevent multiple clicks
    if (isLoading) {
      return;
    }

    // Check authentication first
    try {
      const authStatus = await checkAuthStatus();
      
      if (!authStatus.isAuthenticated) {
        // Redirect to login with return URL
        router.push(`/login?redirect=/courses/${course.slug}`);
        return;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify authentication. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (isEnrolled) {
      // Unenroll
      setIsLoading(true);
      try {
        const result = await cancelEnrollmentAction(course.id);
        console.log('Unenroll result:', result); // Debug log
        if (result.success) {
          setIsEnrolled(false);
          toast({
            title: 'Success',
            description: 'You have been unenrolled from this course',
          });
        } else {
          console.error('Unenroll failed:', result); // Debug log
          toast({
            title: 'Error',
            description: result.message || result.errors?.[0] || 'Failed to unenroll',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Unenroll error:', error); // Debug log
        toast({
          title: 'Error',
          description: 'Failed to unenroll from course',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Enroll
      setIsLoading(true);
      try {
        console.log('📤 [CLIENT] Calling createEnrollmentAction for course:', course.id);
        console.log('📤 [CLIENT] Course object:', { id: course.id, title: course.title });
        
        const result = await createEnrollmentAction(course.id);
        
        console.log('📥 [CLIENT] Raw result received:', result);
        console.log('📥 [CLIENT] Result type:', typeof result);
        console.log('📥 [CLIENT] Result keys:', result ? Object.keys(result) : 'null');
        console.log('📥 [CLIENT] Result stringified:', JSON.stringify(result, null, 2));
        
        // Validate result structure - check for empty object first
        if (!result) {
          console.error('❌ [CLIENT] Result is null or undefined');
          toast({
            title: 'Error',
            description: 'No response from server. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        if (typeof result !== 'object' || Array.isArray(result)) {
          console.error('❌ [CLIENT] Invalid result type:', typeof result, result);
          toast({
            title: 'Error',
            description: 'Received invalid response from server. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // Check if result is an empty object
        const resultKeys = Object.keys(result);
        if (resultKeys.length === 0) {
          console.error('❌ [CLIENT] Result is empty object:', result);
          toast({
            title: 'Error',
            description: 'Server returned empty response. Please check server logs and try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // Check if result has success property
        if (!('success' in result) || typeof result.success === 'undefined') {
          console.error('❌ [CLIENT] Result missing success property:', result);
          console.error('❌ [CLIENT] Available properties:', resultKeys);
          toast({
            title: 'Error',
            description: 'Invalid server response format. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        if (result.success === true) {
          setIsEnrolled(true);
          toast({
            title: 'Success',
            description: result.message || 'You have been enrolled in this course!',
          });
        } else {
          console.error('❌ [CLIENT] Enroll failed:', result);
          const errorMessage = result.message || result.errors?.[0] || 'Failed to enroll';
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('❌ [CLIENT] Enroll error caught:', error);
        console.error('❌ [CLIENT] Error type:', typeof error);
        console.error('❌ [CLIENT] Error details:', {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
          cause: error?.cause
        });
        toast({
          title: 'Error',
          description: error?.message || 'Failed to enroll in course. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleWishlistClick = () => {
    // TODO: Implement wishlist functionality
  };

  // TODO: Render enrollment card with:
  // - Course thumbnail with play button overlay (if promo_video_url exists)
  // - Price display (Free or formatted price)
  // - Enroll button (state-based styling)
  // - Wishlist button
  // - Guarantee text and certificate badge (if certificate_available)
  
  return (
    <div className="bg-gray-800 text-white rounded-2xl p-8 shadow-2xl h-fit border border-gray-700">
    {/* Course Thumbnail with Play Button */}
    <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-gray-700 relative">
      {course.thumbnail_url ? (
        <div className="relative w-full h-full">
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          {course.promo_video_url && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-lg">
                <Play className="text-white ml-1" size={24} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
          <span className="text-6xl">
            {course.content_type === 'video' ? '🎬' : '📚'}
          </span>
        </div>
      )}
    </div>

    <div className="mb-6">
      <div className="text-4xl font-bold text-white mb-2">
        {course.price_cents === 0 ? 'Free' : `$${(course.price_cents / 100).toFixed(2)}`}
      </div>
      <p className="text-gray-400">Full lifetime access</p>
    </div>

    <Button
      onClick={handleEnrollClick}
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition mb-4 ${
        isEnrolled
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-white text-gray-900 hover:bg-gray-100'
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {isEnrolled ? 'Unenrolling...' : 'Enrolling...'}
        </>
      ) : (
        isEnrolled ? 'Enrolled' : 'Enroll Now'
      )}
    </Button>

    <Button variant="outline" className="w-full py-3 px-4 border-2 border-gray-600 rounded-lg font-semibold hover:bg-gray-700 transition text-black">
      Add to Wishlist
    </Button>

    <div className="text-xs text-gray-400 text-center mt-4 space-y-2">
      <p>30-day money-back guarantee</p>
      {course.certificate_available && (
        <p className="flex items-center justify-center gap-1">
          <Award size={14} />
          Certificate included
        </p>
      )}
    </div>
  </div>
  )
}

