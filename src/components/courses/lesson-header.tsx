import { Lesson, Module } from "@/types/lesson";
import { MarkCompleteButton } from "./mark-complete-button";

interface LessonHeaderProps {
  moduleTitle: string;
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: () => void;
}

export function LessonHeader({
  moduleTitle,
  lesson,
  isCompleted,
  onComplete,
}: LessonHeaderProps) {
  return (
    <div className="border-b border-border pt-6 md:pt-8 pb-6 md:pb-8 w-full">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
        <div className="max-w-4xl md:min-w-[896px] mx-auto">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1.5">
                {moduleTitle}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {lesson.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {lesson.duration / 60} minute video lesson
              </p>
            </div>

            {/* Mark Complete Button */}
            <MarkCompleteButton
              isCompleted={isCompleted}
              onComplete={onComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

