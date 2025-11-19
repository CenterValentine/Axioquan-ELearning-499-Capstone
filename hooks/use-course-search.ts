
// /hooks/use-course-search.ts

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Course } from '@/types/courses';

export interface SearchFilters {
  searchQuery: string;
  category_slug: string;
  difficulty: string;
  content_type: string;
  price_range: string;
  min_rating: number;
  language: string;
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  sort_by: string;
}

interface UseCourseSearchReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  updateFilters: (newFilters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  loadMore: () => void;
  searchCourses: (filters?: Partial<SearchFilters>) => Promise<void>;
}

const defaultFilters: SearchFilters = {
  searchQuery: '',
  category_slug: '',
  difficulty: '',
  content_type: '',
  price_range: '',
  min_rating: 0,
  language: '',
  tags: [],
  is_featured: false,
  is_trending: false,
  sort_by: 'relevance'
};

export function useCourseSearch(initialCourses: Course[] = []): UseCourseSearchReturn {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false
  });

  const buildSearchParams = useCallback((filters: SearchFilters, offset: number = 0) => {
    const params = new URLSearchParams();
    
    if (filters.searchQuery) params.set('q', filters.searchQuery);
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.content_type) params.set('content_type', filters.content_type);
    if (filters.price_range) params.set('price_range', filters.price_range);
    if (filters.min_rating > 0) params.set('min_rating', filters.min_rating.toString());
    if (filters.language) params.set('language', filters.language);
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.is_featured) params.set('is_featured', 'true');
    if (filters.is_trending) params.set('is_trending', 'true');
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    
    params.set('limit', pagination.limit.toString());
    params.set('offset', offset.toString());

    return params;
  }, [pagination.limit]);

  const searchCourses = useCallback(async (newFilters?: Partial<SearchFilters>, offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      const updatedFilters = newFilters ? { ...filters, ...newFilters } : filters;
      const searchParams = buildSearchParams(updatedFilters, offset);

      const response = await fetch(`/api/courses/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to search courses');
      }

      const data = await response.json();
      
      if (offset === 0) {
        setCourses(data.courses);
      } else {
        setCourses(prev => [...prev, ...data.courses]);
      }
      
      setPagination(data.pagination);
      
      if (newFilters) {
        setFilters(updatedFilters);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, buildSearchParams]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset offset when filters change
    setPagination(prev => ({ ...prev, offset: 0 }));
    searchCourses(newFilters, 0);
  }, [searchCourses]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPagination(prev => ({ ...prev, offset: 0 }));
    searchCourses(defaultFilters, 0);
  }, [searchCourses]);

  const loadMore = useCallback(() => {
    const newOffset = pagination.offset + pagination.limit;
    if (pagination.hasMore) {
      setPagination(prev => ({ ...prev, offset: newOffset }));
      searchCourses(undefined, newOffset);
    }
  }, [pagination, searchCourses]);

  // Initialize with initial courses
  useMemo(() => {
    if (initialCourses.length > 0 && courses.length === 0) {
      setCourses(initialCourses);
      setPagination(prev => ({
        ...prev,
        total: initialCourses.length,
        hasMore: initialCourses.length > prev.limit
      }));
    }
  }, [initialCourses, courses.length]);

  return {
    courses,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    loadMore,
    searchCourses
  };
}