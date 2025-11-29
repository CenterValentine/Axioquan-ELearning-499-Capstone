
// /src/components/courses/CourseLearningObjectives.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from "@/types/courses";
import { type Module } from '@/lib/db/queries/curriculum';
import { ModuleAccordion } from '@/components/curriculum/module-accordion'
import { Button } from '@/components/ui/button';
import { Star, Clock, BookOpen, Check, Globe, Calendar, Loader2 } from 'lucide-react';
import { createEnrollmentAction, cancelEnrollmentAction } from '@/lib/courses/actions';
import { checkAuthStatus } from '@/lib/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { CourseReviewsSection } from '@/components/courses/course-reviews-section';
import { CourseCurriculum } from '@/components/courses/course-curriculum-alex';


export interface CourseContentProps {
course: Course;
modules: Module[];
formatDuration: (minutes: number | null | undefined) => string;
isEnrolled: boolean;
setIsEnrolled: (enrolled: boolean) => void;
}

export function CourseContent({course, modules, formatDuration, isEnrolled, setIsEnrolled}: CourseContentProps){
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleEnrollClick = async () => {
      // Check authentication first
      const authStatus = await checkAuthStatus();
      
      if (!authStatus.isAuthenticated) {
        // Redirect to login with return URL
        router.push(`/login?redirect=/courses/${course.slug}`);
        return;
      }


      // TO DO:
      if (isEnrolled) {
        // Navigate to course learning page
        router.push(`/courses/learn/${course.id}`);
        return;
      }

      // Enroll
      setIsLoading(true);
      try {
        const result = await createEnrollmentAction(course.id);
        if (result.success) {
          setIsEnrolled(true);
          toast({
            title: 'Success',
            description: 'You have been enrolled in this course!',
          });
          // Navigate to course learning page
          router.push(`/courses/learn/${course.id}`);
        } else {
          toast({
            title: 'Error',
            description: result.message || result.errors?.[0] || 'Failed to enroll',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to enroll in course',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    return (<>
     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              {/* Course Description */}
              {/* CourseDescription - Course */}
              {course.description_html && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">About This Course</h2>
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: course.description_html }}
                  />
                </div>
              )}

              {/* Learning Objectives */}
              {/* CourseLearningObjectives - objectives: string[] */}
    {course.learning_objectives && course.learning_objectives.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">What You'll Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.learning_objectives.map((objective: string, index: number) => (
                      <div key={index} className="flex gap-3">
                        <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        <p className="text-gray-700">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                      {/* Prerequisites */}
              {/* CoursePrerequisites - prerequisites: string[] */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Prerequisites</h2>
                  <ul className="space-y-3">
                    {course.prerequisites.map((prerequisite: string, index: number) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-blue-600 font-bold mt-1">•</span>
                        <span className="text-gray-700">{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Audience */}
              {/* CourseTargetAudience audience: string[] */}
              {course.target_audience && course.target_audience.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Target Audience</h2>
                  <ul className="space-y-3">
                    {course.target_audience.map((audience: string, index: number) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-purple-600 font-bold mt-1">🎯</span>
                        <span className="text-gray-700">{audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <CourseCurriculum 
                  curriculum={modules}
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                />
            </div>

            {/* Sidebar */}
            {/* CourseSidebar */}
            <div>
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg sticky top-20">
                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-gray-700" size={20} />
                    <span className="font-semibold text-gray-900">{course.total_lessons || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-700" size={20} />
                    <span className="font-semibold text-gray-900">{formatDuration(course.total_video_duration)} total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="text-gray-700" size={20} />
                    <span className="font-semibold text-gray-900">{course.language || 'English'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-700" size={20} />
                    <span className="font-semibold text-gray-900">Last updated: {new Date(course.updated_at).toLocaleDateString()}</span>
                  </div>
                  {course.average_rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="fill-yellow-400 text-yellow-400" size={20} />
                      <span className="font-semibold text-gray-900">{course.average_rating.toFixed(1)} Rating</span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                  <p className="text-sm text-blue-800 font-semibold">
                    {course.price_cents === 0 
                      ? 'Free course! Enroll today and start learning' 
                      : `Special offer! Enroll today for $${(course.price_cents / 100).toFixed(2)}`
                    }
                  </p>
                </div>

                <Button
                  onClick={handleEnrollClick}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition ${
                    isEnrolled
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Enrolling...
                    </>
                  ) : (
                    isEnrolled ? 'Go to Course' : 'Enroll Now'
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  30-day money-back guarantee. No questions asked.
                </p>
              </div>

             
            </div>

            
          </div>
          <CourseReviewsSection 
                courseId={course.id}
                courseSlug={course.slug}
              />
    </section>
    </>)
}

interface CourseCurriculumSectionProps {
  course: Course;
  modules: Module[];
  formatDuration: (minutes: number | null | undefined) => string;
}

function CourseCurriculumSection({ course, modules, formatDuration }: CourseCurriculumSectionProps) {
  const hasModules = modules.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Content</h2>
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b-2 border-gray-200">
          <h3 className="font-bold text-gray-900">Course Curriculum</h3>
          <p className="text-sm text-gray-600">
            {course.total_lessons || 0} lessons • {course.total_quizzes || 0} quizzes • {formatDuration(course.total_video_duration)}
          </p>
        </div>

        {hasModules ? (
          <ul className="divide-y divide-gray-200">
            {modules.map((module) => (
              <li key={module.id} className="p-4 text-left">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{module.title}</h4>
                    {module.description && (
                      <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {module.lessons?.length || 0} lessons
                  </span>
                </div>

                {module.lessons && module.lessons.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} className="pl-4 border-l border-gray-200">
                        <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                        <p className="text-xs text-gray-500">
                          {lesson.lesson_type} • {lesson.video_duration ? formatDuration(lesson.video_duration) : 'Duration not specified'}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-2">Course curriculum will be displayed here</p>
            <p className="text-sm text-gray-400">(Content management coming soon)</p>
          </div>
        )}
      </div>
    </div>
  );
}
