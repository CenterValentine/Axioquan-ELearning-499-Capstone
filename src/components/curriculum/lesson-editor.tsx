
// /components/curriculum/lesson-editor.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/courses/file-upload';
import { Lesson } from '@/lib/db/queries/curriculum';

interface LessonEditorProps {
  lesson: Lesson;
  onSave: (updates: any) => void;
  onCancel: () => void;
}

const lessonTypes = [
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'document', label: 'Document', icon: '📄' },
  { value: 'quiz', label: 'Quiz', icon: '❓' },
  { value: 'assignment', label: 'Assignment', icon: '📋' },
  { value: 'live_session', label: 'Live Session', icon: '🔴' },
  { value: 'audio', label: 'Audio', icon: '🎧' },
  { value: 'interactive', label: 'Interactive', icon: '⚡' },
  { value: 'code', label: 'Code', icon: '💻' },
  { value: 'discussion', label: 'Discussion', icon: '💬' }
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
  const [formData, setFormData] = useState({
    title: lesson.title,
    description: lesson.description || '',
    lesson_type: lesson.lesson_type,
    difficulty: lesson.difficulty,
    video_url: lesson.video_url || '',
    video_duration: lesson.video_duration || 0,
    document_url: lesson.document_url || '',
    content_html: lesson.content_html || '',
    is_published: lesson.is_published,
    is_preview: lesson.is_preview
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLessonType = () => {
    return lessonTypes.find(type => type.value === formData.lesson_type) || lessonTypes[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Lesson</CardTitle>
        <CardDescription>
          Update your lesson content and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Lesson Title *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Introduction to React Components"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of what students will learn in this lesson"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Lesson Type & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lesson Type & Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lesson_type" className="block text-sm font-medium mb-1">
                  Lesson Type
                </label>
                <select
                  id="lesson_type"
                  value={formData.lesson_type}
                  onChange={(e) => handleInputChange('lesson_type', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {lessonTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => handleInputChange('is_published', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="is_published" className="text-sm font-medium">
                  Published
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_preview"
                  checked={formData.is_preview}
                  onChange={(e) => handleInputChange('is_preview', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="is_preview" className="text-sm font-medium">
                  Available as Preview
                </label>
              </div>
            </div>
          </div>

          {/* Content Based on Lesson Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lesson Content</h3>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  {getCurrentLessonType().icon} {getCurrentLessonType().label}
                </Badge>
                <span className="text-sm text-blue-700">
                  Configure {getCurrentLessonType().label.toLowerCase()} content below
                </span>
              </div>
            </div>

            {formData.lesson_type === 'video' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Video Content
                </label>
                <FileUpload
                  value={formData.video_url}
                  onChange={(url) => handleInputChange('video_url', url)}
                  onUploadComplete={(meta) => {
                    if (meta.duration) {
                      handleInputChange('video_duration', Math.round(meta.duration));
                    }
                  }}
                  type="video"
                  description="Upload a video file or paste a video URL"
                />
                
                {formData.video_duration > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Video duration: {Math.round(formData.video_duration / 60)} minutes
                  </div>
                )}
              </div>
            )}

            {formData.lesson_type === 'document' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Document File
                </label>
                <FileUpload
                  value={formData.document_url}
                  onChange={(url) => handleInputChange('document_url', url)}
                  type="document"
                  description="Upload PDF, Word, PowerPoint, or other document files"
                />
              </div>
            )}

            {(formData.lesson_type === 'text' || formData.lesson_type === 'discussion') && (
              <div>
                <label htmlFor="content_html" className="block text-sm font-medium mb-1">
                  Content
                </label>
                <Textarea
                  id="content_html"
                  value={formData.content_html}
                  onChange={(e) => handleInputChange('content_html', e.target.value)}
                  placeholder="Write your lesson content here. You can use basic HTML formatting."
                  rows={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports basic HTML tags: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;br&gt;
                </p>
              </div>
            )}

            {formData.lesson_type === 'quiz' && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                  Quiz functionality coming soon! For now, you can describe the quiz in the description field.
                </p>
              </div>
            )}

            {formData.lesson_type === 'assignment' && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-orange-800">
                  Assignment functionality coming soon! For now, you can describe the assignment in the description field.
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              type="submit" 
              disabled={loading || !formData.title.trim()}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Lesson'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}