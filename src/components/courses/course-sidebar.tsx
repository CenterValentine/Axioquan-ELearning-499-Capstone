"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  BookOpen,
  LayoutDashboard,
  X,
  Menu,
} from "lucide-react";
import { AxioQuanLogo } from "../layout/axioquan-logo";
import { CourseData, Module, Lesson } from "@/types/lesson";
import { formatTime } from "@/lib/utils/duration";

// Helper to check if a lesson is completed
function isLessonCompleted(lessonId: string, completedLessons: Set<string>): boolean {
  return completedLessons.has(lessonId);
}

interface CourseSidebarProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
  completedLessons: Set<string>;
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
}

export function CourseSidebar({
  courseData,
  currentModule,
  currentLesson,
  completedLessons,
  onSelectLesson,
}: CourseSidebarProps) {
  // Manage expanded modules state internally
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  
  // Manage mobile sidebar open state internally
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleModule = (index: number) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectLesson = (moduleIndex: number, lessonIndex: number) => {
    onSelectLesson(moduleIndex, lessonIndex);
    setIsMobileSidebarOpen(false); // Close mobile sidebar when lesson is selected
  };
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
        fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="p-4 border-b border-border bg-white">
          <div className="flex items-center justify-between mb-4">
            <AxioQuanLogo />
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition group w-full"
          >
            <LayoutDashboard size={20} className="text-primary" />
            <span className="font-semibold text-foreground">
              Back to Dashboard
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 h-[calc(100vh-140px)]">
          {courseData.modules.map((module: Module, moduleIndex: number) => (
            <div key={module.id} className="space-y-1">
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <BookOpen size={18} className="text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">
                      {module.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {module.progress}% complete
                    </p>
                  </div>
                </div>
                {expandedModules.includes(moduleIndex) ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {expandedModules.includes(moduleIndex) && (
                <div className="space-y-1 ml-4">
                  {module.lessons.map((lesson: Lesson, lessonIndex: number) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(moduleIndex, lessonIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                        currentModule === moduleIndex &&
                        currentLesson === lessonIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 text-foreground"
                      }`}
                    >
                      {isLessonCompleted(lesson.id, completedLessons) ? (
                        <CheckCircle2
                          size={16}
                          className="flex-shrink-0 text-green-500"
                        />
                      ) : (
                        <Play size={16} className="flex-shrink-0" />
                      )}
                      <span className="flex-1 text-left truncate">
                        {lesson.title}
                      </span>
                      <span className="text-xs opacity-75">
                        {formatTime(lesson.duration)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar Navigation - Fixed Position with Dashboard Link */}
      <div className="hidden md:flex w-80 bg-white/90 backdrop-blur-md border-r border-border flex-col overflow-hidden fixed left-0 top-0 bottom-0 z-30">
        {/* Logo and Dashboard Header */}
        <div className="p-4 border-b border-border bg-white/95">
          <div className="mb-4">
            <AxioQuanLogo />
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition group"
          >
            <LayoutDashboard size={20} className="text-primary" />
            <span className="font-semibold text-foreground">
              Back to Dashboard
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Modules List */}
          {courseData.modules.map((module, moduleIndex) => (
            <div key={module.id} className="space-y-1">
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <BookOpen size={18} className="text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">
                      {module.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {module.progress}% complete
                    </p>
                  </div>
                </div>
                {expandedModules.includes(moduleIndex) ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {expandedModules.includes(moduleIndex) && (
                <div className="space-y-1 ml-4">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(moduleIndex, lessonIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                        currentModule === moduleIndex &&
                        currentLesson === lessonIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 text-foreground"
                      }`}
                    >
                      {isLessonCompleted(lesson.id, completedLessons) ? (
                        <CheckCircle2
                          size={16}
                          className="flex-shrink-0 text-green-500"
                        />
                      ) : (
                        <Play size={16} className="flex-shrink-0" />
                      )}
                      <span className="flex-1 text-left truncate">
                        {lesson.title}
                      </span>
                      <span className="text-xs opacity-75">
                        {formatTime(lesson.duration)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Course Menu Button for Mobile */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 active:scale-95 z-40 animate-bounce"
        style={{ animationDuration: "2s" }}
      >
        <Menu size={24} />
        <span className="sr-only">Open Course Menu</span>
      </button>
    </>
  );
}

