

// /src/components/courses/CourseHero.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, BookOpen } from 'lucide-react';
import { Course } from '@/types/courses';
import { CourseEnrollmentCard } from '@/components/courses/CourseEnrollmentCard';

export interface CourseHeroProps {
  course: Course;
  formatDuration: (minutes: number | null | undefined) => string;
  isEnrolled: boolean;
  setIsEnrolled: (enrolled: boolean) => void;
}

export function CourseHero({ course, formatDuration, isEnrolled, setIsEnrolled }: CourseHeroProps) {
  return (<section className="bg-gradient-to-r from-gray-900 to-black text-white">
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

          <div>
            <p className="opacity-80 mb-2">Instructor</p>
            <p className="font-bold text-white">{course.instructor_name}</p>
          </div>
        </div>

        {/* Enrollment Card */}
        {/* CourseEnrollmentCard */}
        <CourseEnrollmentCard course={course} isEnrolled={isEnrolled} setIsEnrolled={setIsEnrolled} />
     
      </div>
    </div>
  </section>);
}
