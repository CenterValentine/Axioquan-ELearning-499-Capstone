"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

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
  const handleDownload = (url: string | null, filename?: string) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (filename) {
      link.download = filename;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
