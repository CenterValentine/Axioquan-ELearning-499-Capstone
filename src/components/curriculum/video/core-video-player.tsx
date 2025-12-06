"use client";

import React from "react";
import { type Lesson as DbLesson } from "@/lib/db/queries/curriculum";
import { Lesson as UILesson } from "@/types/lesson";
import {
  getVideoType,
  getVimeoEmbedUrl,
  getYouTubeEmbedUrl,
  isDirectVideo,
} from "@/lib/utils/video-detection";
import { CourseData } from "@/types/lesson";
import { YouTubeIframe } from "./youtube-iframe";
import { VimeoIframe } from "./vimeo-iframe";
import { MP4VideoPlayer } from "./mp4-video-player";
import { LessonDebugPanel } from "../debug/lesson-debug-panel";

interface CoreVideoPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
  /** Optional CSS for the outer wrapper */
  className?: string;
  /** Notify parent when watched time changes */
  onWatchedChange?: (watchedSeconds: number) => void;
}

/**
 * Core video player that encapsulates:
 * - URL/source detection (YouTube, Vimeo, MP4/Cloudinary)
 * - Delegates to appropriate player component based on video type
 * - Watched-time tracking & resume from last position (when courseId/lessonId provided)
 *
 * This is the single source of truth for video type detection and routing.
 * It delegates actual playback to specialized components:
 * - YouTubeIframe for YouTube videos
 * - VimeoIframe for Vimeo videos
 * - MP4VideoPlayer for direct MP4/Cloudinary videos
 *
 * Used by higher-level shells like `video-player.tsx` and `fullscreen-video-player.tsx`.
 */
export function CoreVideoPlayer({
  courseData,
  currentModule, //module id
  currentLesson, //lesson id
  className,
  onWatchedChange,
}: CoreVideoPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];

  // Get video URL from lesson (handle both DbLesson and UILesson types)
  const videoUrl =
    "video_url" in lesson
      ? (lesson as DbLesson).video_url
      : (lesson as UILesson).video_url || null;

  const videoType = getVideoType(videoUrl);
  const isDirect = isDirectVideo(videoUrl);
  const youtubeEmbedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const vimeoEmbedUrl = videoUrl ? getVimeoEmbedUrl(videoUrl) : null;

  const lessonTitle = lesson.title;

  // Get lesson ID for key prop to ensure proper remounting when lesson changes
  const lessonId = lesson.id;

  return (
    <>
      <div className={className ?? "w-full h-full relative"}>
        {videoType === "youtube" && youtubeEmbedUrl ? (
          <YouTubeIframe
            key={lessonId}
            embedUrl={youtubeEmbedUrl}
            title={lessonTitle}
          />
        ) : videoType === "vimeo" && vimeoEmbedUrl ? (
          <VimeoIframe
            key={lessonId}
            embedUrl={vimeoEmbedUrl}
            title={lessonTitle}
          />
        ) : isDirect && videoUrl ? (
          <MP4VideoPlayer
            key={lessonId}
            videoUrl={videoUrl}
            courseData={courseData}
            currentModule={currentModule}
            currentLesson={currentLesson}
            lesson={lesson} // this may not be needed because the lesson is already passed in the courseData object
            onWatchedChange={onWatchedChange}
          />
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
      <LessonDebugPanel
        data={lesson}
        courseData={courseData}
        title="Course Data"
      />
    </>
  );
}
