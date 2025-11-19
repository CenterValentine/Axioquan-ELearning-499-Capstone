// /components/categories/category-navigation.tsx (Updated)

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  course_count: number;
  children?: Category[];
}

interface CategoryNavigationProps {
  featuredOnly?: boolean;
  showCourseCounts?: boolean;
  className?: string;
  currentCategory?: string;
}

export function CategoryNavigation({ 
  featuredOnly = false, 
  showCourseCounts = true,
  className = '',
  currentCategory = ''
}: CategoryNavigationProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const url = featuredOnly 
        ? '/api/categories?featured=true'
        : '/api/categories';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const isActiveCategory = (categorySlug: string) => {
    // Check if current path is the category page
    if (pathname === `/categories/${categorySlug}`) return true;
    
    // Check if category is selected via search param on courses page
    if (pathname === '/courses' && currentCategory === categorySlug) return true;
    
    return false;
  };

  const renderCategory = (category: Category, level: number = 0) => (
    <div key={category.id} className={level > 0 ? 'ml-4 border-l-2 border-gray-100 pl-4' : ''}>
      <Link
        href={`/categories/${category.slug}`} // Changed to category page
        className={`flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-50 ${
          isActiveCategory(category.slug) 
            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
            : 'text-gray-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          {category.icon && (
            <span className="text-lg">{category.icon}</span>
          )}
          <span className="font-medium">{category.name}</span>
        </div>
        
        {showCourseCounts && category.course_count > 0 && (
          <Badge 
            variant="secondary" 
            className={
              isActiveCategory(category.slug) 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }
          >
            {category.course_count}
          </Badge>
        )}
      </Link>
      
      {category.children && category.children.map(child => renderCategory(child, level + 1))}
    </div>
  );

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
            <div className="w-8 h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {/* All Categories Link - Points to main courses page */}
      <Link
        href="/courses"
        className={`flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-50 ${
          pathname === '/courses' && !currentCategory
            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
            : 'text-gray-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">📚</span>
          <span className="font-medium">All Categories</span>
        </div>
        
        {showCourseCounts && (
          <Badge 
            variant="secondary" 
            className={
              pathname === '/courses' && !currentCategory
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }
          >
            {categories.reduce((sum, cat) => sum + (cat.course_count || 0), 0)}
          </Badge>
        )}
      </Link>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No categories found
        </div>
      ) : (
        categories.map(category => renderCategory(category))
      )}
      
      {featuredOnly && categories.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <Link href="/categories">
            <Button variant="outline" className="w-full">
              View All Categories
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}