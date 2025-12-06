"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseData } from "@/types/lesson";

interface CodeLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function CodeLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: CodeLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">💻</div>
          <h3 className="text-lg font-semibold mb-2">
            Code Lesson: {lesson.title}
          </h3>
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
}
