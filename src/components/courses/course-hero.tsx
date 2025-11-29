

// /src/components/courses/CourseHero.tsx

'use client';

import { Badge } from '@/components/ui/badge';

import { Course } from '@/types/courses';
import { CourseEnrollmentCard } from '@/components/courses/CourseEnrollmentCard';
import { LikeButton } from '@/components/social/like-button';
import { ShareButton } from '@/components/social/share-button';
import { Star, Clock, Users, BookOpen, Heart, Share2, Eye } from 'lucide-react';


export interface CourseHeroProps {
  course: Course;
  formatDuration: (minutes: number | null | undefined) => string;
  isEnrolled: boolean;
  setIsEnrolled: (enrolled: boolean) => void;
  likeCount: number;
  shareCount: number;
}

export function CourseHero({ course, formatDuration, isEnrolled, setIsEnrolled }: CourseHeroProps) {
  return (
  <section className="bg-gradient-to-r from-gray-900 to-black text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* CourseBadges */}
      <div className="grid md:grid-cols-3 gap-12 items-end">
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize">
              {course.difficulty_level}
            </Badge>
            {course.category_name && (
              <Badge variant="outline" className="bg-transparent text-white border-white/30">
                {course.category_name}
              </Badge>
            )}
            {course.is_featured && (
              <Badge className="bg-yellow-500 text-black border-0">
                Featured
              </Badge>
            )}
            {course.content_type && (
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                {course.content_type === 'video' ? '🎬 Video Course' :
                 course.content_type === 'text' ? '📚 Text Based' :
                 course.content_type === 'mixed' ? '🔀 Mixed Content' :
                 course.content_type === 'interactive' ? '⚡ Interactive' : '📖 Course'}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {course.title}
          </h1>

          {course.subtitle && (
            <p className="text-xl opacity-90 mb-6 text-gray-200">
              {course.subtitle}
            </p>
          )}

          <p className="text-lg opacity-90 mb-6 text-gray-300">
            {course.short_description}
          </p>

                  {/* Course Stats with Social Metrics */}
                          <div className="flex flex-wrap gap-6 mb-6">
                            {course.average_rating > 0 && (
                              <div className="flex items-center gap-2">
                                <Star className="fill-yellow-400 text-yellow-400" size={20} />
                                <span className="font-semibold">{course.average_rating.toFixed(1)}</span>
                                <span className="opacity-80">({course.review_count || 0} reviews)</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Users size={20} />
                              <span>{course.enrolled_students_count?.toLocaleString() || 0} students</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={20} />
                              <span>{formatDuration(course.total_video_duration)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen size={20} />
                              <span>{course.total_lessons || 0} lessons</span>
                            </div>
                          </div>
          
                          {/* Social Engagement Stats */}
                          <div className="flex flex-wrap gap-6 mb-6 p-4 bg-white/10 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Heart size={18} className="fill-red-500 text-red-500" />
                              <span className="font-semibold">{course.like_count || 0} likes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Share2 size={18} />
                              <span className="font-semibold">{course.share_count || 0} shares</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye size={18} />
                              <span className="font-semibold">{(course.total_views || 0).toLocaleString()} views</span>
                            </div>
                          </div>
          
                          {/* Social Action Buttons */}
                          <div className="flex gap-3 mb-6">
                            <LikeButton 
                              courseId={course.id}
                              initialLikeCount={course.like_count || 0}
                              size="lg"
                              showCount={true}
                              variant="outline"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            />
                            <ShareButton 
                              courseId={course.id}
                              courseTitle={course.title}
                              initialShareCount={course.share_count || 0}
                              size="lg"
                              showCount={true}
                              variant="outline"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            />
                          </div>
        </div>

        {/* Enrollment Card - Third Column */}
        <div>
          <CourseEnrollmentCard course={course} isEnrolled={isEnrolled} setIsEnrolled={setIsEnrolled} />
        </div>
      </div>
    </div>
  </section>);
}
