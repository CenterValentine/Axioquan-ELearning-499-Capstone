
// /app/dashboard/instructor/courses/[id]/curriculum/page.tsx

import { getCourseById } from '@/lib/db/queries/courses';
import { getCourseCurriculumAction } from '@/lib/courses/curriculum-actions';
import { CurriculumBuilder } from '@/components/curriculum/curriculum-builder';
import { requireRole } from '@/lib/auth/utils';
import { notFound } from 'next/navigation';

interface CurriculumPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CurriculumPage({ params }: CurriculumPageProps) {
  // Check instructor role
  await requireRole(['instructor', 'admin']);
  
  const { id } = await params;
  
  // Fetch course and curriculum data
  const [course, curriculumResult] = await Promise.all([
    getCourseById(id),
    getCourseCurriculumAction(id)
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Curriculum Builder
          </h1>
          <p className="text-lg text-gray-600">
            Build and organize the learning content for: <strong>{course.title}</strong>
          </p>
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <span>Course: {course.title}</span>
            <span>•</span>
            <span>Status: {course.is_published ? 'Published' : 'Draft'}</span>
            <span>•</span>
            <span>Students: {course.enrolled_students_count}</span>
          </div>
        </div>

        {/* Curriculum Builder */}
        <CurriculumBuilder 
          courseId={id}
          initialCurriculum={curriculumResult.modules || []}
        />
      </div>
    </div>
  );
}