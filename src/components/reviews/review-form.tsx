
// // /src/components/reviews/review-form.tsx

// 'use client';

// import { useState } from 'react';
// import { useToast } from '@/hooks/use-toast';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { StarRating } from './star-rating';
// import { Send } from 'lucide-react';
// import { cn } from '@/lib/utils'; // ADD THIS IMPORT

// interface ReviewFormProps {
//   courseId: string;
//   onReviewSubmitted?: () => void;
//   className?: string;
// }

// export function ReviewForm({ courseId, onReviewSubmitted, className }: ReviewFormProps) {
//   const [rating, setRating] = useState(0);
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (rating === 0) {
//       toast({
//         title: 'Rating Required',
//         description: 'Please select a star rating',
//         variant: 'destructive',
//       });
//       return;
//     }

//     if (content.trim().length < 10) {
//       toast({
//         title: 'Review Too Short',
//         description: 'Please write at least 10 characters',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await fetch('/api/reviews', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           course_id: courseId,
//           rating,
//           title: title.trim() || undefined,
//           content: content.trim(),
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to submit review');
//       }

//       if (data.success) {
//         toast({
//           title: 'Review Submitted',
//           description: 'Thank you for your review!',
//         });

//         // Reset form
//         setRating(0);
//         setTitle('');
//         setContent('');

//         if (onReviewSubmitted) {
//           onReviewSubmitted();
//         }
//       }
//     } catch (error: any) {
//       console.error('Error submitting review:', error);
//       toast({
//         title: 'Error',
//         description: error.message || 'Failed to submit review',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isFormValid = rating > 0 && content.trim().length >= 10;

//   return (
//     <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Rating Section */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Your Rating *
//           </label>
//           <StarRating
//             rating={rating}
//             onRatingChange={setRating}
//             readonly={false}
//             size="lg"
//             showLabel={false}
//           />
//           {rating > 0 && (
//             <p className="text-sm text-gray-600 mt-1">
//               You rated this course {rating} star{rating !== 1 ? 's' : ''}
//             </p>
//           )}
//         </div>

//         {/* Title Section */}
//         <div>
//           <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
//             Review Title (Optional)
//           </label>
//           <Input
//             id="review-title"
//             type="text"
//             placeholder="Summarize your experience..."
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             maxLength={100}
//             className="w-full"
//           />
//         </div>

//         {/* Content Section */}
//         <div>
//           <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-2">
//             Your Review *
//           </label>
//           <Textarea
//             id="review-content"
//             placeholder="Share your experience with this course. What did you like? What could be improved?"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             rows={4}
//             className="w-full resize-vertical"
//             required
//           />
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>Minimum 10 characters</span>
//             <span>{content.length} / 1000</span>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <Button
//           type="submit"
//           disabled={!isFormValid || isSubmitting}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               Submitting...
//             </>
//           ) : (
//             <>
//               <Send size={16} className="mr-2" />
//               Submit Review
//             </>
//           )}
//         </Button>
//       </form>
//     </div>
//   );
// }






















// /src/components/reviews/review-form.tsx

'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { StarRating } from './star-rating';
import { Send, Lock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  courseId: string;
  onReviewSubmitted?: () => void;
  className?: string;
}

interface EnrollmentStatus {
  isEnrolled: boolean;
  enrollmentId?: string;
}

export function ReviewForm({ courseId, onReviewSubmitted, className }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus | null>(null);
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Check enrollment status when component mounts
  useEffect(() => {
    checkEnrollmentStatus();
  }, [courseId]);

  const checkEnrollmentStatus = async () => {
    try {
      setLoadingEnrollment(true);
      const response = await fetch(`/api/courses/${courseId}/enrollment-status`);
      
      if (response.ok) {
        const data = await response.json();
        setEnrollmentStatus(data);
      } else {
        setEnrollmentStatus({ isEnrolled: false });
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      setEnrollmentStatus({ isEnrolled: false });
    } finally {
      setLoadingEnrollment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enrollmentStatus?.isEnrolled) {
      toast({
        title: 'Enrollment Required',
        description: 'Please enroll in this course to submit a review',
        variant: 'destructive',
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating',
        variant: 'destructive',
      });
      return;
    }

    if (content.trim().length < 10) {
      toast({
        title: 'Review Too Short',
        description: 'Please write at least 10 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: courseId,
          rating,
          title: title.trim() || undefined,
          comment: content.trim(), // CHANGED: content → comment to match database
          enrollment_id: enrollmentStatus.enrollmentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      if (data.success) {
        toast({
          title: 'Review Submitted',
          description: 'Thank you for your review!',
        });

        // Reset form
        setRating(0);
        setTitle('');
        setContent('');

        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      
      // Handle specific error messages
      if (error.message.includes('enrollment') || error.message.includes('Enrollment')) {
        toast({
          title: 'Enrollment Required',
          description: 'Please enroll in this course to submit a review',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to submit review',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollClick = () => {
    // Navigate to enrollment page or trigger enrollment
    toast({
      title: 'Enroll to Review',
      description: 'Please enroll in this course to share your experience',
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // You can implement enrollment logic here
            // For now, just show a message
            toast({
              title: 'Enrollment',
              description: 'Enrollment functionality coming soon!',
            });
          }}
        >
          Enroll Now
        </Button>
      ),
    });
  };

  const isFormValid = rating > 0 && content.trim().length >= 10;
  const canSubmit = enrollmentStatus?.isEnrolled && isFormValid;

  if (loadingEnrollment) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!enrollmentStatus?.isEnrolled) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-6 text-center', className)}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Enroll to Review
            </h3>
            <p className="text-gray-600 mb-4 max-w-sm">
              You need to be enrolled in this course to share your experience and help other students.
            </p>
          </div>

          <Button
            onClick={handleEnrollClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Enroll to Review This Course
          </Button>

          <p className="text-xs text-gray-500">
            Only enrolled students can submit reviews
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
          <p className="text-sm text-green-600 font-medium">✓ You are enrolled in this course</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            readonly={false}
            size="lg"
            showLabel={false}
          />
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              You rated this course {rating} star{rating !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Title Section */}
        <div>
          <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (Optional)
          </label>
          <Input
            id="review-title"
            type="text"
            placeholder="Summarize your experience..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full"
          />
        </div>

        {/* Content Section */}
        <div>
          <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <Textarea
            id="review-content"
            placeholder="Share your experience with this course. What did you like? What could be improved? Your review will help other students make informed decisions."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full resize-vertical"
            required
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Minimum 10 characters</span>
            <span>{content.length} / 1000</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Submit Review
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your review will be publicly visible to help other students
        </p>
      </form>
    </div>
  );
}