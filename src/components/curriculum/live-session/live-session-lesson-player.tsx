"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseData } from "@/types/lesson";

interface LiveSessionLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function LiveSessionLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: LiveSessionLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔴</div>
          <h3 className="text-lg font-semibold mb-2">
            Live Session: {lesson.title}
          </h3>
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
}
