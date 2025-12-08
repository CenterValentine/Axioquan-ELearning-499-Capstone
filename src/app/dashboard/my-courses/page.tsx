// Comments?

import { getSession } from "@/lib/auth/session";
import AppShellSidebar from "@/components/layout/AppSidebarNav";
import MyCoursesPage, {
  type MyCourse,
} from "@/components/dashboard/my-courses";
import { getUserEnrolledCourses } from "@/lib/db/queries/enrollments";
import Unauthorized from "@/components/auth/unauthorized";

// Helper to format duration from minutes to "X weeks" format
function formatDurationWeeks(minutes: number | null | undefined): string {
  if (!minutes || minutes === 0) return "Duration not specified";
  // Approximate: 1 week = ~10 hours of content = 600 minutes
  const weeks = Math.ceil(minutes / 600);
  if (weeks === 1) return "1 week";
  return `${weeks} weeks`;
}

// Helper to determine status from progress
function getStatusFromProgress(
  progress: number | null | undefined
): "in-progress" | "completed" {
  if (!progress) return "in-progress";
  return progress >= 100 ? "completed" : "in-progress";
}

// Helper to map difficulty level to display format
function formatDifficultyLevel(level: string | null | undefined): string {
  if (!level) return "Beginner";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export default async function MyCourses() {
  const session = await getSession();

  if (!session || !session.userId) {
    return <Unauthorized />;
  }

  // Create user object from session
  const user = {
    id: session.userId,
    name: session.name || "User",
    email: session.email || "user@example.com",
    primaryRole: session.primaryRole || "student",
    image: undefined,
  };

  // Fetch enrolled courses with progress from DB query helper
  let coursesData: MyCourse[] = [];
  try {
    const enrolledCoursesData = await getUserEnrolledCourses(session.userId);

    // Map DB data to UI shape with proper validation and type safety
    coursesData = enrolledCoursesData
      .filter((course: any) => {
        // Filter out any invalid courses (missing required fields)
        if (!course || !course.id || !course.title) {
          console.warn("Skipping invalid course data:", course);
          return false;
        }
        return true;
      })
      .map((course: any): MyCourse => {
        // Ensure progress is a valid number between 0-100
        const rawProgress = course.progress ?? 0;
        const progress = Math.max(
          0,
          Math.min(100, Math.round(Number(rawProgress) || 0))
        );

        return {
          id: String(course.id), // Ensure ID is always a string for consistency
          title: String(course.title || "Untitled Course"),
          description:
            course.short_description ||
            course.description_html ||
            "No description available",
          level: formatDifficultyLevel(course.difficulty_level),
          duration: formatDurationWeeks(course.total_video_duration),
          category: course.category_name || "Uncategorized",
          status: getStatusFromProgress(progress),
          progress: progress,
        };
      });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    // Fallback to empty array on error
    coursesData = [];
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppShellSidebar user={user} />
      <main className="flex-1 overflow-auto">
        <MyCoursesPage courses={coursesData} />
      </main>
    </div>
  );
}
