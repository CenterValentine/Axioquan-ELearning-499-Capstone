export interface CourseOverview {
  id: string;                 // course.id
  slug: string;               // course.slug
  title: string;              // course.title
  subtitle?: string;          // course.subtitle
  description: string;        // plain text OR sanitized HTML
  difficulty: string;         // course.difficulty_level
  category: string;           // categories.name
  categorySlug: string;       // categories.slug
  thumbnailUrl?: string;      // course.thumbnail_url
  duration?: string;          // computed or static mock
  progress: number;           // computed % from user_progress
  status: 'in-progress' | 'completed'; // enrollment.completed_at
  completedDate?: string;     // enrollment.completed_at formatted
}