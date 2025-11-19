// /app/dashboard/instructor/create/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { requireRole } from '@/lib/auth/utils';
import { getCategoriesAction } from '@/lib/categories/actions';
import { CourseEditor } from '@/components/courses/course-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CreateCoursePage() {
  const session = await withSessionRefresh();
  await requireRole(['instructor', 'admin']);

  const categoriesResult = await getCategoriesAction();
  const categories = categoriesResult.categories || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-2">
          Start creating your amazing course by filling out the details below
        </p>
      </div>

      {/* Quick Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Course Creation Tips</CardTitle>
          <CardDescription>
            Best practices for creating engaging courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Write a compelling title and subtitle</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Use high-quality thumbnail images</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Set clear learning objectives</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Choose relevant categories and tags</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Provide detailed descriptions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Set appropriate difficulty level</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CourseEditor categories={categories} />
    </div>
  );
}