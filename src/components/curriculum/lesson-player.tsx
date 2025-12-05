// /components/curriculum/lesson-player.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, FileText, Download, Captions, FileText as TranscriptIcon } from 'lucide-react';
import { Lesson } from '@/lib/db/queries/curriculum';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export function LessonPlayer({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious, 
  showNavigation = true 
}: LessonPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  const handleDownload = (url: string | null, filename?: string) => {
    if (!url) return;
    
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (filename) {
      link.download = filename;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getContentComponent = () => {
    switch (lesson.lesson_type) {
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {lesson.video_url ? (
              <video
                controls
                className="w-full h-full"
                poster={lesson.video_thumbnail || undefined}
              >
                <source src={lesson.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Video content not available</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <Card>
            <CardContent className="p-6">
              {lesson.content_html ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.content_html }}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No content available for this lesson</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'document':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <FileText className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                <p className="text-gray-600 mb-4">
                  This lesson contains a document for you to download and study.
                </p>
                {lesson.document_url && (
                  <Button 
                    onClick={() => handleDownload(lesson.document_url, lesson.title)}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Document</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'quiz':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">❓</div>
                <h3 className="text-lg font-semibold mb-2">Quiz: {lesson.title}</h3>
                <p className="text-gray-600 mb-4">
                  Quiz functionality is coming soon!
                </p>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Under Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        );

      case 'assignment':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">Assignment: {lesson.title}</h3>
                <p className="text-gray-600 mb-4">
                  Assignment functionality is coming soon!
                </p>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  Under Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        );

      case 'live_session':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔴</div>
                <h3 className="text-lg font-semibold mb-2">Live Session: {lesson.title}</h3>
                <p className="text-gray-600 mb-4">
                  Live session functionality is coming soon!
                </p>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  Under Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        );

      case 'audio':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎧</div>
                <h3 className="text-lg font-semibold mb-2">Audio Lesson: {lesson.title}</h3>
                {lesson.audio_url ? (
                  <audio controls className="w-full max-w-md mx-auto">
                    <source src={lesson.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <p className="text-gray-600">Audio content not available</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'interactive':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold mb-2">Interactive: {lesson.title}</h3>
                <p className="text-gray-600 mb-4">
                  Interactive content functionality is coming soon!
                </p>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Under Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        );

      case 'code':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-lg font-semibold mb-2">Code Lesson: {lesson.title}</h3>
                <p className="text-gray-600 mb-4">
                  Code environment functionality is coming soon!
                </p>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                  Under Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        );

      case 'discussion':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">Discussion: {lesson.title}</h3>
                <p className="text-gray-600 mb-4">
                  Discussion functionality is coming soon!
                </p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Under Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Content type "{lesson.lesson_type}" is not yet supported in the preview.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {lesson.lesson_type}
                </Badge>
                {lesson.is_preview && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Free Preview
                  </Badge>
                )}
                {lesson.difficulty && lesson.difficulty !== 'beginner' && (
                  <Badge variant="outline" className="capitalize">
                    {lesson.difficulty}
                  </Badge>
                )}
              </div>
              <CardTitle>{lesson.title}</CardTitle>
              {lesson.description && (
                <CardDescription className="text-base mt-2">
                  {lesson.description}
                </CardDescription>
              )}
            </div>
            
            {/* Lesson Actions */}
            <div className="flex items-center space-x-2">
              {lesson.has_transcript && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  <TranscriptIcon className="h-4 w-4 mr-2" />
                  Transcript
                </Button>
              )}
              {lesson.has_captions && (
                <Button variant="outline" size="sm">
                  <Captions className="h-4 w-4 mr-2" />
                  Captions
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      {getContentComponent()}

      {/* Transcript */}
      {showTranscript && lesson.has_transcript && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TranscriptIcon className="h-5 w-5" />
              <span>Lesson Transcript</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-600 italic">
                Transcript functionality will be available when transcripts are added to the lesson.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion & Navigation */}
      {showNavigation && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                {!isCompleted && lesson.requires_completion && (
                  <Button onClick={handleComplete}>
                    Mark as Complete
                  </Button>
                )}
                {isCompleted && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    ✓ Completed
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-2">
                {onPrevious && (
                  <Button variant="outline" onClick={onPrevious}>
                    Previous
                  </Button>
                )}
                {onNext && (
                  <Button onClick={onNext}>
                    Next Lesson
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}