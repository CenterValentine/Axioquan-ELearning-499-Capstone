import { AxioQuanLogo } from "../layout/axioquan-logo";
import { CourseData, Module, Lesson } from "@/types/lesson";

interface MobileHeaderProps {
  courseData: CourseData;
  currentModule: number;
  currentLessonData: Lesson;
}

export function MobileHeader({
  courseData,
  currentModule,
  currentLessonData,
}: MobileHeaderProps) {
  return (
    <div className="md:hidden bg-white border-b border-border p-4 sticky top-0 z-30 w-full">
      <div className="flex items-center justify-between w-full">
        <AxioQuanLogo size="small" />
        <div className="flex-1 ml-3 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {courseData.title}
          </h1>

          {/* Current Lesson Info for Mobile */}
          <div className="mt-1">
            <p className="text-xs text-muted-foreground truncate">
              {courseData.modules[currentModule].title}
            </p>
            <p className="font-semibold text-foreground text-sm truncate">
              {currentLessonData.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

