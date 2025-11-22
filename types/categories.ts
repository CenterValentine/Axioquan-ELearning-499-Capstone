
// /types/categories.ts

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  course_count: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}