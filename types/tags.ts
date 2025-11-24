
// /types/tags.ts

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  is_featured: boolean;
  is_trending: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTagData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  is_featured?: boolean;
}

export interface UpdateTagData {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_featured?: boolean;
  is_trending?: boolean;
}