"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, Settings, Bookmark } from "lucide-react";
import { type Lesson as DbLesson } from "@/lib/db/queries/curriculum";
import { Lesson as UILesson } from "@/types/lesson";
import { getVideoMimeType } from "@/lib/utils/video-detection";
import { CourseData } from "@/types/lesson";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface MP4VideoPlayerProps {
  videoUrl: string;
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
  lesson: DbLesson | UILesson;
  /** Optional CSS for the outer wrapper */
  className?: string;
  /** Notify parent when watched time changes */
  onWatchedChange?: (watchedSeconds: number) => void;
}

/**
 * MP4 Video Player Component
 *
 * Handles all MP4/direct video playback with:
 * - Video controls (play/pause, volume, playback speed, bookmarks)
 * - Progress tracking and resume from last position
 * - Loading and error states
 * - Video overlays and UI
 */
export function MP4VideoPlayer({
  videoUrl,
  courseData,
  currentModule,
  currentLesson,
  lesson,
  className,
  onWatchedChange,
}: MP4VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressDotRef = useRef<HTMLDivElement>(null);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [bookmarkedTimes, setBookmarkedTimes] = useState<number[]>([]);
  const [watched, setWatched] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Resolve the actual lesson ID from the lesson index
  const resolvedLessonId =
    courseData.modules[currentModule]?.lessons[currentLesson]?.id;

  // Load watched time from progress on mount
  useEffect(() => {
    if (!courseData.id || !resolvedLessonId) return;

    async function loadProgress() {
      try {
        const response = await fetch(
          `/api/courses/${courseData.id}/lessons/${resolvedLessonId}/progress`
        );
        if (response.ok) {
          const data = await response.json();
          if (typeof data.watched === "number" && data.watched > 0) {
            setWatched(data.watched);
            onWatchedChange?.(data.watched);
          }
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
    loadProgress();
  }, [courseData.id, resolvedLessonId, onWatchedChange]);

  // Handle videoUrl changes - reload video when URL changes
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl) {
      // Reset states when video URL changes
      setIsLoading(true);
      setHasError(false);
      setCurrentTime(0);
      setIsPlaying(false);

      // Reload the video source
      video.load();
    }
  }, [videoUrl]);

  // Resume from last watched position when video loads
  useEffect(() => {
    const video = videoRef.current;
    if (video && watched > 0 && duration > 0) {
      video.currentTime = watched;
    }
  }, [watched, duration]);

  // Update playback speed when changed
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Update volume when changed
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Update watched time every 5 seconds if playing
  useEffect(() => {
    if (!isPlaying || currentTime <= 0 || !courseData.id || !resolvedLessonId) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        await fetch(
          `/api/courses/${courseData.id}/lessons/${resolvedLessonId}/progress`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ watchedSeconds: Math.floor(currentTime) }),
          }
        );
        setWatched(currentTime);
        onWatchedChange?.(currentTime);
      } catch (error) {
        console.error("Error updating watched time:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    isPlaying,
    currentTime,
    courseData.id,
    resolvedLessonId,
    onWatchedChange,
  ]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const newTime = video.currentTime;
      const newDuration = video.duration;

      // Update duration state if it changed
      if (newDuration && newDuration !== duration) {
        setDuration(newDuration);
      }

      // Update currentTime state (throttled for other components)
      setCurrentTime(newTime);

      // Directly update progress bar and dot for smoother visual updates
      if (newDuration > 0) {
        const percentage = (newTime / newDuration) * 100;
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${percentage}%`;
        }
        if (progressDotRef.current) {
          progressDotRef.current.style.left = `${percentage}%`;
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      setIsLoading(false);
      // Resume from last watched position
      if (watched > 0) {
        video.currentTime = watched;
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleBookmark = () => {
    if (!bookmarkedTimes.includes(Math.floor(currentTime))) {
      setBookmarkedTimes([...bookmarkedTimes, Math.floor(currentTime)]);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`${className ?? "w-full h-full relative"} group`}
      onClick={handlePlayPause}
    >
      <video
        key={videoUrl}
        ref={videoRef}
        className="w-full h-full"
        controls={false}
        playsInline
        poster={
          "video_thumbnail" in lesson
            ? (lesson as DbLesson).video_thumbnail || undefined
            : undefined
        }
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
      >
        <source src={videoUrl} type={getVideoMimeType(videoUrl)} />
        Your browser does not support the video tag.
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white">Loading video...</div>
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <p className="text-lg font-semibold mb-2">Error loading video</p>
            <p className="text-sm text-gray-300">
              Please check your connection and try again.
            </p>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay (when not playing) */}
      {!isPlaying && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer pointer-events-none">
          <div className="text-center space-y-4 pointer-events-none">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition">
              <Play size={32} className="text-white fill-white" />
            </div>
            <p className="text-white text-lg font-semibold">{lesson.title}</p>
          </div>
        </div>
      )}

      {/* Video Controls Bar - Show on Hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
        {/* Seekable Progress Bar */}
        <div
          className="px-4 pt-3 pb-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleSeek(e);
          }}
        >
          <div className="h-1.5 bg-white/30 rounded-full relative">
            <div
              ref={progressBarRef}
              className="h-full bg-blue-500 rounded-full relative"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                transition: "width 0.1s linear",
              }}
            />
            {/* Dot positioned at the current progress - perfectly centered on the line */}
            <div
              ref={progressDotRef}
              className="absolute h-3 w-3 bg-blue-500 rounded-full shadow-lg border-2 border-white"
              style={{
                top: "50%",
                left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                transform: "translate(-50%, -50%)",
                transition: "left 0.1s linear",
              }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="px-4 pb-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-9 w-9"
            >
              {isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} className="fill-white" />
              )}
            </Button>
            <div className="text-xs font-mono text-white/90">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={playbackSpeed.toString()}
              onValueChange={(value) => setPlaybackSpeed(Number(value))}
            >
              <SelectTrigger
                className="bg-white/20 text-white border-white/20 hover:bg-white/30 backdrop-blur h-8 text-xs w-16"
                onClick={(e) => e.stopPropagation()}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              title="Bookmark"
            >
              <Bookmark size={16} />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              title={isMuted ? "Unmute" : "Mute"}
            >
              <Volume2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
