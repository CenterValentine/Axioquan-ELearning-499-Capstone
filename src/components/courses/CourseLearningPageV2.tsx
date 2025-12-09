"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import { LessonPlayer } from "../curriculum/lesson-player";
import { CourseVideo } from "./course-video";
import { CourseData, Module, Lesson } from "@/types/lesson";
import { CourseProgressBar } from "./course-progress";
import { FullScreenVideoPlayer } from "../curriculum/video/fullscreen-video-player";
import { CourseSidebar } from "./course-sidebar";
import { CourseHeader } from "./course-header";
import { MobileHeader } from "./mobile-header";
import { LessonHeader } from "./lesson-header";
import { LessonContentTabs } from "./lesson-content-tabs";
import { LessonNavigation } from "./lesson-navigation";

interface CourseLearningProps {
  courseId: string;
  modules: Module[]; // from curriculum.ts - Module interface
  courseTitle?: string;
  courseDescription?: string;
  courseFullDescription?: string;
  courseInstructor?: string;
  initialLessonId?: string; // Optional lesson ID from URL query parameter
}

export default function CourseLearningPage({
  courseId,
  modules,
  courseTitle,
  courseDescription,
  courseFullDescription,
  courseInstructor,
  initialLessonId,
}: CourseLearningProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ref to track programmatic lesson changes (prevents useEffect from interfering)
  const isProgrammaticChange = useRef(false);

  // Helper function to find lesson indices from lessonId
  const findLessonIndices = (
    lessonId: string | null | undefined,
    modules: Module[]
  ): { moduleIndex: number; lessonIndex: number } => {
    // Default to first lesson
    let moduleIndex = 0;
    let lessonIndex = 0;

    if (lessonId && modules.length > 0) {
      // Search for the lesson
      for (let i = 0; i < modules.length; i++) {
        const index = modules[i].lessons.findIndex(
          (lesson) => lesson.id === lessonId
        );
        if (index !== -1) {
          moduleIndex = i;
          lessonIndex = index;
          break; // Found, exit early
        }
      }
    }

    return { moduleIndex, lessonIndex };
  };

  // Lazy initialization: Calculate initial values synchronously before first render
  const [currentModule, setCurrentModule] = useState(() => {
    const lessonIdToFind = initialLessonId || searchParams.get("lessonId");
    return findLessonIndices(lessonIdToFind, modules).moduleIndex;
  });

  const [currentLesson, setCurrentLesson] = useState(() => {
    const lessonIdToFind = initialLessonId || searchParams.get("lessonId");
    return findLessonIndices(lessonIdToFind, modules).lessonIndex;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  // Track completed lessons by lesson ID
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  // Make courseData stateful so we can update progress reactively
  const [courseData, setCourseData] = useState<CourseData>({
    id: courseId,
    title: courseTitle || "",
    description: courseDescription || "",
    instructor: courseInstructor || "",
    modules: modules,
  });

  // Update courseData when modules prop changes
  useEffect(() => {
    setCourseData({
      id: courseId,
      title: courseTitle || "",
      description: courseDescription || "",
      instructor: courseInstructor || "",
      modules: modules,
    });
  }, [courseId, courseTitle, courseDescription, courseInstructor, modules]);

  // Initialize completed lessons from props when component loads or modules change
  useEffect(() => {
    const completed = new Set<string>();
    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (lesson.completed) {
          completed.add(lesson.id);
        }
      });
    });
    setCompletedLessons(completed);
  }, [modules]);

  // Update lesson selection when URL changes (e.g., browser back/forward)
  // Note: This only handles external URL changes, not our own selectLesson calls
  useEffect(() => {
    // Skip if this is a programmatic change we just made
    if (isProgrammaticChange.current) {
      isProgrammaticChange.current = false; // Reset flag
      return;
    }

    const lessonIdFromUrl = searchParams.get("lessonId");
    // Only update if URL has a different lessonId than what we're currently showing
    const currentLessonId = modules[currentModule]?.lessons[currentLesson]?.id;

    // Skip if we're already on this lesson (prevents feedback loop)
    if (lessonIdFromUrl && lessonIdFromUrl !== currentLessonId) {
      const { moduleIndex, lessonIndex } = findLessonIndices(
        lessonIdFromUrl,
        modules
      );
      // Only update if the found indices are different from current
      if (moduleIndex !== currentModule || lessonIndex !== currentLesson) {
        setCurrentModule(moduleIndex);
        setCurrentLesson(lessonIndex);
      }
    }
  }, [searchParams, modules, currentModule, currentLesson]);

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    // Mark this as a programmatic change to prevent useEffect from interfering
    isProgrammaticChange.current = true;

    // Update state immediately for instant UI update
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
    setCurrentTime(0);
    setIsPlaying(false);

    // Update URL with lesson ID using router.replace (no history entry, but updates searchParams)
    // Use modules prop directly to ensure we have the latest data
    const lessonId = modules[moduleIndex]?.lessons[lessonIndex]?.id;
    if (lessonId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lessonId", lessonId);

      // Use replace instead of push to avoid adding history entries
      // This updates the URL and searchParams without full page navigation
      router.replace(`/courses/learn/${courseId}?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  const toggleLessonCompletion = async () => {
    const lessonId =
      courseData.modules[currentModule].lessons[currentLesson].id;

    const currentlyCompleted = completedLessons.has(lessonId);

    // Optimistic update
    setCompletedLessons((prev) => {
      const updated = new Set(prev);
      if (currentlyCompleted) {
        updated.delete(lessonId);
      } else {
        updated.add(lessonId);
      }
      return updated;
    });

    try {
      // Call API to persist completion
      const response = await fetch(
        `/api/courses/${courseId}/lessons/${lessonId}/progress`,
        {
          method: currentlyCompleted ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let error;
        try {
          const errorText = await response.text();
          console.error("Raw error response:", errorText);
          try {
            error = JSON.parse(errorText);
          } catch (e) {
            error = {
              error:
                errorText || `HTTP ${response.status}: ${response.statusText}`,
            };
          }
        } catch (e) {
          error = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error("Failed to complete lesson:", error);
        console.error("Response status:", response.status);
        console.error("Response URL:", response.url);
        // Revert optimistic update on error
        setCompletedLessons((prev) => {
          const updated = new Set(prev);
          if (currentlyCompleted) {
            updated.add(lessonId);
          } else {
            updated.delete(lessonId);
          }
          return updated;
        });
        return;
      }

      const result = await response.json();

      // Update module progress if returned
      if (result.progress) {
        setCourseData((prev) => ({
          ...prev,
          modules: prev.modules.map((module, idx) => {
            if (idx === currentModule) {
              return {
                ...module,
                progress: result.progress.moduleProgress,
              };
            }
            return module;
          }),
        }));
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      // Revert optimistic update on error
      setCompletedLessons((prev) => {
        const updated = new Set(prev);
        if (currentlyCompleted) {
          updated.add(lessonId);
        } else {
          updated.delete(lessonId);
        }
        return updated;
      });
    }
  };

  // Get current lesson's completed status
  const isCurrentLessonCompleted = useMemo(() => {
    if (!courseData.modules[currentModule]?.lessons[currentLesson])
      return false;
    const lessonId =
      courseData.modules[currentModule].lessons[currentLesson].id;
    return completedLessons.has(lessonId);
  }, [currentModule, currentLesson, completedLessons, courseData.modules]);

  // Calculate module progress reactively from completedLessons
  const calculateModuleProgress = (module: Module): number => {
    const completedCount = module.lessons.filter((lesson) =>
      completedLessons.has(lesson.id)
    ).length;
    return module.lessons.length > 0
      ? Math.round((completedCount / module.lessons.length) * 100)
      : 0;
  };

  // Calculate overall progress reactively
  const overallProgress = useMemo(() => {
    if (courseData.modules.length === 0) return 0;
    const totalProgress = courseData.modules.reduce(
      (sum, module) => sum + calculateModuleProgress(module),
      0
    );
    return Math.round(totalProgress / courseData.modules.length);
  }, [courseData.modules, completedLessons]);

  // Update module progress when completedLessons changes
  useEffect(() => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module) => ({
        ...module,
        progress: calculateModuleProgress(module),
      })),
    }));
  }, [completedLessons]);

  // Track watched time for the current lesson
  useEffect(() => {
    const currentLessonId =
      courseData.modules[currentModule]?.lessons[currentLesson]?.id;
    if (!currentLessonId || !isPlaying || currentTime <= 0) return;

    // Update watched time every 5 seconds
    const interval = setInterval(async () => {
      try {
        await fetch(
          `/api/courses/${courseId}/lessons/${currentLessonId}/progress`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ watchedSeconds: Math.floor(currentTime) }),
          }
        );
      } catch (error) {
        console.error("Error updating watched time:", error);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [
    courseId,
    currentModule,
    currentLesson,
    isPlaying,
    currentTime,
    courseData.modules,
  ]);

  const currentLessonData = courseData.modules[currentModule].lessons[
    currentLesson
  ] as Lesson;

  const currentModuleLessons = courseData.modules[currentModule]
    .lessons as Lesson[];

  // If video is expanded, show full screen video page
  if (isVideoExpanded) {
    return (
      <FullScreenVideoPlayer
        lesson={currentLessonData}
        courseData={courseData}
        currentModule={currentModule}
        currentLesson={currentLesson}
        onClose={() => setIsVideoExpanded(false)}
        courseId={courseId}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Course Sidebar (Mobile + Desktop) */}
      <CourseSidebar
        courseData={courseData}
        currentModule={currentModule}
        currentLesson={currentLesson}
        completedLessons={completedLessons}
        onSelectLesson={selectLesson}
      />

      {/* Main Content Area - Normal Page Scroll with Sidebar Offset */}
      <div className="flex-1 overflow-y-auto md:ml-80 w-full">
        {/* Mobile Header */}
        <MobileHeader
          courseData={courseData}
          currentModule={currentModule}
          currentLessonData={currentLessonData}
        />

        {/* Floating Course Menu Button - Note: Sidebar state is now managed internally */}
        {/* This button would need to be moved into CourseSidebar or use a callback */}

        <div className="w-full max-w-none">
          {/* Course Title Header - Full Width (Hidden on mobile) */}
          <CourseHeader
            courseData={courseData}
            courseDescription={courseDescription}
            courseFullDescription={courseFullDescription}
          />

          {/* Video Player Section - Full Width - Optional */}
          <CourseVideo
            key={`${currentModule}-${currentLessonData.id}`}
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLessonData.id}
            currentModuleLessons={currentModuleLessons}
            onExpand={() => setIsVideoExpanded(true)}
          />

          {/* Lesson Header */}
          <LessonHeader
            moduleTitle={courseData.modules[currentModule].title}
            lesson={currentLessonData}
            isCompleted={isCurrentLessonCompleted}
            onComplete={toggleLessonCompletion}
          />

          {/* Overall Progress Bar - Full Width - Under video */}
          <CourseProgressBar
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
            variant="bar1"
            // overallProgress={overallProgress}
          />

          {/* Lesson Content Section - Full Width */}
          <div className="bg-white px-4 md:px-8 py-6 md:py-8 w-full">
            {/* Overall Progress Bar - Full Width */}
            <div className="pt-6 md:pt-8 w-full">
              {courseData.modules[currentModule].lessons[currentLesson]
                .lesson_type !== "video" && (
                <LessonPlayer
                  lesson={
                    courseData.modules[currentModule].lessons[currentLesson]
                  }
                  courseData={courseData}
                  currentModule={currentModule}
                  currentLesson={currentLesson}
                />
              )}
            </div>

            {/* Lesson Content Tabs */}
            <LessonContentTabs
              lesson={currentLessonData}
              currentModule={currentModule}
              currentLesson={currentLesson}
              onBookmarkClick={setCurrentTime}
            />

            {/* Navigation Buttons - Full Width but content constrained */}
            <LessonNavigation
              courseData={courseData}
              currentModule={currentModule}
              currentLesson={currentLesson}
              onSelectLesson={selectLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
