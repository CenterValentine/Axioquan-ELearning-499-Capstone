
// /types/courses.ts

export interface CourseTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  is_featured: boolean;
  is_trending: boolean;
  usage_count: number;
}

export interface Course {
  id: string;
  slug: string;
  instructor_id: string;
  category_id?: string;
  
  // Core course information
  title: string;
  subtitle?: string;
  description_html?: string;
  short_description?: string;
  learning_objectives?: string[];
  prerequisites?: string[];
  target_audience?: string[];
  welcome_message?: string;
  congratulations_message?: string;
  
  // Enhanced metadata
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  language: string;
  subtitle_languages?: string[];
  level: string;
  content_type: string;
  
  // Rich media support
  thumbnail_url?: string;
  promo_video_url?: string;
  materials_url?: string; // ✅ FIX — add this line
  video_preview_url?: string;
  image_gallery?: string[];
  trailer_duration: number;
  
  // Pricing & monetization
  price_cents: number;
  currency: string;
  discount_percent: number;
  discount_expires_at?: Date;
  original_price_cents: number;
  has_free_trial: boolean;
  trial_duration_days: number;
  
  // Course settings & flags
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  certificate_available: boolean;
  has_lifetime_access: boolean;
  allow_downloads: boolean;
  has_captions: boolean;
  has_transcripts: boolean;
  
  // Access controls
  start_date?: Date;
  end_date?: Date;
  enrollment_capacity?: number;
  requires_approval: boolean;
  approval_message?: string;
  access_type: string;
  
  // Content metrics
  total_video_duration: number;
  total_lessons: number;
  total_quizzes: number;
  total_assignments: number;
  total_downloads: number;
  total_articles: number;
  
  // Performance statistics
  enrolled_students_count: number;
  active_students_count: number;
  completed_students_count: number;
  average_rating: number;
  review_count: number;
  total_views: number;
  completion_rate: number;
  engagement_score: number;
  
  // SEO & discoverability
  meta_title?: string;
  meta_description?: string;
  search_keywords?: string[];
  
  // Timestamps
  published_at?: Date;
  featured_at?: Date;
  trending_at?: Date;
  created_at: Date;
  updated_at: Date;
  
  // Joined fields
  instructor_name?: string;
  instructor_email?: string;
  instructor_image?: string | null;
  category_name?: string;
  category_slug?: string;
  tags?: CourseTag[];
}

export interface CreateCourseData {
  title: string;
  subtitle?: string;
  description_html?: string;
  short_description?: string;
  learning_objectives?: string[];
  prerequisites?: string[];
  target_audience?: string[];
  category_id?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  language?: string;
  content_type?: string;
  thumbnail_url?: string;
  promo_video_url?: string;
  materials_url?: string;  // <-- ADD this line
  total_video_duration?: number;
  price_cents?: number;
  certificate_available?: boolean;
  has_lifetime_access?: boolean;
  allow_downloads?: boolean;
  access_type?: string;
  tag_ids?: string[];
}

export interface UpdateCourseData {
  title?: string;
  subtitle?: string;
  description_html?: string;
  short_description?: string;
  learning_objectives?: string[];
  prerequisites?: string[];
  target_audience?: string[];
  category_id?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  language?: string;
  content_type?: string;
  thumbnail_url?: string;
  promo_video_url?: string;
  materials_url?: string; // ADD THIS LINE
  total_video_duration?: number;
  price_cents?: number;
  certificate_available?: boolean;
  has_lifetime_access?: boolean;
  allow_downloads?: boolean;
  access_type?: string;
  tag_ids?: string[];
  is_published?: boolean;
}