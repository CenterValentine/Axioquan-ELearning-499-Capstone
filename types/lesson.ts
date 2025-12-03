// UI-specific types for CourseLearningPage component
export interface Lesson {
  // UI-specific fields for CourseLearningPage sidebar/list view
  id: string;
  title: string;
  duration: number; // Mapped from video_duration for backward compatibility
  watched: number;
  type: "video" | "pdf" | "document"; // Simplified type for UI
  completed: boolean;
  bookmarks?: number[];

  // Core lesson metadata (matching DB Lesson type)
  module_id: string;
  course_id: string;
  slug: string;
  description: string | null;
  lesson_type:
    | "video"
    | "text"
    | "document"
    | "quiz"
    | "assignment"
    | "live_session"
    | "audio"
    | "interactive"
    | "code"
    | "discussion";
  content_type: "free" | "premium" | "trial";
  difficulty: string;

  // Video-specific fields
  video_url: string | null;
  video_thumbnail: string | null;
  video_duration: number;
  video_quality: any;

  // Audio-specific fields
  audio_url: string | null;
  audio_duration: number;

  // Document-specific fields
  document_url: string | null;
  document_type: string | null;
  document_size: number;

  // Content fields
  content_html: string | null;
  interactive_content: any;
  code_environment: any;

  // Feature flags
  is_preview: boolean;
  has_transcript: boolean;
  has_captions: boolean;
  has_interactive_exercises: boolean;
  has_downloadable_resources: boolean;
  requires_completion: boolean;
  requires_passing_grade: boolean;
  allow_comments: boolean;

  // Resources and files
  downloadable_resources: string[];
  attached_files: string[];
  external_links: any;
  recommended_readings: string[];

  // Metadata
  order_index: number;
  is_published: boolean;
  estimated_prep_time: number;
  completion_criteria: any;
  passing_score: number;

  // Statistics
  view_count: number;
  average_completion_time: number;
  completion_rate: number;
  engagement_score: number;

  // Timestamps
  created_at: Date | string;
  updated_at: Date | string;

  // Optional transcripts
  transcripts?: LessonTranscript[];
}

export interface LessonTranscript {
  id: string;
  lesson_id: string;
  language: string;
  content: string;
  word_count: number;
  is_auto_generated: boolean;
  confidence_score: number;
  created_at: Date | string;
  updated_at: Date | string;
}

//   UI Module type for CourseLearningPage component
export interface Module {
  id: string;
  title: string;
  progress: number;
  lessons: Lesson[];
  // Duration fields (all in seconds for consistency)
  duration?: number; // total duration in seconds (calculated from lessons)
  estimated_duration?: number; // manual estimate in minutes (from DB)
  video_duration?: number; // total video duration in seconds (calculated)
  audio_duration?: number; // total audio duration in seconds (calculated)
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  modules: Module[];
}
