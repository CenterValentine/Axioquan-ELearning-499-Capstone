
// /src/app/courses/[slug]/page.tsx

'use client'

import { getCourseBySlugAction } from '@/lib/courses/actions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Clock, Users, BookOpen, ChevronDown, Play, Check, Award, Globe, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const { slug } = await params;
        const result = await getCourseBySlugAction(slug);
        
        if (!result.success || !result.course) {
          setError('Course not found');
          return;
        }
        
        setCourse(result.course);
      } catch (err) {
        setError('Failed to load course');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [params]);

  // Format video duration properly
  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return 'Duration not specified';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

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
    const [isEnrolled, setIsEnrolled] = useState(false);

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section with Black Theme */}
        <section className="bg-gradient-to-r from-gray-900 to-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <div className="bg-gray-800 text-white rounded-2xl p-8 shadow-2xl h-fit border border-gray-700">
                {/* Course Thumbnail with Play Button */}
                <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-gray-700 relative">
                  {course.thumbnail_url ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {course.promo_video_url && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-lg">
                            <Play className="text-white ml-1" size={24} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <span className="text-6xl">
                        {course.content_type === 'video' ? '🎬' : '📚'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-white mb-2">
                    {course.price_cents === 0 ? 'Free' : `$${(course.price_cents / 100).toFixed(2)}`}
                  </div>
                  <p className="text-gray-400">Full lifetime access</p>
                </div>

                <Button
                  onClick={() => setIsEnrolled(!isEnrolled)}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition mb-4 ${
                    isEnrolled
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                </Button>

                <Button variant="outline" className="w-full py-3 px-4 border-2 border-gray-600 rounded-lg font-semibold hover:bg-gray-700 transition text-black">
                  Add to Wishlist
                </Button>

                <div className="text-xs text-gray-400 text-center mt-4 space-y-2">
                  <p>30-day money-back guarantee</p>
                  {course.certificate_available && (
                    <p className="flex items-center justify-center gap-1">
                      <Award size={14} />
                      Certificate included
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructor Section */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">About the Instructor</h2>
            <div className="flex gap-8 items-start">
              {course.instructor_image ? (
                <img
                  src={course.instructor_image}
                  alt={course.instructor_name || 'Instructor'}
                  className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                  {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-900">{course.instructor_name}</h3>
                <p className="text-gray-600 mb-3">{course.instructor_bio || 'Experienced instructor'}</p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{course.enrolled_students_count?.toLocaleString() || 0}</span> students enrolled
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              {/* Course Description */}
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

              {/* Course Curriculum Placeholder */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Content</h2>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-6 bg-gray-50 border-b-2 border-gray-200">
                    <h3 className="font-bold text-gray-900">Course Curriculum</h3>
                    <p className="text-sm text-gray-600">
                      {course.total_lessons || 0} lessons • {course.total_quizzes || 0} quizzes • {formatDuration(course.total_video_duration)}
                    </p>
                  </div>
                  <div className="p-8 text-center">
                    <p className="text-gray-500 mb-2">Course curriculum will be displayed here</p>
                    <p className="text-sm text-gray-400">(Content management coming soon)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
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
                  onClick={() => setIsEnrolled(!isEnrolled)}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition ${
                    isEnrolled
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isEnrolled ? 'Go to Course' : 'Enroll Now'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  30-day money-back guarantee. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return <CourseClientContent course={course} />;
}