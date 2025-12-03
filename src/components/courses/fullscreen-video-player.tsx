"use client";

import { useState } from "react";
import { Play, Pause, Volume2, Settings, Bookmark, X } from "lucide-react";
import { type Lesson as DbLesson } from "@/lib/db/queries/curriculum";
import { CourseData, Lesson as UILesson } from "@/types/lesson";
import { CourseProgressBar1 } from "./course-progress";

interface FullScreenVideoPlayerProps {
  lesson: DbLesson | UILesson;
  courseData?: CourseData;
  currentModule?: number;
  currentLesson?: number;
  onClose: () => void;
  watched?: number;
  onWatchedChange?: (watched: number) => void;
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
  watched = 0,
  onWatchedChange,
}: FullScreenVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [bookmarkedTimes, setBookmarkedTimes] = useState<number[]>([]);

  const handleBookmark = () => {
    if (!bookmarkedTimes.includes(Math.floor(currentTime))) {
      setBookmarkedTimes([...bookmarkedTimes, Math.floor(currentTime)]);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle both DbLesson and UILesson types
  const lessonDuration =
    "video_duration" in lesson
      ? lesson.video_duration || 0
      : "duration" in lesson
      ? lesson.duration
      : 0;

  const lessonWatched =
    watched !== undefined ? watched : "watched" in lesson ? lesson.watched : 0;

  const lessonData = {
    id: lesson.id,
    title: lesson.title,
    duration: lessonDuration,
    watched: lessonWatched,
    description: lesson.description || "",
  };

  const progressPercentage =
    lessonData.duration > 0
      ? (lessonData.watched / lessonData.duration) * 100
      : 0;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <AxioQuanLogo size="small" />
          <h2 className="text-lg font-semibold">{lessonData.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-gray-800 p-2 rounded"
        >
          <X size={24} />
        </button>
      </div>

      {/* Full Screen Video */}
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="w-full max-w-4xl aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition"
              >
                {isPlaying ? (
                  <Pause size={48} className="text-white" />
                ) : (
                  <Play size={48} className="text-white fill-white" />
                )}
              </button>
              <p className="text-white text-lg font-semibold">
                {lessonData.title}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {courseData &&
          currentModule !== undefined &&
          currentLesson !== undefined ? (
            <CourseProgressBar1
              courseData={courseData}
              currentModule={currentModule}
              currentLesson={currentLesson}
            />
          ) : (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-3">
                <div className="w-full bg-white/20 rounded-full h-1.5 cursor-pointer hover:h-2 transition-all">
                  <div
                    className="bg-blue-500 rounded-full h-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-white text-sm">
                  <span>{formatTime(lessonData.watched)}</span>
                  <span>{formatTime(lessonData.duration)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Video Controls */}
          <div className="absolute bottom-20 left-0 right-0 flex items-center justify-between px-4 text-white">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="hover:scale-110 transition"
            >
              {isPlaying ? (
                <Pause size={32} />
              ) : (
                <Play size={32} className="fill-white" />
              )}
            </button>
            <div className="flex items-center gap-4">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-white/20 px-3 py-1 rounded text-sm backdrop-blur hover:bg-white/30 transition text-white"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
              <button
                onClick={handleBookmark}
                className="hover:scale-110 transition"
                title="Bookmark"
              >
                <Bookmark size={24} />
              </button>
              <button className="hover:scale-110 transition">
                <Volume2 size={24} />
              </button>
              <button className="hover:scale-110 transition">
                <Settings size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
