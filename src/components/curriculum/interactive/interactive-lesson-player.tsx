"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseData } from "@/types/lesson";

interface InteractiveLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function InteractiveLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: InteractiveLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold mb-2">
            Interactive: {lesson.title}
          </h3>
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
}
