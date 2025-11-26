
// /app/categories/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategoriesAction } from '@/lib/categories/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, BookOpen, ArrowRight, Star, Users, TrendingUp, Sparkles, Zap, Loader2, Grid3X3, List } from 'lucide-react';
import { Category } from '@/types/categories';
import { CategoryCard } from '@/components/categories/category-card';
import { Header } from '@/components/shell/header';
import { Footer } from '@/components/shell/footer';

// Fixed View Toggle Component
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

// Categories Display Component with Pagination
function CategoriesDisplay({ 
  categories, 
  view 
}: { 
  categories: Category[]; 
  view: 'grid' | 'list';
}) {
  const [visibleCount, setVisibleCount] = useState(12); // Show 12 initially
  const categoriesWithCourses = categories.filter(cat => (cat.course_count || 0) > 0);
  const displayedCategories = categoriesWithCourses.slice(0, visibleCount);
  const hasMore = visibleCount < categoriesWithCourses.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 12); // Load 12 more
  };

  return (
    <div className="space-y-6">
      {/* Display based on view */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCategories.map((category) => (
            <CategoryCard key={category.id} category={category} view="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedCategories.map((category) => (
            <CategoryCard key={category.id} category={category} view="list" />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            onClick={loadMore}
            variant="outline"
            className="min-w-32"
          >
            Load More Categories
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Showing {displayedCategories.length} of {categoriesWithCourses.length} categories
          </p>
        </div>
      )}

      {/* No categories message */}
      {categoriesWithCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No active categories yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We're working on adding courses to our categories. Check back soon for available learning paths!
          </p>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesResult = await getCategoriesAction();
        
        if (categoriesResult.success) {
          setCategories(categoriesResult.categories || []);
        } else {
          setError('Failed to load categories');
        }
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Calculate total stats from actual database data
  const categoriesWithCourses = categories.filter(cat => (cat.course_count || 0) > 0);
  const totalCourses = categoriesWithCourses.reduce((sum, cat) => sum + (cat.course_count || 0), 0);
  const featuredCategories = categoriesWithCourses.filter(cat => cat.is_featured);
  const totalCategoriesWithCourses = categoriesWithCourses.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Categories</h3>
            <p className="text-gray-600">Discovering amazing learning paths for you...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Error Loading Categories</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-300 mb-6">
                <Link href="/" className="hover:text-white flex items-center transition-colors">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white transition-colors">
                  Courses
                </Link>
                <span>/</span>
                <span className="text-white font-medium">Categories</span>
              </nav>

              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl bg-white/10 p-3 rounded-2xl">
                  <BookOpen className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    Explore Categories
                  </h1>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {totalCategoriesWithCourses} active categories
                    </Badge>
                    <Badge className="bg-blue-500 text-white border-0">
                      <Zap className="h-3 w-3 mr-1" />
                      {totalCourses} Courses
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xl text-gray-200 max-w-3xl leading-relaxed">
                Discover your perfect learning journey. Browse through our active categories 
                with available courses that match your interests and career goals.
              </p>
            </div>

            {/* Quick Stats - Using actual database data */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{totalCategoriesWithCourses}</div>
                <div className="text-sm text-gray-300">Active Categories</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{totalCourses}</div>
                <div className="text-sm text-gray-300">Total Courses</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{featuredCategories.length}</div>
                <div className="text-sm text-gray-300">Featured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Platform Info Card */}
            <Card className="bg-white border-2 border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <TrendingUp className="h-5 w-5" />
                  <span>Platform Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Active Learning</div>
                    <div className="text-sm text-gray-600">
                      {totalCourses} courses across {totalCategoriesWithCourses} categories
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Categories:</span>
                    <span className="font-semibold text-gray-900">{categories.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Categories with Courses:</span>
                    <span className="font-semibold text-gray-900">{totalCategoriesWithCourses}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Empty Categories:</span>
                    <span className="font-semibold text-gray-900">{categories.length - totalCategoriesWithCourses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-2 border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <Sparkles className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/courses">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse All Courses
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    My Learning Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Categories Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Active Learning Categories
                </h2>
                <p className="text-gray-600">
                  Explore <span className="font-semibold text-gray-900">{totalCategoriesWithCourses}</span> categories 
                  with <span className="font-semibold text-gray-900">{totalCourses}</span> available courses
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <ViewToggle view={view} onViewChange={setView} />
                
                {/* View All Courses Button */}
                <Link href="/courses">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>All Courses</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Categories Display with Pagination */}
            <CategoriesDisplay categories={categories} view={view} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}