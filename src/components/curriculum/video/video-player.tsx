//  /components/courses/video/video-player.tsx

"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CourseData } from "@/types/lesson";
import { CoreVideoPlayer } from "./core-video-player";

interface VideoPlayerPageProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
  courseTitle?: string;
  courseDescription?: string;
}

export default function VideoPlayerPage({
  courseData,
  currentModule,
  currentLesson,
  courseTitle,
  courseDescription,
}: VideoPlayerPageProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link
            href={`/courses/learn/${courseData.id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft size={20} />
            Back to Course
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-sm text-gray-600">{lesson.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden relative">
          <CoreVideoPlayer
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
          />
        </div>
      </div>
    </div>
  );
}
