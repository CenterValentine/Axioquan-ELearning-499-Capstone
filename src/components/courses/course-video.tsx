"use client";

import { useState } from "react";

import { CourseData } from "@/types/lesson";
import { Play, Expand } from "lucide-react";
import Link from "next/link";
import CourseProgress from "./course-progress";
import {
  getVideoType,
  getYouTubeEmbedUrl,
  getVimeoEmbedUrl,
  isDirectVideo,
} from "@/lib/utils/video-detection";

interface CourseVideoProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function CourseVideo({
  courseData,
  currentModule,
  currentLesson,
}: CourseVideoProps) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  const videoUrl =
    courseData.modules[currentModule].lessons[currentLesson].video_url ||
    "https://www.youtube.com/watch?v=W6mI2O078qg"; // rickroll
  
  const videoType = getVideoType(videoUrl);
  const isYouTubeVideo = videoType === "youtube";
  const isVimeoVideo = videoType === "vimeo";
  const isMP4Video = isDirectVideo(videoUrl);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const vimeoEmbedUrl = getVimeoEmbedUrl(videoUrl);

  if (isYouTubeVideo && youtubeEmbedUrl) {
    return (
      <>
        {/* Video Player Section - Full Width */}
        <div className="bg-white p-4 md:p-8 border-b border-border w-full">
          <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
            <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-video max-w-4xl md:min-w-[896px] mx-auto shadow-lg">
              <iframe
                className="w-full h-full"
                src={youtubeEmbedUrl}
                title="AxioQuan video player"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={true}
              ></iframe>
            </div>

            {/* Watch on Separate Page Link */}
            <div className="mt-4 text-center">
              <Link
                href={`/courses/watch/${courseData.id}/${courseData.modules[currentModule].lessons[currentLesson].id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
              >
                <Play size={16} />
                Watch on separate page
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else if (isVimeoVideo && vimeoEmbedUrl) {
    return (
      <>
        {/* Video Player Section - Full Width */}
        <div className="bg-white p-4 md:p-8 border-b border-border w-full">
          <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
            <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-video max-w-4xl md:min-w-[896px] mx-auto shadow-lg">
              <iframe
                className="w-full h-full"
                src={vimeoEmbedUrl}
                title="AxioQuan video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={true}
              ></iframe>
            </div>

            {/* Watch on Separate Page Link */}
            <div className="mt-4 text-center">
              <Link
                href={`/courses/watch/${courseData.id}/${courseData.modules[currentModule].lessons[currentLesson].id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
              >
                <Play size={16} />
                Watch on separate page
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else if (isMP4Video) {
    return (
      <>
        {/* Video Player Section - Full Width */}
        <div className="bg-white p-4 md:p-8 border-b border-border w-full">
          <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
            <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-video max-w-4xl md:min-w-[896px] mx-auto shadow-lg">
              <div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 cursor-pointer"
                onClick={() => setIsVideoExpanded(true)}
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur">
                    <Play size={32} className="text-white fill-white" />
                  </div>
                  <p className="text-white text-sm font-semibold">
                    Click to expand video
                  </p>
                </div>
              </div>

              {/* Expand Button */}
              <button
                onClick={() => setIsVideoExpanded(true)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition"
                title="Expand to full screen"
              >
                <Expand size={20} />
              </button>

              {/* Progress Bar
              <CourseProgress
                courseData={courseData}
                currentModule={currentModule}
                currentLesson={currentLesson}
              /> */}
            </div>

            {/* Watch on Separate Page Link */}
            <div className="mt-4 text-center">
              <Link
                href={`/courses/watch/${courseData.id}/${courseData.modules[currentModule].lessons[currentLesson].id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
              >
                <Play size={16} />
                Watch on separate page
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}
