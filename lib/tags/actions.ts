
// /lib/tags/actions.ts

'use server';

import { 
  getAllTags, 
  getTagById, 
  getTagBySlug, 
  createTag, 
  updateTag, 
  deleteTag,
  getTrendingTags,
  searchTags,
  type CreateTagData,
  type UpdateTagData 
} from '@/lib/db/queries/tags';
import { requireRole } from '@/lib/auth/utils';

/**
 * Get all tags (public)
 */
export async function getTagsAction(options?: {
  featured?: boolean;
  trending?: boolean;
  limit?: number;
}): Promise<{
  success: boolean;
  tags?: any[];
  errors?: string[];
}> {
  try {
    const tags = await getAllTags(options);
    
    return {
      success: true,
      tags
    };
  } catch (error: any) {
    console.error('❌ Error fetching tags:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get tag by ID (public)
 */
export async function getTagByIdAction(id: string): Promise<{
  success: boolean;
  tag?: any;
  errors?: string[];
}> {
  try {
    const tag = await getTagById(id);
    
    if (!tag) {
      return {
        success: false,
        errors: ['Tag not found']
      };
    }

    return {
      success: true,
      tag
    };
  } catch (error: any) {
    console.error('❌ Error fetching tag:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get tag by slug (public)
 */
export async function getTagBySlugAction(slug: string): Promise<{
  success: boolean;
  tag?: any;
  errors?: string[];
}> {
  try {
    const tag = await getTagBySlug(slug);
    
    if (!tag) {
      return {
        success: false,
        errors: ['Tag not found']
      };
    }

    return {
      success: true,
      tag
    };
  } catch (error: any) {
    console.error('❌ Error fetching tag:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Create tag (admin only)
 */
export async function createTagAction(tagData: CreateTagData): Promise<{
  success: boolean;
  message: string;
  tag?: any;
  errors?: string[];
}> {
  try {
    await requireRole('admin');
    
    return await createTag(tagData);
  } catch (error: any) {
    console.error('❌ Error creating tag:', error);
    return {
      success: false,
      message: 'Failed to create tag',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Update tag (admin only)
 */
export async function updateTagAction(id: string, tagData: UpdateTagData): Promise<{
  success: boolean;
  message: string;
  tag?: any;
  errors?: string[];
}> {
  try {
    await requireRole('admin');
    
    return await updateTag(id, tagData);
  } catch (error: any) {
    console.error('❌ Error updating tag:', error);
    return {
      success: false,
      message: 'Failed to update tag',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Delete tag (admin only)
 */
export async function deleteTagAction(id: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    await requireRole('admin');
    
    return await deleteTag(id);
  } catch (error: any) {
    console.error('❌ Error deleting tag:', error);
    return {
      success: false,
      message: 'Failed to delete tag',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get trending tags (public)
 */
export async function getTrendingTagsAction(limit: number = 10): Promise<{
  success: boolean;
  tags?: any[];
  errors?: string[];
}> {
  try {
    const tags = await getTrendingTags(limit);
    
    return {
      success: true,
      tags
    };
  } catch (error: any) {
    console.error('❌ Error fetching trending tags:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Search tags (public)
 */
export async function searchTagsAction(query: string, limit: number = 10): Promise<{
  success: boolean;
  tags?: any[];
  errors?: string[];
}> {
  try {
    const tags = await searchTags(query, limit);
    
    return {
      success: true,
      tags
    };
  } catch (error: any) {
    console.error('❌ Error searching tags:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}