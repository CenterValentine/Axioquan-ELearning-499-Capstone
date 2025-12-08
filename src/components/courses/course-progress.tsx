import { CourseData, Module, Lesson } from "@/types/lesson";

interface CourseProgress1Props {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
  overallProgress?: number;
  variant?: "bar1" | "bar2";
}

interface CourseProgress2Props {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
  overallProgress?: number;
  variant: "bar1" | "bar2";
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export function CourseProgressBar({
  courseData,
  currentModule,
  currentLesson,
  overallProgress: providedProgress,
  variant = "bar1",
}: CourseProgress2Props & { overallProgress?: number }) {
  // Use provided progress if available, otherwise calculate from modules
  const overallProgress =
    providedProgress !== undefined
      ? providedProgress
      : Math.round(
          courseData.modules.reduce((sum, m) => sum + m.progress, 0) /
            courseData.modules.length
        );

  const isBar1 = variant === "bar1";

  // Content that's common to both variants
  const progressContent = (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">Course Progress</span>
        <span className="text-2xl font-bold text-gray-900">
          {overallProgress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="bg-primary rounded-full h-2.5 transition-all"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">
        You've completed {overallProgress}% of the course. Keep going!
      </p>
    </>
  );

  // For bar1: use max-width constraints
  if (isBar1) {
    return (
      <div className="bg-white py-4 md:py-6 border-b border-border w-full">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
          <div className="max-w-4xl md:min-w-[896px] mx-auto">
            {progressContent}
          </div>
        </div>
      </div>
    );
  }

  // For bar2: stay within container, no max-width constraints
  return (
    <div className="w-full pt-4">
      <div className="w-full">{progressContent}</div>
    </div>
  );
}

export default function CourseProgress({
  courseData,
  currentModule,
  currentLesson,
  variant = "bar1",
}: CourseProgress1Props) {
  if (variant === "bar2") {
    return (
      <CourseProgressBar
        courseData={courseData}
        currentModule={currentModule}
        currentLesson={currentLesson}
        variant="bar2"
      />
    );
  }

  return (
    <CourseProgressBar
      courseData={courseData}
      currentModule={currentModule}
      currentLesson={currentLesson}
      variant="bar2"
    />
  );
}
