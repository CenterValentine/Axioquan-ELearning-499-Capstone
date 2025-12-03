"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, Settings, Bookmark } from "lucide-react";
import { type Lesson as DbLesson } from "@/lib/db/queries/curriculum";
import { Lesson as UILesson } from "@/types/lesson";
import {
  getVideoMimeType,
  getVideoType,
  getVimeoEmbedUrl,
  getYouTubeEmbedUrl,
  isDirectVideo,
} from "@/lib/utils/video-detection";

type AnyLesson = DbLesson | UILesson;

interface CoreVideoPlayerProps {
  lesson: AnyLesson;
  /** Optional explicit course/lesson IDs to enable watched-time persistence */
  courseId?: string;
  lessonId?: string;
  /** Optional CSS for the outer wrapper */
  className?: string;
  /** Notify parent when watched time changes */
  onWatchedChange?: (watchedSeconds: number) => void;
}

/**
 * Core video player that encapsulates:
 * - URL/source detection (YouTube, Vimeo, MP4/Cloudinary)
 * - HTML5 playback (MP4/Cloudinary/direct)
 * - Progress bar/timeline UI
 * - Watched-time tracking & resume from last position (when courseId/lessonId provided)
 *
 * This is the single source of truth for video playback logic and should be
 * used by higher-level shells like `video-player.tsx` and `fullscreen-video-player.tsx`.
 */
export function CoreVideoPlayer({
  lesson,
  courseId,
  lessonId: explicitLessonId,
  className,
  onWatchedChange,
}: CoreVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Prefer explicit lessonId, else fall back to lesson.id
  const resolvedLessonId = explicitLessonId || lesson.id;

  // Get video URL from lesson (handle both DbLesson and UILesson types)
  const videoUrl =
    "video_url" in lesson
      ? (lesson as DbLesson).video_url
      : (lesson as UILesson).video_url || null;

  const videoType = getVideoType(videoUrl);
  const isDirect = isDirectVideo(videoUrl);
  const youtubeEmbedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const vimeoEmbedUrl = videoUrl ? getVimeoEmbedUrl(videoUrl) : null;

  // Load watched time from progress on mount if courseId is provided
  useEffect(() => {
    if (!courseId || !resolvedLessonId) return;

    async function loadProgress() {
      try {
        const response = await fetch(
          `/api/courses/${courseId}/lessons/${resolvedLessonId}/progress`
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
  }, [courseId, resolvedLessonId, onWatchedChange]);

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

  // Update watched time every 5 seconds if we have course/lesson IDs
  useEffect(() => {
    if (!isPlaying || currentTime <= 0 || !courseId || !resolvedLessonId) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        await fetch(
          `/api/courses/${courseId}/lessons/${resolvedLessonId}/progress`,
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
  }, [isPlaying, currentTime, courseId, resolvedLessonId, onWatchedChange]);

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
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setDuration(video.duration);
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

  // Handle both DbLesson and UILesson types
  const lessonDuration =
    duration ||
    ("video_duration" in lesson
      ? (lesson as DbLesson).video_duration || 0
      : "duration" in lesson
      ? (lesson as UILesson).duration
      : 0);

  const lessonWatched = currentTime || watched;

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
    <div className={className ?? "w-full h-full relative"}>
      {videoType === "youtube" && youtubeEmbedUrl ? (
        <iframe
          className="w-full h-full"
          src={youtubeEmbedUrl}
          title={lessonData.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : videoType === "vimeo" && vimeoEmbedUrl ? (
        <iframe
          className="w-full h-full"
          src={vimeoEmbedUrl}
          title={lessonData.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : isDirect && videoUrl ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full"
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
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={handlePlayPause}
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition">
                  <Play size={32} className="text-white fill-white" />
                </div>
                <p className="text-white text-lg font-semibold">
                  {lessonData.title}
                </p>
              </div>
            </div>
          )}

          {/* Video Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={handlePlayPause}
              className="hover:scale-110 transition"
            >
              {isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} className="fill-white" />
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
                <Bookmark size={20} />
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:scale-110 transition"
                title={isMuted ? "Unmute" : "Mute"}
              >
                <Volume2 size={20} />
              </button>
              <button className="hover:scale-110 transition">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 cursor-pointer"
            onClick={handleSeek}
          >
            <div className="space-y-2">
              <div className="w-full bg-white/20 rounded-full h-2 hover:h-2.5 transition-all">
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
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="text-center space-y-4 text-white">
            <p className="text-lg font-semibold">Video not available</p>
            <p className="text-sm text-gray-300">
              {videoUrl
                ? "Unable to load video. Please check the URL."
                : "No video URL provided."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

