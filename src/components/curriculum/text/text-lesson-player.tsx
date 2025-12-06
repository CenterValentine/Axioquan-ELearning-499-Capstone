"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { LessonDebugPanel } from "../debug/lesson-debug-panel";
import { CourseData } from "@/types/lesson";

interface TextLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function TextLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: TextLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];

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

        {/* Debug Panel */}
        <LessonDebugPanel
          data={lesson}
          courseData={courseData}
          title="Lesson Data from Database"
        />
      </CardContent>
    </Card>
  );
}
