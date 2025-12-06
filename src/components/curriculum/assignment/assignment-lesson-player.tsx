"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseData } from "@/types/lesson";

interface AssignmentLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function AssignmentLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: AssignmentLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">
            Assignment: {lesson.title}
          </h3>
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
}
