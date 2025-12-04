"use client";

import { useState } from "react";
import { CourseData, Lesson } from "@/types/lesson";
import { getVideoType, findNearestVideoLesson } from "@/lib/utils/video-detection";
import { YouTubeVideoPlayer } from "../curriculum/video/youtube-video-player";
import { VimeoVideoPlayer } from "../curriculum/video/vimeo-video-player";
import { MP4VideoPlayer } from "../curriculum/video/mp4-video-player";

interface CourseVideoProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: string; // lesson id
  currentModuleLessons: Lesson[];
  onExpand?: () => void;
}

export function CourseVideo({
  courseData,
  currentModule,
  currentLesson,
  currentModuleLessons,
  onExpand,
}: CourseVideoProps) {
  // Manage playback speed for video player
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoLesson = findNearestVideoLesson(
    currentModuleLessons,
    currentLesson
  );

  if (!videoLesson || !videoLesson.video_url) {
    return null;
  }

  const videoUrl = videoLesson.video_url;
  const videoType = getVideoType(videoUrl);
  const lessonId = videoLesson.id;

  switch (videoType) {
    case "youtube":
      return (
        <YouTubeVideoPlayer
          videoUrl={videoUrl}
          courseId={courseData.id}
          lessonId={lessonId}
        />
      );
    case "vimeo":
      return (
        <VimeoVideoPlayer
          videoUrl={videoUrl}
          courseId={courseData.id}
          lessonId={lessonId}
        />
      );
    case "mp4":
    case "cloudinary":
      return (
        <MP4VideoPlayer
          videoUrl={videoUrl}
          courseId={courseData.id}
          lessonId={lessonId}
          onExpand={onExpand}
        />
      );
    default:
      return null;
  }
}
