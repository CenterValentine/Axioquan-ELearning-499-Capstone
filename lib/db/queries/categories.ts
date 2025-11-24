
// /lib/db/queries/categories.ts

import { sql } from '../index';

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
  created_at: Date;
  updated_at: Date;
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

/**
 * Get all categories with hierarchical structure
 */
export async function getAllCategories(includeInactive: boolean = false): Promise<Category[]> {
  try {
    let query = sql`
      SELECT 
        c.*,
        parent.name as parent_name,
        parent.slug as parent_slug,
        COUNT(DISTINCT courses.id) as course_count
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      LEFT JOIN courses ON courses.category_id = c.id
    `;

    if (!includeInactive) {
      query = sql`${query} WHERE c.is_active = true`;
    }

    query = sql`${query} 
      GROUP BY c.id, parent.name, parent.slug
      ORDER BY c.sort_order ASC, c.name ASC
    `;

    const categories = await query;
    
    // Build hierarchical structure
    const categoryMap = new Map();
    const rootCategories: Category[] = [];

    // First pass: create map and find roots
    categories.forEach((cat: any) => {
      const category: Category = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parent_id: cat.parent_id,
        image_url: cat.image_url,
        icon: cat.icon,
        color: cat.color || '#3B82F6',
        is_active: cat.is_active,
        is_featured: cat.is_featured,
        sort_order: cat.sort_order,
        course_count: parseInt(cat.course_count) || 0,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
        children: []
      };

      categoryMap.set(cat.id, category);

      if (!cat.parent_id) {
        rootCategories.push(category);
      }
    });

    // Second pass: build hierarchy
    categories.forEach((cat: any) => {
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        const parent = categoryMap.get(cat.parent_id);
        const child = categoryMap.get(cat.id);
        if (parent && child) {
          parent.children = parent.children || [];
          parent.children.push(child);
        }
      }
    });

    return rootCategories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const categories = await sql`
      SELECT 
        c.*,
        parent.name as parent_name,
        parent.slug as parent_slug,
        COUNT(DISTINCT courses.id) as course_count
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      LEFT JOIN courses ON courses.category_id = c.id
      WHERE c.id = ${id}
      GROUP BY c.id, parent.name, parent.slug
      LIMIT 1
    `;

    if (categories.length === 0) return null;

    const cat = categories[0];
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parent_id: cat.parent_id,
      image_url: cat.image_url,
      icon: cat.icon,
      color: cat.color || '#3B82F6',
      is_active: cat.is_active,
      is_featured: cat.is_featured,
      sort_order: cat.sort_order,
      course_count: parseInt(cat.course_count) || 0,
      created_at: cat.created_at,
      updated_at: cat.updated_at
    };
  } catch (error) {
    console.error('❌ Error fetching category by ID:', error);
    return null;
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categories = await sql`
      SELECT 
        c.*,
        parent.name as parent_name,
        parent.slug as parent_slug,
        COUNT(DISTINCT courses.id) as course_count
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      LEFT JOIN courses ON courses.category_id = c.id
      WHERE c.slug = ${slug} AND c.is_active = true
      GROUP BY c.id, parent.name, parent.slug
      LIMIT 1
    `;

    if (categories.length === 0) return null;

    const cat = categories[0];
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parent_id: cat.parent_id,
      image_url: cat.image_url,
      icon: cat.icon,
      color: cat.color || '#3B82F6',
      is_active: cat.is_active,
      is_featured: cat.is_featured,
      sort_order: cat.sort_order,
      course_count: parseInt(cat.course_count) || 0,
      created_at: cat.created_at,
      updated_at: cat.updated_at
    };
  } catch (error) {
    console.error('❌ Error fetching category by slug:', error);
    return null;
  }
}


/**
 * Create a new category
 */
