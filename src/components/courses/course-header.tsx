import { CourseData } from "@/types/lesson";
import { truncateDescription } from "@/lib/utils/text";

interface CourseHeaderProps {
  courseData: CourseData;
  courseDescription?: string;
  courseFullDescription?: string;
}

export function CourseHeader({
  courseData,
  courseDescription,
  courseFullDescription,
}: CourseHeaderProps) {
  // Determine display description (prefer short, otherwise truncate full)
  const displayDescription = courseDescription
    ? courseDescription.length > 200
      ? truncateDescription(courseDescription)
      : courseDescription
    : courseFullDescription
    ? truncateDescription(courseFullDescription)
    : "";

  // Full description for tooltip (use full if available, otherwise use display)
  const fullDescriptionForTooltip =
    courseFullDescription || courseDescription || "";

  return (
    <div className="bg-white p-6 md:p-2.5 border-b border-border w-full hidden md:block">
      <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 line-clamp-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {courseData.title}
        </h1>
        {displayDescription && (
          <p
            className="text-gray-600 text-lg"
            title={
              fullDescriptionForTooltip !== displayDescription
                ? fullDescriptionForTooltip
                : undefined
            }
          >
            {displayDescription}
          </p>
        )}
        {courseData.instructor && (
          <p className="text-gray-500 mt-1">
            Instructor: {courseData.instructor}
          </p>
        )}
      </div>
    </div>
  );
}

