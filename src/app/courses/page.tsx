// main courses page for public

// /app/courses/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCoursesAction } from '@/lib/courses/actions';
import { getCategoriesAction } from '@/lib/categories/actions';
import { getTagsAction } from '@/lib/tags/actions';
import { PremiumCourseCard } from '@/components/courses/premium-course-card';
import { CategoryNavigation } from '@/components/categories/category-navigation';
import { CourseFilters } from '@/components/courses/course-filters';
import { useCourseSearch } from '@/hooks/use-course-search';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Loader2, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Star, 
  Zap,
  Grid3X3,
  List,
  Play,
  ArrowRight,
  Rocket,
  Brain,
  Code,
  Palette
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Course } from '@/types/courses';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    difficulty?: string;
    content_type?: string;
    price_range?: string;
    min_rating?: string;
    sort_by?: string;
  }>;
}

// View Toggle Component
function ViewToggle({ view, onViewChange }: { view: 'grid' | 'list'; onViewChange: (view: 'grid' | 'list') => void }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 ${view === 'grid' ? 'bg-gray-900 text-white shadow-sm hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900'}`}
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 ${view === 'list' ? 'bg-gray-900 text-white shadow-sm hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900'}`}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </Button>
    </div>
  );
}

// Animated Text Slider Component
function TextSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Code className="h-12 w-12 text-blue-400" />,
      title: "Master Modern Tech",
      description: "Learn cutting-edge technologies from industry experts",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="h-12 w-12 text-purple-400" />,
      title: "Boost Your Career",
      description: "Gain skills that companies are hiring for right now",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Rocket className="h-12 w-12 text-orange-400" />,
      title: "Learn at Light Speed",
      description: "Accelerate your learning with project-based courses",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Palette className="h-12 w-12 text-green-400" />,
      title: "Unlock Creativity",
      description: "Transform your ideas into reality with practical skills",
      gradient: "from-green-500 to-teal-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-48 md:h-56 lg:h-64 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-8 border border-white/20">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="flex-1">
          <div className="relative h-24 overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    {slide.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {slide.title}
                    </h3>
                    <p className="text-blue-100 text-lg">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-8 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-6'
                : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

