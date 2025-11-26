
// /src/app/courses/[slug]/page.tsx
// This page

'use client';

import { getCourseBySlugAction, getCourseModulesAction, checkEnrollmentAction } from '@/lib/courses/actions';
import { Module } from '@lib/db/queries/curriculum';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useState, useEffect } from 'react';
import { Header} from '@/components/shell/header';
import { Footer } from '@/components/shell/footer';
import { CourseHero } from '@/components/courses/CourseHero';
import { CourseInstructorSection } from '@/components/courses/CourseInstructorSection';
import { CourseContent } from '@/components/courses/CourseContent';
// import { CourseDescription } from '@/components/courses/CourseDescription';
// import { CourseLearningObjectives } from '@/components/courses/CourseLearningObjectives';
// import { CoursePrerequisites } from '@/components/courses/CoursePrerequisites';
// import { CourseTargetAudience } from '@/components/courses/CourseTargetAudience';
// import { CourseCurriculum } from '@/components/courses/CourseCurriculum';
// import { CourseSidebar } from '@/components/courses/CourseSidebar';

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}


export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoadingCourse] = useState(true);
  const [modulesLoading, setLoadingModules] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    async function fetchCourseAndModules() {
      try {
        setLoadingCourse(true);
        setLoadingModules(true);


        const { slug } = await params;
        const courseResult = await getCourseBySlugAction(slug);
        
        if (!courseResult.success || !courseResult.course) {
          setError('Course not found');
          return;
        }

        setCourse(courseResult.course);
        const modulesResult = await getCourseModulesAction(courseResult.course.id);
        console.log('modulesResult', modulesResult);
        setModules(modulesResult.modules ?? []);

        // Check enrollment status
        try {
          const enrollmentResult = await checkEnrollmentAction(courseResult.course.id);
          if (enrollmentResult.success && enrollmentResult.isEnrolled) {
            setIsEnrolled(true);
          }
        } catch (err) {
          // If not authenticated, enrollment check will fail silently
          console.log('Enrollment check skipped (user not authenticated)');
        }
      } catch (err) {
        console.error('Failed to load course or modules:', err);
        setError('Failed to load course');
        setModules([]);
      } finally {
        setLoadingCourse(false);
        setLoadingModules(false);
      }
    }

    fetchCourseAndModules();
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
  function CourseClientContent({ course }: { course: any }) {
    const [expandedModule, setExpandedModule] = useState<number | null>(null);
    return (
      <div className="min-h-screen bg-background">
        <Header />
          <CourseHero course={course} formatDuration={formatDuration} isEnrolled={isEnrolled} setIsEnrolled={setIsEnrolled} />
          {/* Instructor Section - not implimented because of undefined db fields */}

          <CourseInstructorSection course={course} />
          
          <CourseContent course={course} modules={modules} formatDuration={formatDuration} isEnrolled={isEnrolled} setIsEnrolled={setIsEnrolled}  />
        <Footer />
      </div>
    );
  }

  return <CourseClientContent course={course} />;
}