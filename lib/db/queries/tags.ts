
// /lib/db/queries/tags.ts

import { sql } from '../index';

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
  created_at: Date;
  updated_at: Date;
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

/**
 * Get all tags
 */
export async function getAllTags(options?: {
  featured?: boolean;
  trending?: boolean;
  limit?: number;
}): Promise<Tag[]> {
  try {
    let query = sql`SELECT * FROM tags WHERE 1=1`;

    if (options?.featured) {
      query = sql`${query} AND is_featured = true`;
    }

    if (options?.trending) {
      query = sql`${query} AND is_trending = true`;
    }

    query = sql`${query} ORDER BY usage_count DESC, name ASC`;

    if (options?.limit) {
      query = sql`${query} LIMIT ${options.limit}`;
    }

    const tags = await query;
    return tags as Tag[];
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
    return [];
  }
}

/**
 * Get tag by ID
 */
export async function getTagById(id: string): Promise<Tag | null> {
  try {
    const tags = await sql`
      SELECT * FROM tags WHERE id = ${id} LIMIT 1
    `;

    if (tags.length === 0) return null;

    const tag = tags[0];
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      color: tag.color || '#3B82F6',
      icon: tag.icon,
      is_featured: tag.is_featured,
      is_trending: tag.is_trending,
      usage_count: tag.usage_count,
      created_at: tag.created_at,
      updated_at: tag.updated_at
    };
  } catch (error) {
    console.error('❌ Error fetching tag by ID:', error);
    return null;
  }
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const tags = await sql`
      SELECT * FROM tags WHERE slug = ${slug} LIMIT 1
    `;

    if (tags.length === 0) return null;

    const tag = tags[0];
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      color: tag.color || '#3B82F6',
      icon: tag.icon,
      is_featured: tag.is_featured,
      is_trending: tag.is_trending,
      usage_count: tag.usage_count,
      created_at: tag.created_at,
      updated_at: tag.updated_at
    };
  } catch (error) {
    console.error('❌ Error fetching tag by slug:', error);
    return null;
  }
}

/**
 * Create a new tag
 */
export async function createTag(tagData: CreateTagData): Promise<{
  success: boolean;
  message: string;
  tag?: Tag;
  errors?: string[];
}> {
  try {
    // Check if slug already exists
    const existing = await sql`
      SELECT id FROM tags WHERE slug = ${tagData.slug} LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: false,
        message: 'Tag creation failed',
        errors: ['Slug already exists']
      };
    }

    const newTag = await sql`
      INSERT INTO tags (
        name, slug, description, color, icon, is_featured
      ) VALUES (
        ${tagData.name},
        ${tagData.slug},
        ${tagData.description},
        ${tagData.color || '#3B82F6'},
        ${tagData.icon},
        ${tagData.is_featured ?? false}
      )
      RETURNING *
    `;

    return {
      success: true,
      message: 'Tag created successfully',
      tag: newTag[0] as Tag
    };
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
 * Update tag
 */
export async function updateTag(id: string, tagData: UpdateTagData): Promise<{
  success: boolean;
  message: string;
  tag?: Tag;
  errors?: string[];
}> {
  try {
    // Check if slug already exists (excluding current tag)
    if (tagData.slug) {
      const existing = await sql`
        SELECT id FROM tags WHERE slug = ${tagData.slug} AND id != ${id} LIMIT 1
      `;

      if (existing.length > 0) {
        return {
          success: false,
          message: 'Tag update failed',
          errors: ['Slug already exists']
        };
      }
    }

    const updatedTag = await sql`
      UPDATE tags 
      SET 
        name = COALESCE(${tagData.name}, name),
        slug = COALESCE(${tagData.slug}, slug),
        description = COALESCE(${tagData.description}, description),
        color = COALESCE(${tagData.color}, color),
        icon = COALESCE(${tagData.icon}, icon),
        is_featured = COALESCE(${tagData.is_featured}, is_featured),
        is_trending = COALESCE(${tagData.is_trending}, is_trending),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedTag.length === 0) {
      return {
        success: false,
        message: 'Tag not found',
        errors: ['Tag not found']
      };
    }

    return {
      success: true,
      message: 'Tag updated successfully',
      tag: updatedTag[0] as Tag
    };
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
 * Delete tag
 */
export async function deleteTag(id: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // Check if tag is used by any courses
    const courseCount = await sql`
      SELECT COUNT(*) as count FROM course_tags WHERE tag_id = ${id}
    `;

    if (parseInt(courseCount[0].count) > 0) {
      return {
        success: false,
        message: 'Cannot delete tag',
        errors: ['Tag is used by courses. Please remove tag from courses first.']
      };
    }

    const result = await sql`
      DELETE FROM tags WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Tag not found',
        errors: ['Tag not found']
      };
    }

    return {
      success: true,
      message: 'Tag deleted successfully'
    };
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
 * Get trending tags (most used tags)
 */
export async function getTrendingTags(limit: number = 10): Promise<Tag[]> {
  try {
    const tags = await sql`
      SELECT * FROM tags 
      WHERE usage_count > 0
      ORDER BY usage_count DESC, updated_at DESC
      LIMIT ${limit}
    `;

    // Update trending status
    await sql`
      UPDATE tags 
      SET is_trending = true 
      WHERE id IN (SELECT id FROM tags ORDER BY usage_count DESC LIMIT 5)
    `;

    await sql`
      UPDATE tags 
      SET is_trending = false 
      WHERE id NOT IN (SELECT id FROM tags ORDER BY usage_count DESC LIMIT 5)
    `;

    return tags as Tag[];
  } catch (error) {
    console.error('❌ Error fetching trending tags:', error);
    return [];
  }
}

/**
 * Increment tag usage count
 */
export async function incrementTagUsage(tagId: string): Promise<void> {
  try {
    await sql`
      UPDATE tags 
      SET usage_count = usage_count + 1, updated_at = NOW()
      WHERE id = ${tagId}
    `;
  } catch (error) {
    console.error('❌ Error incrementing tag usage:', error);
  }
}

/**
 * Decrement tag usage count
 */
export async function decrementTagUsage(tagId: string): Promise<void> {
  try {
    await sql`
      UPDATE tags 
      SET usage_count = GREATEST(0, usage_count - 1), updated_at = NOW()
      WHERE id = ${tagId}
    `;
  } catch (error) {
    console.error('❌ Error decrementing tag usage:', error);
  }
}

/**
 * Search tags by name
 */
export async function searchTags(query: string, limit: number = 10): Promise<Tag[]> {
  try {
    const tags = await sql`
      SELECT * FROM tags 
      WHERE name ILIKE ${`%${query}%`} OR slug ILIKE ${`%${query}%`}
      ORDER BY 
        CASE 
          WHEN name ILIKE ${`${query}%`} THEN 1
          WHEN slug ILIKE ${`${query}%`} THEN 2
          ELSE 3
        END,
        usage_count DESC
      LIMIT ${limit}
    `;

    return tags as Tag[];
  } catch (error) {
    console.error('❌ Error searching tags:', error);
    return [];
  }
}