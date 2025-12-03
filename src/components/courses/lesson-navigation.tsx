import { CourseData } from "@/types/lesson";

interface LessonNavigationProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
}

export function LessonNavigation({
  courseData,
  currentModule,
  currentLesson,
  onSelectLesson,
}: LessonNavigationProps) {
  const handlePrevious = () => {
    if (currentLesson > 0) {
      onSelectLesson(currentModule, currentLesson - 1);
    } else if (currentModule > 0) {
      onSelectLesson(
        currentModule - 1,
        courseData.modules[currentModule - 1].lessons.length - 1
      );
    }
  };

  const handleNext = () => {
    if (
      currentLesson <
      courseData.modules[currentModule].lessons.length - 1
    ) {
      onSelectLesson(currentModule, currentLesson + 1);
    } else if (currentModule < courseData.modules.length - 1) {
      onSelectLesson(currentModule + 1, 0);
    }
  };

  const isFirstLesson = currentModule === 0 && currentLesson === 0;
  const isLastLesson =
    currentModule === courseData.modules.length - 1 &&
    currentLesson ===
      courseData.modules[currentModule].lessons.length - 1;

  return (
    <div className="border-t border-border w-full mt-6 md:mt-8">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
        <div className="flex gap-3 md:gap-4 py-6 md:py-8 flex-col md:flex-row">
          <button
            onClick={handlePrevious}
            disabled={isFirstLesson}
            className="px-6 py-3 md:px-8 md:py-3 rounded-lg border border-border hover:bg-muted transition disabled:opacity-50 font-semibold text-sm md:text-base"
          >
            Previous Lesson
          </button>
          <button
            onClick={handleNext}
            disabled={isLastLesson}
            className="px-6 py-3 md:px-8 md:py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 font-semibold text-sm md:text-base"
          >
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

