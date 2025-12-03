 "use client";

import { X } from "lucide-react";
import { type Lesson as DbLesson } from "@/lib/db/queries/curriculum";
import { CourseData, Lesson as UILesson } from "@/types/lesson";
import { CourseProgressBar1 } from "./course-progress";
import { CoreVideoPlayer } from "./core-video-player";

interface FullScreenVideoPlayerProps {
  lesson: DbLesson | UILesson;
  courseData?: CourseData;
  currentModule?: number;
  currentLesson?: number;
  onClose: () => void;
  courseId?: string;
}

// AxioQuan Logo Component
const AxioQuanLogo = ({ size = "default" }: { size?: "default" | "small" }) => (
  <div
    className={`flex items-center gap-3 ${size === "small" ? "px-2" : "px-4"}`}
  >
    <div className="flex items-center justify-center bg-black rounded-lg p-3 w-8 h-8">
      <span className="text-white font-bold text-xl">A</span>
    </div>
    {size === "default" && (
      <span className="font-bold text-xl text-foreground">AxioQuan</span>
    )}
  </div>
);

export function FullScreenVideoPlayer({
  lesson,
  courseData,
  currentModule,
  currentLesson,
  onClose,
  courseId,
}: FullScreenVideoPlayerProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <AxioQuanLogo size="small" />
          <h2 className="text-lg font-semibold">{lesson.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-gray-800 p-2 rounded"
        >
          <X size={24} />
        </button>
      </div>

      {/* Full Screen Video */}
      <div className="flex-1 bg-black flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden relative">
          <CoreVideoPlayer
            lesson={lesson}
            courseId={courseId}
            // full-screen usage is always for the current lesson
            lessonId={lesson.id}
            className="w-full h-full relative"
          />
        </div>

        {courseData &&
          typeof currentModule === "number" &&
          typeof currentLesson === "number" && (
            <div className="w-full max-w-4xl mt-4 px-4">
              <CourseProgressBar1
                courseData={courseData}
                currentModule={currentModule}
                currentLesson={currentLesson}
              />
            </div>
          )}
      </div>
    </div>
  );
}
