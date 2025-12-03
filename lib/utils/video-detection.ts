// /lib/utils/video-detection.ts

import { Lesson } from "@/types/lesson";

/**
 * Detect the type of video source from a URL
 */
export function getVideoType(
  videoUrl: string | null | undefined
): "youtube" | "vimeo" | "mp4" | "cloudinary" | "unknown" {
  if (!videoUrl) return "unknown";

  const url = videoUrl.toLowerCase().trim();

  // YouTube detection
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }

  // Vimeo detection
  if (url.includes("vimeo.com")) {
    return "vimeo";
  }

  // Cloudinary detection (video resource)
  if (url.includes("cloudinary.com")) {
    // Check if it's a video resource type
    if (
      url.includes("/video/upload/") ||
      url.includes("/video/") ||
      url.match(/\.(mp4|mov|webm|avi|mkv|flv|wmv)$/i)
    ) {
      return "cloudinary";
    }
    // Cloudinary images can also be videos, but we'll treat them as cloudinary
    return "cloudinary";
  }

  // Direct video file detection (MP4, MOV, WEBM, etc.)
  if (url.match(/\.(mp4|mov|webm|avi|mkv|flv|wmv|m4v)$/i)) {
    return "mp4";
  }

  // If URL doesn't match any pattern but is a valid URL, assume it might be a direct video
  // This handles cases like CDN URLs without file extensions
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Could be a direct video URL without extension
    // We'll treat it as MP4 for now, but the video element will handle errors
    return "mp4";
  }

  return "unknown";
}

/**
 * Check if a video URL is an MP4 or direct video file
 */
export function isDirectVideo(
  videoUrl: string | null | undefined
): boolean {
  const type = getVideoType(videoUrl);
  return type === "mp4" || type === "cloudinary";
}

/**
 * Check if a video URL is a YouTube video
 */
export function isYouTubeVideo(
  videoUrl: string | null | undefined
): boolean {
  return getVideoType(videoUrl) === "youtube";
}

/**
 * Check if a video URL is a Vimeo video
 */
export function isVimeoVideo(videoUrl: string | null | undefined): boolean {
  return getVideoType(videoUrl) === "vimeo";
}

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Convert YouTube URL to embed URL
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

/**
 * Extract Vimeo video ID from URL
 */
export function getVimeoVideoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Convert Vimeo URL to embed URL
 */
export function getVimeoEmbedUrl(url: string): string | null {
  const videoId = getVimeoVideoId(url);
  if (!videoId) return null;

  return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
}

/**
 * Get video MIME type from URL or extension
 */
export function getVideoMimeType(videoUrl: string | null): string {
  if (!videoUrl) return "video/mp4";

  const url = videoUrl.toLowerCase();
  
  if (url.includes(".webm")) return "video/webm";
  if (url.includes(".mov")) return "video/quicktime";
  if (url.includes(".avi")) return "video/x-msvideo";
  if (url.includes(".mkv")) return "video/x-matroska";
  if (url.includes(".m4v")) return "video/x-m4v";
  
  // Default to MP4
  return "video/mp4";
}

/**
 * Find the most recent video lesson at or before the current lesson.
 * If currentLessonId is not found, we start from the last lesson in the module.
 */
export function findNearestVideoLesson(
  lessons: Lesson[],
  currentLessonId: string
): Lesson | null {
  if (!lessons.length) return null;

  // Where is the "current" lesson in this module?
  const currentIndex = lessons.findIndex((lesson) => lesson.id === currentLessonId);

  // If not found, assume "current" is the last lesson in the module
  const startIndex = currentIndex === -1 ? lessons.length - 1 : currentIndex;

  // Walk backwards until we find a video lesson that has a non-null video_url
  for (let i = startIndex; i >= 0; i--) {
    const lesson = lessons[i];
    if (lesson.lesson_type === "video" && lesson.video_url) {
      return lesson;
    }
  }

  return null;
}