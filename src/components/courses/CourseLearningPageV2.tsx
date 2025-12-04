"use client";

import { useState, useEffect, useMemo } from "react";
import { Menu } from "lucide-react";
import { LessonPlayer } from "../curriculum/lesson-player";
import { CourseVideo } from "./course-video";
import { CourseData, Module, Lesson } from "@/types/lesson";
import { CourseProgressBar2 } from "./course-progress";
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
}

export default function CourseLearningPage({
  courseId,
  modules,
  courseTitle,
  courseDescription,
  courseFullDescription,
  courseInstructor,
}: CourseLearningProps) {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
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

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const completeLesson = async () => {
    const lessonId =
      courseData.modules[currentModule].lessons[currentLesson].id;

    // Optimistic update
    setCompletedLessons((prev) => {
      const updated = new Set(prev);
      updated.add(lessonId);
      return updated;
    });

    try {
      // Call API to persist completion
      const response = await fetch(
        `/api/courses/${courseId}/lessons/${lessonId}/progress`,
        {
          method: "POST",
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
          updated.delete(lessonId);
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
        updated.delete(lessonId);
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

  const currentModuleLessons = courseData.modules[currentModule].lessons as Lesson[];

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
            onComplete={completeLesson}
          />

          {/* Overall Progress Bar - Full Width - Under video */}
          <CourseProgressBar2
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
            overallProgress={overallProgress}
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
                />
              )}
            </div>

            {/* Lesson Content Tabs */}
            <LessonContentTabs
              lesson={currentLessonData}
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
