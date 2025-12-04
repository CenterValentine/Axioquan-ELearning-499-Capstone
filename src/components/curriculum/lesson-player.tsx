// /components/curriculum/lesson-player.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileText as TranscriptIcon } from 'lucide-react';
import { Lesson } from '@/lib/db/queries/curriculum';
import { TextLessonPlayer } from '@/components/curriculum/text';
import { DocumentLessonPlayer } from '@/components/curriculum/document';
import { QuizLessonPlayer } from '@/components/curriculum/quiz';
import { AssignmentLessonPlayer } from '@/components/curriculum/assignment';
import { LiveSessionLessonPlayer } from '@/components/curriculum/live-session';
import { AudioLessonPlayer } from '@/components/curriculum/audio';
import { InteractiveLessonPlayer } from '@/components/curriculum/interactive';
import { CodeLessonPlayer } from '@/components/curriculum/code';
import { DiscussionLessonPlayer } from '@/components/curriculum/discussion';
import { CoreVideoPlayer } from '@/components/curriculum/video';

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
}: LessonPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  const getContentComponent = () => {
    switch (lesson.lesson_type) {
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <CoreVideoPlayer lesson={lesson} />
          </div>
        );

      case 'text':
        return <TextLessonPlayer lesson={lesson} />;

      case 'document':
        return <DocumentLessonPlayer lesson={lesson} />;

      case 'quiz':
        return <QuizLessonPlayer lesson={lesson} />;

      case 'assignment':
        return <AssignmentLessonPlayer lesson={lesson} />;

      case 'live_session':
        return <LiveSessionLessonPlayer lesson={lesson} />;

      case 'audio':
        return <AudioLessonPlayer lesson={lesson} />;

      case 'interactive':
        return <InteractiveLessonPlayer lesson={lesson} />;

      case 'code':
        return <CodeLessonPlayer lesson={lesson} />;

      case 'discussion':
        return <DiscussionLessonPlayer lesson={lesson} />;

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

     
    </div>
  );
}