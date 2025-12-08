"use client";

import { DocumentViewer } from "./document-viewer";
import { LessonDebugPanel } from "../debug/lesson-debug-panel";
import { CourseData } from "@/types/lesson";

interface DocumentLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function DocumentLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: DocumentLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];

  return (
    <div className="space-y-4">
      <DocumentViewer
        documentUrl={lesson.document_url}
        documentTitle={lesson.title}
        documentType={lesson.document_type}
      />

      {/* Debug Panel */}
      <LessonDebugPanel
        data={lesson}
        courseData={courseData}
        title="Lesson Data from Database"
      />
    </div>
  );
}
