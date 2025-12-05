"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/lib/db/queries/curriculum";

interface QuizLessonPlayerProps {
  lesson: Lesson;
}

export function QuizLessonPlayer({ lesson }: QuizLessonPlayerProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">❓</div>
          <h3 className="text-lg font-semibold mb-2">Quiz: {lesson.title}</h3>
          <p className="text-gray-600 mb-4">
            Quiz functionality is coming soon!
          </p>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Under Development
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

