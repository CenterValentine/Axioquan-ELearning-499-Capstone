"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/lib/db/queries/curriculum";

interface LiveSessionLessonPlayerProps {
  lesson: Lesson;
}

export function LiveSessionLessonPlayer({
  lesson,
}: LiveSessionLessonPlayerProps) {
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

