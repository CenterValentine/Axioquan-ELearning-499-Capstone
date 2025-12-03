"use client";

import { useState } from "react";
import { Play, Expand } from "lucide-react";
import Link from "next/link";

interface MP4VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  lessonId: string;
  onExpand?: () => void;
}

export function MP4VideoPlayer({
  videoUrl,
  courseId,
  lessonId,
  onExpand,
}: MP4VideoPlayerProps) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  const handleExpand = () => {
    setIsVideoExpanded(true);
    onExpand?.();
  };

  return (
    <>
      {/* Video Player Section - Full Width */}
      <div className="bg-white p-4 md:p-8 border-b border-border w-full">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
          <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-video max-w-4xl md:min-w-[896px] mx-auto shadow-lg">
            <div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 cursor-pointer"
              onClick={handleExpand}
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
              onClick={handleExpand}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition"
              title="Expand to full screen"
            >
              <Expand size={20} />
            </button>
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

