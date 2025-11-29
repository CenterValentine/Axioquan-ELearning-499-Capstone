
// /src/app/courses/[slug]/page.tsx
// This page

'use client';

import { getCourseBySlugAction, getCourseCurriculumAction, checkEnrollmentAction } from '@/lib/courses/actions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useState, useEffect } from 'react';
import { Header} from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

import { CourseHero } from '@/components/courses/course-hero';
import { CourseInstructorSection } from '@/components/courses/CourseInstructorSection';
import { CourseContent } from '@/components/courses/course-content';
import { Module } from '@lib/db/queries/curriculum';

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

type CourseType = any; // TODO: replace with your actual Course type
type CurriculumItem = any; // TODO: replace with your actual Module type

const recordCourseView = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setViewCount(data.total_views);
          console.log('✅ Course view recorded:', data.total_views);
        }
      }
    } catch (error) {
      console.error('❌ Error recording course view:', error);
      // Don't show error to user - view counting is secondary
    }
  };

export default function CoursePage({ params }: CoursePageProps) {

  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [isEnrolled, setIsEnrolled] = useState(false);

    // Function to record course view
  
  

  useEffect(() => {
    async function fetchCourseAndCurriculum() {
      try {
        const { slug } = await params;
        const courseResult = await getCourseBySlugAction(slug);

        if (!courseResult.success || !courseResult.course) {
          setError('Course not found');
          return;
        }

        const loadedCourse = courseResult.course;
        setCourse(loadedCourse);
        setViewCount(loadedCourse.total_views || 0);

         // Fetch curriculum with course ID
        if (loadedCourse.id) {
          const curriculumResult = await getCourseCurriculumAction(loadedCourse.id);
          if (curriculumResult.success) {
            setCurriculum(curriculumResult.curriculum || []);
          }

          // Check enrollment state/status for current user + course
          try {
            const enrollmentResult = await checkEnrollmentAction(loadedCourse.id);
            // Adjust these field names if your action returns different keys
            if (enrollmentResult?.success) {
              setIsEnrolled(!!enrollmentResult.isEnrolled);
            }
          } catch (e) {
            console.error('Error checking enrollment:', e);
          }
        }

        // Record the view after course data is loaded
        const updatedViews = await recordCourseView(loadedCourse.id);
        if (typeof updatedViews === 'number') {
          setViewCount(updatedViews);
        }
      } catch (err) {
        setError('Failed to load course');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    }

fetchCourseAndCurriculum();
  }, [params]);
  


  // Format video duration properly
  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return 'Duration not specified';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

// CourseLoadingState - message: string
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    notFound();
  }

  // Client component for interactive parts
function CourseClientContent(props: {
    course: CourseType;
    curriculum: CurriculumItem[];
    isEnrolled: boolean;
    setIsEnrolled: (value: boolean) => void;
  }) {
        const { course, curriculum, isEnrolled, setIsEnrolled } = props;

    const [expandedModule, setExpandedModule] = useState<number | null>(null);

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
      {/* Hero Section */}
          <CourseHero course={course} formatDuration={formatDuration} isEnrolled={isEnrolled} setIsEnrolled={setIsEnrolled} />
 {/* Instructor Section */}

          <CourseInstructorSection course={course} />
          

                  {/* Main course content / curriculum */}

          <CourseContent course={course} modules={curriculum} formatDuration={formatDuration} isEnrolled={isEnrolled} setIsEnrolled={setIsEnrolled}  />
        <Footer />
      </div>
    );
  }

  return     <CourseClientContent
      course={course}
      curriculum={curriculum}
      isEnrolled={isEnrolled}
      setIsEnrolled={setIsEnrolled}
    />
}