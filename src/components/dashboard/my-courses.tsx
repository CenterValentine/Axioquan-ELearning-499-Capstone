"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

// Interface for course data passed from server
export interface MyCourse {
  id: string | number;
  title: string;
  description: string;
  level: string;
  duration: string;
  category: string;
  status: "in-progress" | "completed";
  progress: number;
}

interface MyCoursesPageProps {
  courses: MyCourse[];
}

const categoryColors: Record<string, string> = {
  Programming: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  Business: "bg-green-100 text-green-700",
  Uncategorized: "bg-gray-100 text-gray-700",
};

const levelColors: Record<string, { badge: string; text: string }> = {
  Beginner: { badge: "bg-green-100", text: "text-green-700" },
  Intermediate: { badge: "bg-amber-100", text: "text-amber-700" },
  Advanced: { badge: "bg-red-100", text: "text-red-700" },
  "All-levels": { badge: "bg-blue-100", text: "text-blue-700" },
};

export default function MyCoursesPage({
  courses: coursesData,
}: MyCoursesPageProps) {
  const [filter, setFilter] = useState("all");
  const [resettingCourseId, setResettingCourseId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { toast } = useToast();

  const inProgress = coursesData.filter(
    (c) => c.status === "in-progress"
  ).length;
  const completed = coursesData.filter((c) => c.status === "completed").length;
  const total = coursesData.length;

  const filteredCourses = coursesData.filter((course) => {
    if (filter === "in-progress") return course.status === "in-progress";
    if (filter === "completed") return course.status === "completed";
    return true;
  });

  const handleResetProgress = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (
      !confirm(
        "Are you sure you want to reset your progress for this course? This action cannot be undone."
      )
    ) {
      return;
    }

    setResettingCourseId(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}/reset-progress`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Course progress has been reset",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reset progress",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset course progress",
        variant: "destructive",
      });
    } finally {
      setResettingCourseId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          My Courses
        </h1>
        <p className="text-gray-600 mt-2">
          Track your learning journey and manage your enrolled courses
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
              ▶
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">
            {inProgress}
          </p>
          <p className="text-sm text-gray-600 mt-1">In Progress</p>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
              ✓
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            {completed}
          </p>
          <p className="text-sm text-gray-600 mt-1">Completed</p>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
              🏷
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            {total}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Enrolled</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
        <button
          onClick={() => setFilter("in-progress")}
          className={`px-4 py-2 rounded-full font-medium text-sm md:text-base transition-all ${
            filter === "in-progress"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
          }`}
        >
          In Progress ({inProgress})
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-full font-medium text-sm md:text-base transition-all ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
          }`}
        >
          Completed ({completed})
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full font-medium text-sm md:text-base transition-all ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300"
          }`}
        >
          All Courses ({total})
        </button>
      </div>

      {/* Course cards grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {filteredCourses.map((course) => {
          const levelColor = levelColors[course.level];
          const categoryColor = categoryColors[course.category];
          const isCompleted = course.progress >= 100;
          const isResetting = resettingCourseId === course.id;

          return (
            <div
              key={course.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow p-4 md:p-6 relative"
            >
              {/* Restart button */}
              <button
                onClick={(e) => handleResetProgress(String(course.id), e)}
                disabled={isResetting}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 z-10"
                title="Reset course progress"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                {/* Course Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl md:text-4xl">
                    📚
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${levelColor.badge} ${levelColor.text}`}
                    >
                      {course.level}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 mb-4 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">📅</span>
                      <span className="text-gray-700 font-medium">
                        {course.duration}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}
                      >
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs md:text-sm font-medium text-gray-900">
                        Progress
                      </span>
                      <span className="text-xs md:text-sm font-medium text-gray-900">
                        {course.progress}% complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/courses/learn/${course.id}`}
                      className="flex-1"
                    >
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                        {isCompleted ? "Review Course" : "Start Learning"}
                      </button>
                    </Link>
                    <Link
                      href={`/courses/quiz/${course.id}`}
                      className="flex-1"
                    >
                      <button className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                        Take Quiz
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No courses found</p>
        </div>
      )}
    </div>
  );
}
