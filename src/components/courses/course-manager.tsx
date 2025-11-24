
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
import { Play, Star, Users, BookOpen, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

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

// Helper function to safely format ratings
const formatRating = (rating: any): string => {
  if (rating === null || rating === undefined) return '4.8';
  
  const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
  
  if (isNaN(numRating)) return '4.8';
  
  return numRating.toFixed(1);
};

// Helper function to safely get numbers
const getNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined) return defaultValue;
  
  const numValue = typeof value === 'string' ? parseInt(value) : Number(value);
  
  return isNaN(numValue) ? defaultValue : numValue;
};

// Premium Course Card Component matching homepage design
function PremiumCourseCard({ 
  course, 
  onEdit, 
  onDelete, 
  onPublish, 
  onUnpublish 
}: { 
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onPublish?: (course: Course) => void;
  onUnpublish?: (course: Course) => void;
}) {
  const rating = formatRating(course.average_rating);
  const studentCount = getNumber(course.enrolled_students_count);
  const lessonCount = getNumber(course.total_lessons);
  
  // Build the course detail URL - works in both development and production
  const courseDetailUrl = `/courses/${course.slug || course.id}`;
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-200">
      {/* Course Image with Play Button - Clickable for course details */}
      <Link href={courseDetailUrl}>
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
          <img
            src={course.thumbnail_url || "/placeholder-course.png"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
              <Play size={32} className="text-blue-600 fill-blue-600" />
            </div>
          </div>
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
            course.is_featured 
              ? 'bg-yellow-500 text-white' 
              : course.is_trending 
              ? 'bg-green-500 text-white'
              : 'bg-gray-600 text-white'
          }`}>
            {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : course.is_published ? 'PUBLISHED' : 'DRAFT'}
          </span>
        </div>
      </Link>

      {/* Course Info */}
      <div className="p-4">
        {/* Course Title - Clickable for course details */}
        <Link href={courseDetailUrl}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14 hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </Link>
        
        {/* Course Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
            <span className="font-semibold text-sm">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users size={16} />
            <span className="text-sm">{studentCount}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <BookOpen size={16} />
            <span className="text-sm">{lessonCount}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
          {course.short_description || (course.description_html ? course.description_html.substring(0, 100) + '...' : 'No description available')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit?.(course)}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              Edit
            </Button>
            
            {course.is_published ? (
              <Button
                onClick={() => onUnpublish?.(course)}
                variant="outline"
                size="sm"
                className="flex-1 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                Unpublish
              </Button>
            ) : (
              <Button
                onClick={() => onPublish?.(course)}
                size="sm"
                className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white"
              >
                Publish
              </Button>
            )}
          </div>

          {/* Curriculum Button - Full width */}
          <Link href={`/dashboard/instructor/courses/${course.id}/curriculum`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
            >
              <FileText size={14} className="mr-2" />
              Curriculum
            </Button>
          </Link>

          {/* Delete Button - Full width */}
          <Button
            onClick={() => onDelete?.(course)}
            variant="destructive"
            size="sm"
            className="w-full text-xs"
          >
            Delete
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Created: {new Date(course.created_at).toLocaleDateString()}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            course.is_published 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {course.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Updated Course Grid Component with Premium Design
function PremiumCourseGrid({ 
  courses, 
  title, 
  description,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish 
}: { 
  courses: Course[];
  title: string;
  description?: string;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onPublish?: (course: Course) => void;
  onUnpublish?: (course: Course) => void;
}) {
  if (!courses || courses.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course) => (
            <PremiumCourseCard
              key={course.id}
              course={course}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublish={onPublish}
              onUnpublish={onUnpublish}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

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
                {courses.reduce((sum, course) => sum + getNumber(course.enrolled_students_count), 0)}
              </div>
              <div className="text-sm text-purple-600">Total Students</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Published Courses */}
      {publishedCourses.length > 0 && (
        <PremiumCourseGrid
          courses={publishedCourses}
          title="Published Courses"
          description="Your published courses that are available to students"
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
          onUnpublish={handleUnpublishCourse}
        />
      )}

      {/* Draft Courses */}
      {draftCourses.length > 0 && (
        <PremiumCourseGrid
          courses={draftCourses}
          title="Draft Courses"
          description="Courses that are not yet published"
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
          onPublish={handlePublishCourse}
        />
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