"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { getYouTubeEmbedUrl } from "@/lib/utils/video-detection";

interface YouTubeVideoPlayerProps {
  videoUrl: string;
  courseId: string;
  lessonId: string;
}

export function YouTubeVideoPlayer({
  videoUrl,
  courseId,
  lessonId,
}: YouTubeVideoPlayerProps) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!youtubeEmbedUrl) {
    return null;
  }

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
              href={`/courses/watch/${courseId}/${lessonId}`}
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