export async function createCategory(categoryData: CreateCategoryData): Promise<{
  success: boolean;
  message: string;
  category?: Category;
  errors?: string[];
}> {
  try {
    // Check if slug already exists
    const existing = await sql`
      SELECT id FROM categories WHERE slug = ${categoryData.slug} LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: false,
        message: 'Category creation failed',
        errors: ['Slug already exists']
      };
    }

    // ✅ FIX: Handle empty parent_id by converting to null
    const parentId = categoryData.parent_id?.trim() || null;

    const newCategory = await sql`
      INSERT INTO categories (
        name, slug, description, parent_id, image_url, icon, color, 
        is_active, is_featured, sort_order
      ) VALUES (
        ${categoryData.name},
        ${categoryData.slug},
        ${categoryData.description},
        ${parentId},  -- ✅ Now properly handles empty string
        ${categoryData.image_url},
        ${categoryData.icon},
        ${categoryData.color || '#3B82F6'},
        ${categoryData.is_active ?? true},
        ${categoryData.is_featured ?? false},
        ${categoryData.sort_order ?? 0}
      )
      RETURNING *
    `;

    return {
      success: true,
      message: 'Category created successfully',
      category: newCategory[0] as Category
    };
  } catch (error: any) {
    console.error('❌ Error creating category:', error);
    return {
      success: false,
      message: 'Failed to create category',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Update category
 */
export async function updateCategory(id: string, categoryData: UpdateCategoryData): Promise<{
  success: boolean;
  message: string;
  category?: Category;
  errors?: string[];
}> {
  try {
    // Check if slug already exists (excluding current category)
    if (categoryData.slug) {
      const existing = await sql`
        SELECT id FROM categories WHERE slug = ${categoryData.slug} AND id != ${id} LIMIT 1
      `;

      if (existing.length > 0) {
        return {
          success: false,
          message: 'Category update failed',
          errors: ['Slug already exists']
        };
      }
    }

    // ✅ FIX: Handle empty parent_id by converting to null
    const parentId = categoryData.parent_id?.trim() === '' ? null : categoryData.parent_id;

    const updatedCategory = await sql`
      UPDATE categories 
      SET 
        name = COALESCE(${categoryData.name}, name),
        slug = COALESCE(${categoryData.slug}, slug),
        description = COALESCE(${categoryData.description}, description),
        parent_id = ${parentId},  -- ✅ Direct assignment instead of COALESCE
        image_url = COALESCE(${categoryData.image_url}, image_url),
        icon = COALESCE(${categoryData.icon}, icon),
        color = COALESCE(${categoryData.color}, color),
        is_active = COALESCE(${categoryData.is_active}, is_active),
        is_featured = COALESCE(${categoryData.is_featured}, is_featured),
        sort_order = COALESCE(${categoryData.sort_order}, sort_order),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedCategory.length === 0) {
      return {
        success: false,
        message: 'Category not found',
        errors: ['Category not found']
      };
    }

    return {
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory[0] as Category
    };
  } catch (error: any) {
    console.error('❌ Error updating category:', error);
    return {
      success: false,
      message: 'Failed to update category',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}



/**
 * Delete category (soft delete by setting inactive)
 */
export async function deleteCategory(id: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // Check if category has courses
    const courseCount = await sql`
      SELECT COUNT(*) as count FROM courses WHERE category_id = ${id}
    `;

    if (parseInt(courseCount[0].count) > 0) {
      return {
        success: false,
        message: 'Cannot delete category',
        errors: ['Category has associated courses. Please reassign or delete courses first.']
      };
    }

    // Check if category has children
    const childCount = await sql`
      SELECT COUNT(*) as count FROM categories WHERE parent_id = ${id}
    `;

    if (parseInt(childCount[0].count) > 0) {
      return {
        success: false,
        message: 'Cannot delete category',
        errors: ['Category has subcategories. Please delete or reassign subcategories first.']
      };
    }

    const result = await sql`
      DELETE FROM categories WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Category not found',
        errors: ['Category not found']
      };
    }

    return {
      success: true,
      message: 'Category deleted successfully'
    };
  } catch (error: any) {
    console.error('❌ Error deleting category:', error);
    return {
      success: false,
      message: 'Failed to delete category',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get featured categories
 */
export async function getFeaturedCategories(): Promise<Category[]> {
  try {
    const categories = await sql`
      SELECT 
        c.*,
        COUNT(DISTINCT courses.id) as course_count
      FROM categories c
      LEFT JOIN courses ON courses.category_id = c.id
      WHERE c.is_featured = true AND c.is_active = true
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
      LIMIT 10
    `;

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parent_id: cat.parent_id,
      image_url: cat.image_url,
      icon: cat.icon,
      color: cat.color || '#3B82F6',
      is_active: cat.is_active,
      is_featured: cat.is_featured,
      sort_order: cat.sort_order,
      course_count: parseInt(cat.course_count) || 0,
      created_at: cat.created_at,
      updated_at: cat.updated_at
    }));
  } catch (error) {
    console.error('❌ Error fetching featured categories:', error);
    return [];
  }
}