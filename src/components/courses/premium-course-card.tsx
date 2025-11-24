// /components/courses/premium-course-card.tsx

import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types/courses';

interface PremiumCourseCardProps {
  course: Course;
}

export function PremiumCourseCard({ course }: PremiumCourseCardProps) {
  const formatPrice = (priceCents: number) => {
    if (priceCents === 0) return 'FREE';
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    if (!minutes || minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Safe rating formatting that handles numbers, strings, null, and undefined
  const getRating = (rating: any): string => {
    if (!rating || rating === 0 || rating === '0') return '4.8';
    
    // Convert to number if it's a string
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    
    // Check if it's a valid number
    if (isNaN(numericRating) || !isFinite(numericRating)) return '4.8';
    
    return numericRating.toFixed(1);
  };

  // Safe access to properties that might be null/undefined
  const thumbnailUrl = course.thumbnail_url || "/placeholder-course.png";
  const instructorImage = course.instructor_image || undefined;
  const instructorName = course.instructor_name || 'Expert Instructor';
  const priceCents = course.price_cents || 0;
  const enrolledStudents = course.enrolled_students_count || 0;
  const totalLessons = course.total_lessons || 0;
  const totalVideoDuration = course.total_video_duration || 0;
  const categoryName = course.category_name || undefined;
  const difficultyLevel = course.difficulty_level || undefined;
  const courseTags = course.tags || [];

  return (
    <Link href={`/courses/${course.slug || course.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-100">
        {/* Course Image with Play Button */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary to-secondary">
          <img
            src={thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
              <Play size={32} className="text-primary fill-primary" />
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {course.is_featured && (
              <Badge className="bg-purple-500 text-white border-0 text-xs font-bold">
                FEATURED
              </Badge>
            )}
            {course.is_trending && !course.is_featured && (
              <Badge className="bg-orange-500 text-white border-0 text-xs font-bold">
                TRENDING
              </Badge>
            )}
          </div>
          
          {/* Difficulty Level */}
          {difficultyLevel && (
            <div className="absolute top-3 right-3">
              <Badge 
                variant="secondary" 
                className={`text-xs font-medium border ${getDifficultyColor(difficultyLevel)}`}
              >
                {difficultyLevel}
              </Badge>
            </div>
          )}
          
          {/* Price */}
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-white text-gray-900 font-bold border-0 shadow-sm">
              {formatPrice(priceCents)}
            </Badge>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-4">
          {/* Category */}
          {categoryName && (
            <Badge variant="outline" className="text-xs mb-2">
              {categoryName}
            </Badge>
          )}
          
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
            {course.title}
          </h3>
          
          {/* Instructor with Profile Image */}
          <div className="flex items-center gap-2 mb-3">
            {instructorImage && (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-gray-600 truncate">
              {instructorName}
            </p>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              {totalLessons > 0 && (
                <span className="flex items-center gap-1">
                  📚 {totalLessons} lessons
                </span>
              )}
              {totalVideoDuration > 0 && (
                <span className="flex items-center gap-1">
                  ⏱️ {formatDuration(totalVideoDuration)}
                </span>
              )}
            </div>
          </div>

          {/* Rating and Price */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="font-semibold text-sm text-gray-900">
                {getRating(course.average_rating)}
              </span>
            </div>
            
            <div className="text-right">
              <span className="text-primary font-bold text-lg">
                {formatPrice(priceCents)}
              </span>
              {enrolledStudents > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {enrolledStudents.toLocaleString()} students
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          {courseTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {courseTags.slice(0, 2).map((tag, index) => (
                <Badge 
                  key={tag.id || index}
                  variant="outline"
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${tag.color}15`,
                    borderColor: tag.color,
                    color: tag.color
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
              {courseTags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{courseTags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}