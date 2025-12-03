import { CourseData, Module, Lesson } from "@/types/lesson";

interface CourseProgressProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
  variant?: "bar1" | "bar2";
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export function CourseProgressBar1({
  courseData,
  currentModule,
  currentLesson,
}: CourseProgressProps) {
  const currentLessonData = courseData.modules[currentModule].lessons[
    currentLesson
  ] as Lesson;
  const progressPercentage =
    (currentLessonData.watched / currentLessonData.duration) * 100;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="space-y-2">
        <div className="w-full bg-white/20 rounded-full h-1.5">
          <div
            className="bg-accent rounded-full h-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-white text-xs">
          <span>{formatTime(currentLessonData.watched)}</span>
          <span>{formatTime(currentLessonData.duration)}</span>
        </div>
      </div>
    </div>
  );
}

export function CourseProgressBar2({
  courseData,
  currentModule,
  currentLesson,
  overallProgress: providedProgress,
}: CourseProgressProps & { overallProgress?: number }) {
  // Use provided progress if available, otherwise calculate from modules
  const overallProgress =
    providedProgress !== undefined
      ? providedProgress
      : Math.round(
          courseData.modules.reduce((sum, m) => sum + m.progress, 0) /
            courseData.modules.length
        );

  return (
    <div className="bg-white py-4 md:py-6 border-b border-border w-full">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
        <div className="max-w-4xl md:min-w-[896px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">Course Progress</span>
            <span className="text-2xl font-bold text-gray-900">
              {overallProgress}%
            </span>
          </div>
          {/* Progress bar constrained to match video/header width */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-primary rounded-full h-2.5 transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            You've completed {overallProgress}% of the course. Keep going!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CourseProgress({
  courseData,
  currentModule,
  currentLesson,
  variant = "bar1",
}: CourseProgressProps) {
  if (variant === "bar2") {
    return (
      <CourseProgressBar2
        courseData={courseData}
        currentModule={currentModule}
        currentLesson={currentLesson}
      />
    );
  }

  return (
    <CourseProgressBar1
      courseData={courseData}
      currentModule={currentModule}
      currentLesson={currentLesson}
    />
  );
}
