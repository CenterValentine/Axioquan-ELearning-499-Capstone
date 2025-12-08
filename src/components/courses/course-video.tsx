"use client";

import { useState } from "react";
import { CourseData, Lesson } from "@/types/lesson";
import {
  getVideoType,
  findNearestVideoLesson,
} from "@/lib/utils/video-detection";
import { YouTubeVideoPlayer } from "../curriculum/video/youtube-video-player";
import { VimeoVideoPlayer } from "../curriculum/video/vimeo-video-player";
import { MP4VideoPlayer } from "../curriculum/video/mp4-video-player";
import { LessonDebugPanel } from "../curriculum/debug/lesson-debug-panel";

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
  // Safety check: ensure courseData exists
  if (!courseData || !courseData.modules || courseData.modules.length === 0) {
    return null;
  }

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

  // Find the lesson index in the current module
  const lessonIndex = courseData.modules[currentModule]?.lessons.findIndex(
    (lesson) => lesson.id === lessonId
  );

  // If lesson not found in current module, try to find it in any module
  let foundModuleIndex = currentModule;
  let foundLessonIndex = lessonIndex;

  if (foundLessonIndex === -1) {
    for (let i = 0; i < courseData.modules.length; i++) {
      const index = courseData.modules[i].lessons.findIndex(
        (lesson) => lesson.id === lessonId
      );
      if (index !== -1) {
        foundModuleIndex = i;
        foundLessonIndex = index;
        break;
      }
    }
  }

  // Get the lesson object
  const lesson =
    foundLessonIndex !== -1
      ? courseData.modules[foundModuleIndex].lessons[foundLessonIndex]
      : videoLesson;

  switch (videoType) {
    case "youtube":
      return (
        <>
          <YouTubeVideoPlayer
            videoUrl={videoUrl}
            courseId={courseData.id}
            lessonId={lessonId}
          />
          <div className="bg-white px-4 md:px-8 pb-6 md:pb-8">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
              <LessonDebugPanel
                data={lesson}
                courseData={courseData}
                title="Course Data"
              />
            </div>
          </div>
        </>
      );
    case "vimeo":
      return (
        <>
          <VimeoVideoPlayer
            videoUrl={videoUrl}
            courseId={courseData.id}
            lessonId={lessonId}
          />
          <div className="bg-white px-4 md:px-8 pb-6 md:pb-8">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
              <LessonDebugPanel
                data={lesson}
                courseData={courseData}
                title="Course Data"
              />
            </div>
          </div>
        </>
      );
    case "mp4":
    case "cloudinary":
      // Only render if we found valid indices
      if (foundLessonIndex === -1) {
        return null;
      }
      return (
        <>
          {/* Video Player Section - Full Width */}
          <div className="bg-white p-2 md:p-4 lg:p-8 border-b border-border w-full">
            <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6">
              <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-video max-w-4xl mx-auto shadow-lg">
                <MP4VideoPlayer
                  videoUrl={videoUrl}
                  courseData={courseData}
                  currentModule={foundModuleIndex}
                  currentLesson={foundLessonIndex}
                  lesson={lesson}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
          <div className="bg-white px-4 md:px-8 pb-6 md:pb-8">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
              <LessonDebugPanel
                data={lesson}
                courseData={courseData}
                title="Course Data"
              />
            </div>
          </div>
        </>
      );
    default:
      return null;
  }
}