// Enhanced Stats Cards for Dark Background
function StatsCards({ stats }: { stats: { courses: number; categories: number; featured: number; skills: number } }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Top Row - 2 cards */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/40 transition-all group hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{stats.courses}</div>
            <div className="text-blue-200 text-sm">Courses</div>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="h-6 w-6 text-blue-300" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/40 transition-all group hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{stats.categories}</div>
            <div className="text-green-200 text-sm">Categories</div>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6 text-green-300" />
          </div>
        </div>
      </div>

      {/* Bottom Row - 2 cards */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-yellow-400/40 transition-all group hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{stats.featured}</div>
            <div className="text-yellow-200 text-sm">Featured</div>
          </div>
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="h-6 w-6 text-yellow-300" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/40 transition-all group hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{stats.skills}</div>
            <div className="text-purple-200 text-sm">Skills</div>
          </div>
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6 text-purple-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Course List View
function CourseListView({ courses }: { courses: Course[] }) {
  const formatPrice = (priceCents: number) => {
    if (priceCents === 0) return 'FREE';
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    if (!minutes || minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getRating = (rating: any): string => {
    if (!rating || rating === 0 || rating === '0') return '4.8';
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (isNaN(numericRating) || !isFinite(numericRating)) return '4.8';
    return numericRating.toFixed(1);
  };

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Link key={course.id} href={`/courses/${course.slug}`}>
          <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer">
            {/* Course Thumbnail */}
            <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={course.thumbnail_url || "/placeholder-course.png"}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <div className="bg-white rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform">
                  <Play size={20} className="text-primary fill-primary" />
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {course.category_name && (
                      <Badge variant="outline" className="text-xs">
                        {course.category_name}
                      </Badge>
                    )}
                    {course.is_featured && (
                      <Badge className="bg-purple-500 text-white border-0 text-xs">
                        FEATURED
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.short_description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.short_description}
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-primary font-bold text-lg mb-1">
                    {formatPrice(course.price_cents || 0)}
                  </div>
                  <div className="flex items-center gap-1 sm:justify-end">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-sm font-semibold text-gray-900">
                      {getRating(course.average_rating)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600">
                  {/* Instructor */}
                  <div className="flex items-center gap-2">
                    {course.instructor_image && (
                      <img
                        src={course.instructor_image}
                        alt={course.instructor_name || 'Instructor'}
                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                      />
                    )}
                    <span className="text-sm">{course.instructor_name || 'Expert Instructor'}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {course.total_lessons && (
                      <span className="text-sm">📚 {course.total_lessons} lessons</span>
                    )}
                    {course.total_video_duration && (
                      <span className="text-sm">⏱️ {formatDuration(course.total_video_duration)}</span>
                    )}
                    {course.enrolled_students_count && (
                      <span className="text-sm">👥 {course.enrolled_students_count.toLocaleString()} students</span>
                    )}
                  </div>
                </div>

                {/* Difficulty */}
                {course.difficulty_level && (
                  <Badge variant="outline" className="text-xs self-start sm:self-auto">
                    {course.difficulty_level}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Animated Gradient Background Component
function AnimatedGradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = React.use(searchParams);
  
  const [initialCourses, setInitialCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const {
    courses,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    loadMore
  } = useCourseSearch(initialCourses);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setIsLoading(true);
        
        const [coursesResult, categoriesResult, tagsResult] = await Promise.all([
          getCoursesAction({
            is_published: true,
            category_slug: resolvedSearchParams.category,
            limit: 50
          }),
          getCategoriesAction(),
          getTagsAction()
        ]);

        setInitialCourses(coursesResult.courses || []);
        setCategories(categoriesResult.categories || []);
        setAvailableTags(tagsResult.tags || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [resolvedSearchParams.category]);

  useEffect(() => {
    const urlFilters = {
      searchQuery: resolvedSearchParams.search || '',
      category_slug: resolvedSearchParams.category || '',
      difficulty: resolvedSearchParams.difficulty || '',
      content_type: resolvedSearchParams.content_type || '',
      price_range: resolvedSearchParams.price_range || '',
      min_rating: parseFloat(resolvedSearchParams.min_rating || '0'),
      sort_by: resolvedSearchParams.sort_by || 'relevance'
    };
    
    if (Object.values(urlFilters).some(value => value !== '' && value !== 0)) {
      updateFilters(urlFilters);
      setSearchQuery(urlFilters.searchQuery);
    }
  }, [resolvedSearchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchQuery: searchQuery });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateFilters({ searchQuery: searchQuery });
    }
  };

  // Calculate stats
  const totalCourses = pagination.total;
  const totalCategories = categories.length;
  const totalTags = availableTags.length;
  const featuredCourses = courses.filter(course => course.is_featured).length;

  const stats = {
    courses: totalCourses,
    categories: totalCategories,
    featured: featuredCourses,
    skills: totalTags
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="relative inline-block">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
              <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading amazing courses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Animated Gradient Background */}
      <AnimatedGradientBackground>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Explore Courses
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Discover your next learning adventure in our comprehensive learning platform
                </p>
              </div>

              {/* Hero Section with Text Slider and Stats */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Text Slider */}
                <div className="lg:col-span-1">
                  <TextSlider />
                </div>

                {/* Stats Cards - Now 2x2 grid */}
                <div className="lg:col-span-1">
                  <StatsCards stats={stats} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedGradientBackground>

      {/* Search Bar - Now outside the dark background */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <Input
              type="text"
              placeholder="Search courses, technologies, instructors... (Press Enter to search)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-16 pr-6 py-6 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition text-gray-900 placeholder-gray-500 shadow-lg"
            />
          </form>
        </div>
      </div>

      {/* Rest of the content with normal background */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Mobile Toggle */}
            <div className="lg:hidden">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full flex items-center gap-2 mb-4"
              >
                <Filter size={20} />
                Filters
                {hasActiveFilters(filters) && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFilterCount(filters)}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Sidebar Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0 space-y-6`}>
              {/* Categories Card */}
              <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden border border-gray-200">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    <CategoryNavigation 
                      showCourseCounts={true}
                      className="p-4"
                      currentCategory={filters.category_slug}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Filters */}
              <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden border border-gray-200">
                <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Filter className="h-5 w-5 text-purple-600" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <CourseFilters
                    filters={filters}
                    onFiltersChange={updateFilters}
                    onReset={resetFilters}
                    availableTags={availableTags}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-2">
                    {filters.category_slug ? (
                      <>
                        <Sparkles className="h-6 w-6 text-blue-600 inline mr-2" />
                        {categories.find(cat => cat.slug === filters.category_slug)?.name}
                      </>
                    ) : filters.searchQuery ? (
                      <>Search: "{filters.searchQuery}"</>
                    ) : (
                      <>All Courses</>
                    )}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Discovering courses...
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-gray-900">{courses.length}</span>
                        {courses.length === 1 ? ' course' : ' courses'} found
                        {hasActiveFilters(filters) && (
                          <span className="text-blue-600 ml-2">• Filtered</span>
                        )}
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <ViewToggle view={view} onViewChange={setView} />
                  
                  {/* Clear Filters */}
                  {hasActiveFilters(filters) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="rounded-lg border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {/* Error State */}
              {error && (
                <Card className="mb-6 border-red-200 bg-red-50 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-red-700 font-medium">Error: {error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {loading && courses.length === 0 && (
                <div className="text-center py-16 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="relative inline-block mb-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">Loading courses...</p>
                </div>
              )}

              {/* Courses Grid/List */}
              {courses.length > 0 ? (
                <>
                  {view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {courses.map((course) => (
                        <PremiumCourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : (
                    <CourseListView courses={courses} />
                  )}

                  {/* Load More Button */}
                  {pagination.hasMore && (
                    <div className="text-center mt-12">
                      <Button
                        onClick={loadMore}
                        disabled={loading}
                        className="min-w-48 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-0 px-8 py-3 font-semibold"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Loading More...
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4 mr-2" />
                            Load More Courses
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                /* No Results */
                <div className="text-center py-16 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {filters.searchQuery || hasActiveFilters(filters)
                      ? "Try adjusting your search criteria or browse all courses."
                      : "No courses available at the moment. Check back soon!"}
                  </p>
                  {(filters.searchQuery || hasActiveFilters(filters)) && (
                    <Button
                      onClick={resetFilters}
                      variant="outline"
                      className="rounded-lg"
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function hasActiveFilters(filters: any): boolean {
  return Object.keys(filters).some(key => {
    if (key === 'searchQuery') return filters[key] !== '';
    if (key === 'min_rating') return filters[key] > 0;
    if (key === 'tags') return filters[key].length > 0;
    if (key === 'is_featured' || key === 'is_trending') return filters[key];
    return filters[key] !== '';
  });
}

function getActiveFilterCount(filters: any): number {
  return Object.keys(filters).filter(key => {
    if (key === 'searchQuery') return filters[key] !== '';
    if (key === 'min_rating') return filters[key] > 0;
    if (key === 'tags') return filters[key].length > 0;
    if (key === 'is_featured' || key === 'is_trending') return filters[key];
    return filters[key] !== '';
  }).length;
}