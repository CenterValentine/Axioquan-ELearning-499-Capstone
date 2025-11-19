// /src/app/courses/[slug]/page.tsx

import { getCourseBySlugAction } from '@/lib/courses/actions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const result = await getCourseBySlugAction(slug);

  if (!result.success || !result.course) {
    notFound();
  }

  const course = result.course;

  // Format video duration properly - with better fallback
  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return 'Content duration not specified';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Course Image & Basic Info */}
          <div className="lg:col-span-2">
            
            {/* FIXED: Thumbnail with Video Play Button - Removed dark overlay */}
            <div className="w-full h-64 lg:h-96 rounded-lg overflow-hidden mb-6 bg-gray-100">
              {course.thumbnail_url ? (
                <div className="relative w-full h-full">
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {/* FIXED: Video Play Button Overlay - No dark background */}
                  {course.promo_video_url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Only the play button with shadow for visibility */}
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-lg">
                        <span className="text-white text-2xl">▶</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">
                    {course.content_type === 'video' ? '🎥' : '📚'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize">
                  {course.difficulty_level}
                </Badge>
                {course.category_name && (
                  <Badge variant="outline">
                    {course.category_name}
                  </Badge>
                )}
                {course.is_featured && (
                  <Badge variant="default">
                    Featured
                  </Badge>
                )}
                {/* Content Type Badge */}
                {course.content_type && (
                  <Badge variant="outline" className="bg-blue-50">
                    {course.content_type === 'video' ? '🎥 Video Course' :
                     course.content_type === 'text' ? '📝 Text Based' :
                     course.content_type === 'mixed' ? '🔄 Mixed Content' :
                     course.content_type === 'interactive' ? '⚡ Interactive' : '📚 Course'}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-xl text-gray-600">
                  {course.subtitle}
                </p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>By <strong>{course.instructor_name}</strong></span>
                <span>•</span>
                <span>{course.total_lessons || 0} lessons</span>
                <span>•</span>
                <span>{course.enrolled_students_count || 0} students</span>
              </div>
            </div>
          </div>

          {/* Course Action Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Enroll in Course</CardTitle>
                <CardDescription>
                  Start your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  {course.price_cents === 0 ? 'Free' : `$${(course.price_cents / 100).toFixed(2)}`}
                </div>
                
                <Button className="w-full" size="lg">
                  Enroll Now
                </Button>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>
                      {formatDuration(course.total_video_duration)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span>{course.language || 'English'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Type:</span>
                    <span className="capitalize">{course.content_type || 'Mixed'}</span>
                  </div>
                  {course.certificate_available && (
                    <div className="flex justify-between">
                      <span>Certificate:</span>
                      <span>Included</span>
                    </div>
                  )}
                  {course.has_lifetime_access && (
                    <div className="flex justify-between">
                      <span>Access:</span>
                      <span>Lifetime</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                {course.description_html ? (
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: course.description_html }}
                  />
                ) : (
                  <p className="text-gray-600">{course.short_description}</p>
                )}
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            {course.learning_objectives && course.learning_objectives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.learning_objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prerequisite: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Target Audience */}
            {course.target_audience && course.target_audience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.target_audience.map((audience: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-1">🎯</span>
                        <span>{audience}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.total_lessons || 0} lessons • {course.total_quizzes || 0} quizzes • {formatDuration(course.total_video_duration)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>Course curriculum will be displayed here</p>
                  <p className="text-sm mt-2">(Content management coming soon)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  {course.instructor_image ? (
                    <img 
                      src={course.instructor_image} 
                      alt={course.instructor_name || 'Instructor'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{course.instructor_name}</div>
                    <div className="text-sm text-gray-600">Instructor</div>
                    {course.instructor_bio && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {course.instructor_bio}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="capitalize font-medium">{course.difficulty_level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Content Type:</span>
                  <span className="capitalize">{course.content_type || 'Mixed'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{new Date(course.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span>{course.enrolled_students_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{formatDuration(course.total_video_duration)}</span>
                </div>
                {course.average_rating > 0 && (
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span>{course.average_rating.toFixed(1)} ⭐ ({course.review_count})</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}