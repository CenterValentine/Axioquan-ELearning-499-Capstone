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
import { Loader2, ArrowLeft, Home, Filter, Search, Star, Users, BookOpen, TrendingUp, Play } from 'lucide-react';
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

// EXACT Premium Course Card Component from your homepage
function PremiumCourseCard({ course }: { course: any }) {
  return (
    <Link href={`/courses/${course.slug || course.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full">
        {/* Course Image with Play Button */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary to-secondary">
          <img
            src={course.thumbnail_url || "/placeholder-course.png"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
              <Play size={32} className="text-primary fill-primary" />
            </div>
          </div>
          <span className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
            {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : 'NEW'}
          </span>
        </div>

        {/* Course Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
          
          {/* Instructor with Profile Image */}
          <div className="flex items-center gap-2 mb-4">
            {course.instructor_image && (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={course.instructor_image}
                  alt={course.instructor_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {course.instructor_name || 'Expert Instructor'}
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-primary font-bold">
              {course.price_cents ? `$${(course.price_cents / 100).toFixed(2)}` : 'FREE'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="font-semibold">{course.average_rating || '4.8'}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {course.enrolled_students_count ? `${course.enrolled_students_count.toLocaleString()} students` : 'Join now!'}
          </p>
        </div>
      </div>
    </Link>
  );
}

// Custom Course Grid using EXACT Premium Course Cards
// Custom Course Grid using EXACT Premium Course Cards - MODIFIED: 3 cards per row
function PremiumCourseGrid({ courses }: { courses: any[] }) {
  if (!courses || courses.length === 0) return null;

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {courses.map((course) => (
        <PremiumCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
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
    // FIXED: Only reset search and filter parameters, KEEP the category filter
    const filtersToReset = {
      searchQuery: '',
      difficulty: '',
      content_type: '',
      price_range: '',
      min_rating: 0,
      sort_by: 'relevance',
      tags: [],
      is_featured: false,
      is_trending: false
      // category_slug is NOT reset - it stays as the current category
    };
    
    updateFilters(filtersToReset);
  };

  // Calculate category stats
  const featuredCourses = courses.filter(course => course.is_featured);
  const trendingCourses = courses.filter(course => course.is_trending);
  const freeCourses = courses.filter(course => course.price_cents === 0);

  // Create empty state components
  const EmptyState = () => {
    if (filters.searchQuery || hasActiveFilters(filters)) {
      return (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm sm:text-base">
            No courses found in {category.name} matching your criteria. Try adjusting your filters or search terms.
          </p>
          <Button onClick={handleResetCategoryFilters} size="sm" className="sm:text-base">
            Clear All Filters
          </Button>
        </div>
      );
    } else {
      return (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No courses available yet</h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
            We're working on adding amazing courses to {category.name}. Check back soon for new content!
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - SUPER RESPONSIVE */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 flex-wrap">
                <Link href="/" className="hover:text-white flex items-center transition-colors">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Home
                </Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white transition-colors">
                  Courses
                </Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
                <span>/</span>
                <span className="text-white font-medium">{category.name}</span>
              </nav>

              {/* Category Header */}
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                {category.icon && (
                  <span className="text-2xl sm:text-3xl lg:text-4xl bg-white/10 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0">
                    {category.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 break-words">
                    {category.name}
                  </h1>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/20 text-white border-0 text-xs sm:text-sm"
                    >
                      {category.course_count} course{category.course_count !== 1 ? 's' : ''}
                    </Badge>
                    {category.is_featured && (
                      <Badge className="bg-yellow-500 text-black border-0 text-xs sm:text-sm">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Description */}
              {category.description && (
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-3xl leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            {/* Quick Stats - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <div className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{courses.length}</div>
                <div className="text-xs sm:text-sm text-gray-300">Showing</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{featuredCourses.length}</div>
                <div className="text-xs sm:text-sm text-gray-300">Featured</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{freeCourses.length}</div>
                <div className="text-xs sm:text-sm text-gray-300">Free</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{trendingCourses.length}</div>
                <div className="text-xs sm:text-sm text-gray-300">Trending</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section - CLEANER DESIGN: Buttons under search input */}
            {/* Search Section - CORRECTED: Full width input, buttons below with original size */}
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Full Width Search Input - Top Level */}
          <div className="w-full mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={`Search ${category.name} courses...`}
                value={filters.searchQuery}
                onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(filters.searchQuery);
                  }
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Press Enter to search
            </p>
          </div>
          
          {/* Action Buttons - BELOW search input, original size, floated left/right */}
          <div className="flex items-center justify-between">
            {/* Left side - All Courses button */}
            <Link href="/courses">
              <Button variant="outline" className="flex items-center space-x-2 whitespace-nowrap text-sm sm:text-base">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>All Courses</span>
              </Button>
            </Link>
            
            {/* Right side - Clear Filters button */}
            {hasActiveFilters(filters) && (
              <Button
                variant="outline"
                onClick={handleResetCategoryFilters}
                className="whitespace-nowrap border-gray-300 text-sm sm:text-base"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content - SUPER RESPONSIVE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Responsive */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Category Info Card */}
            <Card className="bg-white border border-gray-200 sm:border-2 sm:border-gray-100 shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Category Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {category.icon && (
                    <span 
                      className="text-xl sm:text-2xl p-2 rounded-lg bg-white shadow-sm"
                      style={{ color: category.color }}
                    >
                      {category.icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {category.course_count} course{category.course_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                {category.description && (
                  <p className="text-xs sm:text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {category.description}
                  </p>
                )}
                
                {category.parent && (
                  <div className="text-xs sm:text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">Parent Category: </span>
                    <Link 
                      href={`/categories/${category.parent.slug}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {category.parent.name}
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Advanced Filters */}
            <Card className="bg-white border border-gray-200 sm:border-2 sm:border-gray-100 shadow-sm lg:sticky lg:top-24">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CourseFilters
                  filters={filters}
                  onFiltersChange={updateFilters}
                  onReset={handleResetCategoryFilters}
                  availableTags={availableTags}
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white border border-gray-200 sm:border-2 sm:border-gray-100 shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Category Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Showing:</span>
                  <span className="font-semibold text-gray-900">{courses.length} of {pagination.total}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Courses:</span>
                  <span className="font-semibold text-gray-900">{category.course_count}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-semibold text-gray-900">{featuredCourses.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Available Tags:</span>
                  <span className="font-semibold text-gray-900">{availableTags.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses Grid - SUPER RESPONSIVE */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">
                  {filters.searchQuery ? (
                    <>
                      Search Results for "<span className="text-blue-600 break-words">{filters.searchQuery}</span>" in {category.name}
                    </>
                  ) : (
                    <>All Courses in {category.name}</>
                  )}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
                      Searching courses...
                    </span>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-900">{pagination.total}</span> course{pagination.total !== 1 ? 's' : ''} found
                      {hasActiveFilters(filters) && (
                        <span className="text-blue-600"> (filtered)</span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* Active Filters Badge */}
              {hasActiveFilters(filters) && (
                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm">
                    <Filter className="h-3 w-3 mr-1" />
                    Filters Active
                  </Badge>
                </div>
              )}
            </div>

            {/* Error State */}
            {error && (
              <Card className="mb-4 sm:mb-6 border-red-200 bg-red-50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-base sm:text-lg">⚠️</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-red-800 text-sm sm:text-base">Error Loading Courses</h3>
                      <p className="text-red-700 text-xs sm:text-sm truncate">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading && courses.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Searching Courses</h3>
                <p className="text-gray-600 text-sm sm:text-base">Finding the best courses in {category.name} for you...</p>
              </div>
            )}

            {/* Courses Grid or Empty State */}
            {courses.length > 0 ? (
              <>
                {/* USING EXACT PREMIUM COURSE CARDS FROM HOMEPAGE */}
                <PremiumCourseGrid courses={courses} />
                
                {/* Load More Button */}
                {pagination.hasMore && (
                  <div className="text-center mt-8 sm:mt-12">
                    <Button
                      onClick={loadMore}
                      disabled={loading}
                      variant="outline"
                      className="min-w-32 px-6 sm:px-8 py-2 sm:py-3 border border-gray-300 sm:border-2 hover:border-gray-400 transition-colors text-sm sm:text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        'Load More Courses'
                      )}
                    </Button>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                      Showing {courses.length} of {pagination.total} courses
                    </p>
                  </div>
                )}
              </>
            ) : (
              !loading && <EmptyState />
            )}
          </div>
        </div>
      </section>
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