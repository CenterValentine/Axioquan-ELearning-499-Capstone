"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseData } from "@/types/lesson";
import QuizPage from "./quiz-page";

interface QuizLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function QuizLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: QuizLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];
  const [error, setError] = useState<string | null>(null);

  // QuizPage will handle fetching the quiz data
  // We just need to pass the lesson ID
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Quiz</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <QuizPage quizId={lesson.id} />;
}
