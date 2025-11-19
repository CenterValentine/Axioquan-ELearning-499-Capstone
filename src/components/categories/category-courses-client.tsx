// /components/categories/category-courses-client.tsx

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CourseGrid } from '@/components/courses/course-grid';
import { SearchBar } from '@/components/courses/search-bar';
import { CourseFilters } from '@/components/courses/course-filters';
import { useCourseSearch } from '@/hooks/use-course-search';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Home } from 'lucide-react';
import { Category } from '@/types/categories';

interface CategoryCoursesClientProps {
  category: Category;
  initialCourses: any[];
  availableTags: any[];
  searchParams: {
    search?: string;
    difficulty?: string;
    content_type?: string;
    price_range?: string;
    min_rating?: string;
    sort_by?: string;
  };
}

export function CategoryCoursesClient({ 
  category, 
  initialCourses, 
  availableTags, 
  searchParams 
}: CategoryCoursesClientProps) {
  const {
    courses,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    loadMore,
    searchCourses
  } = useCourseSearch(initialCourses);

  // Initialize with URL params and category filter
  useEffect(() => {
    const urlFilters = {
      searchQuery: searchParams.search || '',
      category_slug: category.slug, // Always filter by this category
      difficulty: searchParams.difficulty || '',
      content_type: searchParams.content_type || '',
      price_range: searchParams.price_range || '',
      min_rating: parseFloat(searchParams.min_rating || '0'),
      sort_by: searchParams.sort_by || 'relevance'
    };
    
    updateFilters(urlFilters);
  }, [searchParams, category.slug]);

  const handleSearch = (query: string) => {
    updateFilters({ searchQuery: query });
  };

  const handleResetCategoryFilters = () => {
    // Reset all filters except the category
    resetFilters();
    updateFilters({ category_slug: category.slug });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb and Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-gray-700">
              Courses
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                {category.icon && (
                  <span className="text-2xl">{category.icon}</span>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {category.name}
                </h1>
                <Badge 
                  variant="secondary"
                  style={{ 
                    backgroundColor: `${category.color}20`,
                    borderColor: category.color,
                    color: category.color
                  }}
                >
                  {category.course_count} course{category.course_count !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {category.description && (
                <p className="text-lg text-gray-600 max-w-3xl">
                  {category.description}
                </p>
              )}
            </div>

            <Link href="/courses">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to All Courses</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder={`Search in ${category.name}...`}
            initialValue={filters.searchQuery}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Category Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  {category.icon && (
                    <span className="text-xl">{category.icon}</span>
                  )}
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-600">
                      {category.course_count} course{category.course_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                {category.description && (
                  <p className="text-sm text-gray-600">{category.description}</p>
                )}
                
                {category.parent && (
                  <div className="text-sm">
                    <span className="text-gray-500">Parent: </span>
                    <Link 
                      href={`/categories/${category.parent.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {category.parent.name}
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Advanced Filters */}
            <CourseFilters
              filters={filters}
              onFiltersChange={updateFilters}
              onReset={handleResetCategoryFilters}
              availableTags={availableTags}
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Category Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Showing:</span>
                  <span className="font-semibold">{courses.length} of {pagination.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total in Category:</span>
                  <span className="font-semibold">{category.course_count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Tags:</span>
                  <span className="font-semibold">{availableTags.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filters.searchQuery ? (
                    <>Search Results for "{filters.searchQuery}" in {category.name}</>
                  ) : (
                    <>All Courses in {category.name}</>
                  )}
                </h2>
                <p className="text-gray-600 mt-1">
                  {loading ? (
                    'Searching...'
                  ) : (
                    <>
                      {pagination.total} course{pagination.total !== 1 ? 's' : ''} found
                      {hasActiveFilters(filters) && ' (filtered)'}
                    </>
                  )}
                </p>
              </div>

              {/* Active Filters */}
              {hasActiveFilters(filters) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetCategoryFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Error State */}
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-red-700">Error: {error}</p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading && courses.length === 0 && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Searching courses...</p>
              </div>
            )}

            {/* Courses Grid */}
            <CourseGrid 
              courses={courses}
              showInstructor={true}
              showActions={false}
              emptyMessage={
                filters.searchQuery || hasActiveFilters(filters)
                  ? `No courses found in ${category.name} matching your criteria. Try adjusting your filters.`
                  : `No courses available yet in ${category.name}. Check back soon!`
              }
            />

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="text-center mt-8">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  className="min-w-32"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to check if any filters are active (excluding category)
function hasActiveFilters(filters: any): boolean {
  return Object.keys(filters).some(key => {
    if (key === 'category_slug') return false; // Don't count category as an active filter
    if (key === 'searchQuery') return filters[key] !== '';
    if (key === 'min_rating') return filters[key] > 0;
    if (key === 'tags') return filters[key].length > 0;
    if (key === 'is_featured' || key === 'is_trending') return filters[key];
    return filters[key] !== '';
  });
}