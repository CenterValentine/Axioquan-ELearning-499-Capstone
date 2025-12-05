"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/lib/db/queries/curriculum";

interface AssignmentLessonPlayerProps {
  lesson: Lesson;
}

export function AssignmentLessonPlayer({
  lesson,
}: AssignmentLessonPlayerProps) {
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

