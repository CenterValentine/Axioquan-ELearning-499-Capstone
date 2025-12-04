// /lib/utils/duration.ts

import { Lesson } from '@/types/lesson';

/**
 * Calculate total duration of lessons in a module
 * Returns duration in seconds
 */
export function calculateModuleDuration(lessons: Lesson[]): {
  total: number;  // seconds
  video: number;  // seconds
  audio: number;  // seconds
} {
  return lessons.reduce(
    (acc, lesson) => {
      const video = lesson.video_duration || 0;
      const audio = lesson.audio_duration || 0;
      return {
        total: acc.total + video + audio,
        video: acc.video + video,
        audio: acc.audio + audio,
      };
    },
    { total: 0, video: 0, audio: 0 }
  );
}

/**
 * Format duration in seconds to human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "1h 30m", "45m", "30s")
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 && hours === 0) parts.push(`${secs}s`);
  
  return parts.join(' ') || '0s';
}

/**
 * Format duration in seconds to minutes string
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "90 min")
 */
export function formatDurationMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

/**
 * Convert seconds to minutes (for display)
 */
export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

/**
 * Convert minutes to seconds
 */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

