
// // /lib/categories/actions.ts

// 'use server';

// import { 
//   getAllCategories, 
//   getCategoryById, 
//   getCategoryBySlug, 
//   createCategory, 
//   updateCategory, 
//   deleteCategory,
//   getFeaturedCategories,
//   type CreateCategoryData,
//   type UpdateCategoryData 
// } from '@/lib/db/queries/categories';
// import { requireRole } from '@/lib/auth/utils';

// /**
//  * Get all categories (public)
//  */
// export async function getCategoriesAction(includeInactive: boolean = false): Promise<{
//   success: boolean;
//   categories?: any[];
//   errors?: string[];
// }> {
//   try {
//     const categories = await getAllCategories(includeInactive);
    
//     return {
//       success: true,
//       categories
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching categories:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get category by ID (public)
//  */
// export async function getCategoryByIdAction(id: string): Promise<{
//   success: boolean;
//   category?: any;
//   errors?: string[];
// }> {
//   try {
//     const category = await getCategoryById(id);
    
//     if (!category) {
//       return {
//         success: false,
//         errors: ['Category not found']
//       };
//     }

//     return {
//       success: true,
//       category
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching category:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get category by slug (public)
//  */
// export async function getCategoryBySlugAction(slug: string): Promise<{
//   success: boolean;
//   category?: any;
//   errors?: string[];
// }> {
//   try {
//     const category = await getCategoryBySlug(slug);
    
//     if (!category) {
//       return {
//         success: false,
//         errors: ['Category not found']
//       };
//     }

//     return {
//       success: true,
//       category
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching category:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Create category (admin only)
//  */
// export async function createCategoryAction(categoryData: CreateCategoryData): Promise<{
//   success: boolean;
//   message: string;
//   category?: any;
//   errors?: string[];
// }> {
//   try {
//     await requireRole('admin');
    
//     return await createCategory(categoryData);
//   } catch (error: any) {
//     console.error('❌ Error creating category:', error);
//     return {
//       success: false,
//       message: 'Failed to create category',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Update category (admin only)
//  */
// export async function updateCategoryAction(id: string, categoryData: UpdateCategoryData): Promise<{
//   success: boolean;
//   message: string;
//   category?: any;
//   errors?: string[];
// }> {
//   try {
//     await requireRole('admin');
    
//     return await updateCategory(id, categoryData);
//   } catch (error: any) {
//     console.error('❌ Error updating category:', error);
//     return {
//       success: false,
//       message: 'Failed to update category',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Delete category (admin only)
//  */
// export async function deleteCategoryAction(id: string): Promise<{
//   success: boolean;
//   message: string;
//   errors?: string[];
// }> {
//   try {
//     await requireRole('admin');
    
//     return await deleteCategory(id);
//   } catch (error: any) {
//     console.error('❌ Error deleting category:', error);
//     return {
//       success: false,
//       message: 'Failed to delete category',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get featured categories (public)
//  */
// export async function getFeaturedCategoriesAction(): Promise<{
//   success: boolean;
//   categories?: any[];
//   errors?: string[];
// }> {
//   try {
//     const categories = await getFeaturedCategories();
    
//     return {
//       success: true,
//       categories
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching featured categories:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }






























// /lib/categories/actions.ts

'use server';

import { 
  getAllCategories, 
  getCategoryById, 
  getCategoryBySlug, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getFeaturedCategories,
  type CreateCategoryData,
  type UpdateCategoryData 
} from '@/lib/db/queries/categories';
import { requireRole } from '@/lib/auth/utils';

/**
 * Get all categories (public)
 */
export async function getCategoriesAction(includeInactive: boolean = false): Promise<{
  success: boolean;
  categories?: any[];
  errors?: string[];
}> {
  try {
    const categories = await getAllCategories(includeInactive);

    return {
      success: true,
      categories
    };
  } catch (error: any) {
    console.error('❌ Error fetching categories:', error);

    // 🔥 SAFE FALLBACK FOR VERCEL BUILD
    return {
      success: false,
      categories: [],   // <—— Fallback prevents crashing
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get category by ID (public)
 */
export async function getCategoryByIdAction(id: string): Promise<{
  success: boolean;
  category?: any;
  errors?: string[];
}> {
  try {
    const category = await getCategoryById(id);

    if (!category) {
      return {
        success: false,
        category: null,   // <—— Added fallback
        errors: ['Category not found']
      };
    }

    return {
      success: true,
      category
    };
  } catch (error: any) {
    console.error('❌ Error fetching category:', error);

    return {
      success: false,
      category: null,   // <—— Fallback
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get category by slug (public)
 */
export async function getCategoryBySlugAction(slug: string): Promise<{
  success: boolean;
  category?: any;
  errors?: string[];
}> {
  try {
    const category = await getCategoryBySlug(slug);

    if (!category) {
      return {
        success: false,
        category: null,   // <—— Fallback
        errors: ['Category not found']
      };
    }

    return {
      success: true,
      category
    };
  } catch (error: any) {
    console.error('❌ Error fetching category:', error);

    return {
      success: false,
      category: null,   // <—— Fallback
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Create category (admin only)
 */
export async function createCategoryAction(categoryData: CreateCategoryData): Promise<{
  success: boolean;
  message: string;
  category?: any;
  errors?: string[];
}> {
  try {
    await requireRole('admin');

    return await createCategory(categoryData);
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
 * Update category (admin only)
 */
export async function updateCategoryAction(id: string, categoryData: UpdateCategoryData): Promise<{
  success: boolean;
  message: string;
  category?: any;
  errors?: string[];
}> {
  try {
    await requireRole('admin');

    return await updateCategory(id, categoryData);
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
 * Delete category (admin only)
 */
export async function deleteCategoryAction(id: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    await requireRole('admin');

    return await deleteCategory(id);
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
 * Get featured categories (public)
 */
export async function getFeaturedCategoriesAction(): Promise<{
  success: boolean;
  categories?: any[];
  errors?: string[];
}> {
  try {
    const categories = await getFeaturedCategories();

    return {
      success: true,
      categories
    };
  } catch (error: any) {
    console.error('❌ Error fetching featured categories:', error);

    return {
      success: false,
      categories: [],   // <—— Fallback
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}
