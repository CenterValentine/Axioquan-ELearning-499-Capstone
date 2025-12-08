"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CourseData } from "@/types/lesson";

interface AudioLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function AudioLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: AudioLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎧</div>
          <h3 className="text-lg font-semibold mb-2">
            Audio Lesson: {lesson.title}
          </h3>
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
}
