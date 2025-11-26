
// /src/components/courses/course-curriculum.tsx

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Play, Lock, FileText, CheckCircle, Code, MessageCircle, Headphones, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string | null;
  lesson_type: 'video' | 'text' | 'document' | 'quiz' | 'assignment' | 'live_session' | 'audio' | 'interactive' | 'code' | 'discussion';
  content_type: 'free' | 'premium' | 'trial';
  difficulty: string;
  video_url: string | null;
  video_duration: number;
  video_thumbnail: string | null;
  document_url: string | null;
  content_html: string | null;
  order_index: number;
  is_published: boolean;
  is_preview: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  slug: string;
  order_index: number;
  is_published: boolean;
  is_preview_available: boolean;
  is_required: boolean;
  estimated_duration: number;
  lesson_count: number;
  video_duration: number;
  learning_objectives: string[];
  key_concepts: string[];
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

interface CourseCurriculumProps {
  curriculum: Module[];
  courseId: string;
  isEnrolled?: boolean;
  className?: string;
}

export function CourseCurriculum({ 
  curriculum, 
  courseId, 
  isEnrolled = false, 
  className 
}: CourseCurriculumProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const formatDuration = (minutes: number) => {
    if (!minutes || minutes === 0) return '';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType) {
      case 'video':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'quiz':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'assignment':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'code':
        return <Code className="h-4 w-4 text-orange-600" />;
      case 'audio':
        return <Headphones className="h-4 w-4 text-pink-600" />;
      case 'interactive':
        return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'discussion':
        return <MessageCircle className="h-4 w-4 text-indigo-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  // FIXED: Proper null checking for reduce operations
  const getTotalCourseDuration = (): number => {
    if (!curriculum || !Array.isArray(curriculum)) return 0;
    
    return curriculum.reduce((total: number, module: Module) => {
      const moduleDuration = module.lessons?.reduce((moduleTotal: number, lesson: Lesson) => {
        return moduleTotal + (lesson.video_duration || 0);
      }, 0) || 0;
      
      return total + moduleDuration;
    }, 0);
  };

  const getTotalLessons = (): number => {
    if (!curriculum || !Array.isArray(curriculum)) return 0;
    
    return curriculum.reduce((total: number, module: Module) => {
      return total + (module.lessons?.length || 0);
    }, 0);
  };

  const getPreviewLessonsCount = (): number => {
    if (!curriculum || !Array.isArray(curriculum)) return 0;
    
    return curriculum.reduce((total: number, module: Module) => {
      const previewLessons = module.lessons?.filter((lesson: Lesson) => lesson.is_preview) || [];
      return total + previewLessons.length;
    }, 0);
  };

  // Alternative approach using optional chaining and nullish coalescing (more concise)
  const getTotalCourseDurationAlt = (): number => {
    return curriculum?.reduce((total, module) => {
      return total + (module.lessons?.reduce((moduleTotal, lesson) => {
        return moduleTotal + (lesson.video_duration || 0);
      }, 0) ?? 0);
    }, 0) ?? 0;
  };

  if (!curriculum || curriculum.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Curriculum Coming Soon
          </h3>
          <p className="text-gray-600">
            The course curriculum is being prepared by the instructor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Curriculum Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Content</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>{curriculum.length} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{getTotalLessons()} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{formatDuration(getTotalCourseDuration())} total length</span>
          </div>
          {getPreviewLessonsCount() > 0 && !isEnrolled && (
            <div className="flex items-center gap-1 text-blue-600">
              <span>{getPreviewLessonsCount()} preview lessons available</span>
            </div>
          )}
          {!isEnrolled && (
            <div className="flex items-center gap-1 text-blue-600">
              <Lock className="h-3 w-3" />
              <span>Enroll to access all content</span>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum Modules */}
      <div className="space-y-3">
        {curriculum.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          const moduleDuration = module.lessons?.reduce((total: number, lesson: Lesson) => {
            return total + (lesson.video_duration || 0);
          }, 0) || 0;
          const previewLessons = module.lessons?.filter((lesson: Lesson) => lesson.is_preview) || [];

          return (
            <Card key={module.id} className="overflow-hidden border-2 border-gray-200">
              <CardHeader 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      )}
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {moduleIndex + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {module.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>{module.lessons?.length || 0} lessons</span>
                        {moduleDuration > 0 && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(moduleDuration)}</span>
                          </>
                        )}
                        {previewLessons.length > 0 && !isEnrolled && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {previewLessons.length} previews
                            </Badge>
                          </>
                        )}
                      </div>
                      {module.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Module Lessons */}
              {isExpanded && module.lessons && module.lessons.length > 0 && (
                <CardContent className="p-0 border-t border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const canAccess = isEnrolled || lesson.is_preview;
                      
                      return (
                        <div
                          key={lesson.id}
                          className={cn(
                            "p-4 flex items-center gap-4 transition-colors",
                            canAccess 
                              ? "hover:bg-gray-50 cursor-pointer" 
                              : "bg-gray-50 opacity-75"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2">
                              {getLessonIcon(lesson.lesson_type)}
                              <span className="text-sm text-gray-500 w-6 text-center">
                                {lessonIndex + 1}
                              </span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={cn(
                                  "font-medium",
                                  canAccess ? "text-gray-900" : "text-gray-500"
                                )}>
                                  {lesson.title}
                                </h4>
                                {lesson.is_preview && !isEnrolled && (
                                  <Badge variant="secondary" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                                {lesson.content_type === 'premium' && (
                                  <Badge variant="outline" className="text-xs bg-yellow-50">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              {lesson.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {lesson.video_duration > 0 && (
                              <span className="text-sm text-gray-500">
                                {formatDuration(lesson.video_duration)}
                              </span>
                            )}
                            {!canAccess && (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Curriculum Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-900">What you'll get</h4>
            <p className="text-sm text-blue-700">
              {getTotalLessons()} lessons • {formatDuration(getTotalCourseDuration())} of content
              {getPreviewLessonsCount() > 0 && !isEnrolled && (
                <span className="block mt-1">
                  + {getPreviewLessonsCount()} free preview lessons
                </span>
              )}
            </p>
          </div>
          {!isEnrolled && (
            <Badge className="bg-blue-600 text-white">
              Enroll to Access
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}