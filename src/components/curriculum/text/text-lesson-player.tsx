"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Lesson } from "@/lib/db/queries/curriculum";

interface TextLessonPlayerProps {
  lesson: Lesson;
}

export function TextLessonPlayer({ lesson }: TextLessonPlayerProps) {
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
      </CardContent>
    </Card>
  );
}

