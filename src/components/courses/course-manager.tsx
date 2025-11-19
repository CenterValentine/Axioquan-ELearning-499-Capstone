// /components/courses/course-manager.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseGrid } from './course-grid';
import { CourseEditor } from './course-editor';
import { Course } from '@/types/courses';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CourseManagerProps {
  initialCourses: Course[];
  categories: Category[];
}

type ViewMode = 'list' | 'create' | 'edit';

export function CourseManager({ initialCourses, categories }: CourseManagerProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  const handleCreateCourse = () => {
    setViewMode('create');
    setEditingCourse(null);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setViewMode('edit');
  };

  const handleCancelEdit = () => {
    setViewMode('list');
    setEditingCourse(null);
  };

  const handleSaveCourse = (savedCourse: Course) => {
    if (editingCourse) {
      // Update existing course in the list
      setCourses(prev => prev.map(course => 
        course.id === savedCourse.id ? savedCourse : course
      ));
      toast.success('Course updated successfully');
    } else {
      // Add new course to the list
      setCourses(prev => [savedCourse, ...prev]);
      toast.success('Course created successfully');
    }
    setViewMode('list');
    setEditingCourse(null);
    router.refresh();
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${course.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(prev => prev.filter(c => c.id !== course.id));
        toast.success('Course deleted successfully');
        router.refresh();
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to delete course'
        });
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Error', {
        description: 'Failed to delete course'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishCourse = async (course: Course) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${course.id}/publish`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(prev => prev.map(c => 
          c.id === course.id ? { ...c, is_published: true } : c
        ));
        toast.success('Course published successfully');
        router.refresh();
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to publish course'
        });
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error('Error', {
        description: 'Failed to publish course'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublishCourse = async (course: Course) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${course.id}/publish`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(prev => prev.map(c => 
          c.id === course.id ? { ...c, is_published: false } : c
        ));
        toast.success('Course unpublished successfully');
        router.refresh();
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to unpublish course'
        });
      }
    } catch (error) {
      console.error('Error unpublishing course:', error);
      toast.error('Error', {
        description: 'Failed to unpublish course'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter courses by status
  const publishedCourses = courses.filter(course => course.is_published);
  const draftCourses = courses.filter(course => !course.is_published);

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <CourseEditor
        course={editingCourse || undefined}
        categories={categories}
        onSave={handleSaveCourse}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Course Overview</h2>
              <p className="text-gray-600">
                Manage your course content and track performance
              </p>
            </div>
            <Button onClick={handleCreateCourse} className="bg-blue-600 hover:bg-blue-700">
              Create New Course
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{courses.length}</div>
              <div className="text-sm text-blue-600">Total Courses</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{publishedCourses.length}</div>
              <div className="text-sm text-green-600">Published</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{draftCourses.length}</div>
              <div className="text-sm text-yellow-600">Drafts</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {courses.reduce((sum, course) => sum + course.enrolled_students_count, 0)}
              </div>
              <div className="text-sm text-purple-600">Total Students</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Published Courses */}
      {publishedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Published Courses</CardTitle>
            <CardDescription>
              Your published courses that are available to students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseGrid
              courses={publishedCourses}
              showInstructor={false}
              showActions={true}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onUnpublish={handleUnpublishCourse}
            />
          </CardContent>
        </Card>
      )}

      {/* Draft Courses */}
      {draftCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Draft Courses</CardTitle>
            <CardDescription>
              Courses that are not yet published
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseGrid
              courses={draftCourses}
              showInstructor={false}
              showActions={true}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onPublish={handlePublishCourse}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">
              Start creating your first course to share your knowledge with students
            </p>
            <Button onClick={handleCreateCourse} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}