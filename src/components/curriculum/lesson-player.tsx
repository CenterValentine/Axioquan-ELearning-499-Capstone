// /components/curriculum/lesson-player.tsx
// todo:  manage onNext and onPrevious functions in this component.
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileText as TranscriptIcon } from "lucide-react";
import { Lesson } from "@/lib/db/queries/curriculum";
import { TextLessonPlayer } from "@/components/curriculum/text";
import { DocumentLessonPlayer } from "@/components/curriculum/document";
import { QuizLessonPlayer } from "@/components/curriculum/quiz";
import { AssignmentLessonPlayer } from "@/components/curriculum/assignment";
import { LiveSessionLessonPlayer } from "@/components/curriculum/live-session";
import { AudioLessonPlayer } from "@/components/curriculum/audio";
import { InteractiveLessonPlayer } from "@/components/curriculum/interactive";
import { CodeLessonPlayer } from "@/components/curriculum/code";
import { DiscussionLessonPlayer } from "@/components/curriculum/discussion";
import { CoreVideoPlayer } from "@/components/curriculum/video";
import { CourseData, Lesson as UILesson, Module } from "@/types/lesson";

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function LessonPlayer({
  lesson,
  onComplete,
  courseData,
  currentModule,
  currentLesson,
}: LessonPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  // Sending courseData to each lesson player component brings consistency and making the entire courseData object available to each lesson player component shouldn't have performance impact as a single object is being reused across all lesson player components.

  console.log("courseData", courseData);
  console.log("currentModule", currentModule);
  console.log("currentLesson", currentLesson);

  const getContentComponent = () => {
    switch (lesson.lesson_type) {
      case "video":
        if (!loading) {
          return <div>Loading course data...</div>; // or null, or a placeholder
        }

        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <CoreVideoPlayer
              courseData={courseData}
              currentModule={currentModule}
              currentLesson={currentLesson}
            />
          </div>
        );

      case "text":
        return (
          <TextLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      case "document":
        return (
          <DocumentLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      case "quiz":
        return (
          <QuizLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      case "assignment":
        return (
          <AssignmentLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      case "live_session":
        return (
          <LiveSessionLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      case "audio":
        return (
          <AudioLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      case "interactive":
        return (
          <InteractiveLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      case "code":
        return (
          <CodeLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      case "discussion":
        return (
          <DiscussionLessonPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        );

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  Content type "{lesson.lesson_type}" is not yet supported in
                  the preview.
                </p>
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
                Transcript functionality will be available when transcripts are
                added to the lesson.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
