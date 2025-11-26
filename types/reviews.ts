
// /types/reviews.ts

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  rating: number; // 1-5 stars
  title?: string;
  content: string;
  // is_verified: boolean;
  is_edited: boolean;
  edited_at?: Date;
  like_count: number;
  dislike_count: number;
  helpful_count: number;
  reply_count: number;
  status: 'active' | 'flagged' | 'removed';
  created_at: Date;
  updated_at: Date;
  
  // Joined fields
  user_name?: string;
  user_image?: string;
  user_role?: string;
  
  // Reaction counts (from review_reactions table)
  reaction_counts?: {
    like?: number;
    dislike?: number;
    helpful?: number;
    love?: number;
    insightful?: number;
    funny?: number;
  };
  
  // Current user's reaction
  user_reaction?: string | null;
}

export interface ReviewReaction {
  id: string;
  review_id: string;
  user_id: string;
  reaction_type: 'like' | 'dislike' | 'helpful' | 'love' | 'insightful' | 'funny';
  created_at: Date;
  updated_at: Date;
}

export interface CreateReviewData {
  course_id: string;
  rating: number;
  title?: string;
  content: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  content?: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}