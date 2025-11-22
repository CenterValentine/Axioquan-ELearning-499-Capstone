
// /app/courses/page.tsx (Modern Futuristic Redesign)

'use client';

import React, { useEffect } from 'react';
import { getCoursesAction } from '@/lib/courses/actions';
import { getCategoriesAction } from '@/lib/categories/actions';
import { getTagsAction } from '@/lib/tags/actions';
import { CourseGrid } from '@/components/courses/course-grid';
import { CategoryNavigation } from '@/components/categories/category-navigation';
import { SearchBar } from '@/components/courses/search-bar';
import { CourseFilters } from '@/components/courses/course-filters';
import { useCourseSearch } from '@/hooks/use-course-search';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, TrendingUp, Users, Star, Zap } from 'lucide-react';

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

interface ExtendedCategoryNavigationProps {
  showCourseCounts: boolean;
  className: string;
  currentCategory?: string;
}

export default function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = React.use(searchParams);
  
  const [initialCourses, setInitialCourses] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [availableTags, setAvailableTags] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  function CourseSearchContent() {
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
      }
    }, [resolvedSearchParams]);

    const handleSearch = (query: string) => {
      updateFilters({ searchQuery: query });
    };

    const categoryNavProps: ExtendedCategoryNavigationProps & { currentCategory?: string } = {
      showCourseCounts: true,
      className: "max-h-96 overflow-y-auto",
      currentCategory: filters.category_slug
    };

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto text-center py-20">
              <div className="relative inline-block">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
                <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <p className="text-gray-600 text-lg font-medium">Loading future of learning...</p>
            </div>
          </div>
        </div>
      );
    }

    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <div className="text-center mb-12 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Explore Courses
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Dive into the future of learning with our curated collection of cutting-edge courses. 
                Transform your skills with AI-powered education.
              </p>
              
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{availableTags.length}</div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search courses, technologies, instructors, or concepts..."
                initialValue={filters.searchQuery}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Enhanced Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Categories Card */}
                <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      Categories
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Explore by field
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      <CategoryNavigation 
                        showCourseCounts={true}
                        className="p-4"
                        currentCategory={filters.category_slug}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Filters */}
                <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Zap className="h-5 w-5 text-purple-600" />
                      Smart Filters
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Refine your search
                    </CardDescription>
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

                {/* Quick Stats Enhanced */}
                <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
                  <CardHeader className="pb-4 border-b border-white/10">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-300" />
                      Learning Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <span className="text-blue-200">Active Results</span>
                      <span className="font-bold text-white">{courses.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <span className="text-blue-200">Categories</span>
                      <span className="font-bold text-white">{categories.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <span className="text-blue-200">Skills Available</span>
                      <span className="font-bold text-white">{availableTags.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Main Content */}
              <div className="lg:col-span-3">
                {/* Enhanced Results Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-2">
                      {filters.category_slug ? (
                        <>
                          <Sparkles className="h-6 w-6 text-blue-600 inline mr-2" />
                          {categories.find(cat => cat.slug === filters.category_slug)?.name}
                        </>
                      ) : filters.searchQuery ? (
                        <>Search: "{filters.searchQuery}"</>
                      ) : (
                        <>All Learning Paths</>
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
                          <span className="font-semibold text-gray-900">{pagination.total}</span>
                          {pagination.total === 1 ? ' course' : ' courses'} available
                          {hasActiveFilters(filters) && (
                            <span className="text-blue-600 ml-2">• Filtered</span>
                          )}
                        </>
                      )}
                    </p>
                  </div>

                  {hasActiveFilters(filters) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="rounded-xl border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Enhanced Error State */}
                {error && (
                  <Card className="mb-6 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-red-700 font-medium">Error: {error}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Loading State */}
                {loading && courses.length === 0 && (
                  <div className="text-center py-16 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100">
                    <div className="relative inline-block mb-4">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                      <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium">Scanning knowledge base...</p>
                  </div>
                )}

                {/* Enhanced Courses Grid */}
                <div className="mb-8">
                  <CourseGrid 
                    courses={courses}
                    showInstructor={true}
                    showActions={false}
                    emptyMessage={
                      filters.searchQuery || hasActiveFilters(filters)
                        ? "No courses match your cosmic criteria. Try expanding your search universe."
                        : "The learning galaxy is being populated. Prepare for launch soon!"
                    }
                  />
                </div>

                {/* Enhanced Load More Button */}
                {pagination.hasMore && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={loadMore}
                      disabled={loading}
                      className="min-w-48 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-0 px-8 py-3 font-semibold"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading Wisdom...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Load More Courses
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
      </div>
    );
  }

  return <CourseSearchContent />;
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





// // /app/courses/page.tsx (Updated for Next.js 16)

// 'use client';

// import React, { useEffect } from 'react';
// import { getCoursesAction } from '@/lib/courses/actions';
// import { getCategoriesAction } from '@/lib/categories/actions';
// import { getTagsAction } from '@/lib/tags/actions';
// import { CourseGrid } from '@/components/courses/course-grid';
// import { CategoryNavigation } from '@/components/categories/category-navigation';
// import { SearchBar } from '@/components/courses/search-bar';
// import { CourseFilters } from '@/components/courses/course-filters';
// import { useCourseSearch } from '@/hooks/use-course-search';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Loader2 } from 'lucide-react';

// interface CoursesPageProps {
//   searchParams: Promise<{
//     category?: string;
//     search?: string;
//     difficulty?: string;
//     content_type?: string;
//     price_range?: string;
//     min_rating?: string;
//     sort_by?: string;
//   }>;
// }

// // Update CategoryNavigationProps interface to include currentCategory
// interface ExtendedCategoryNavigationProps {
//   showCourseCounts: boolean;
//   className: string;
//   currentCategory?: string;
// }

// export default function CoursesPage({ searchParams }: CoursesPageProps) {
//   // Use React.use() to unwrap the searchParams Promise
//   const resolvedSearchParams = React.use(searchParams);
  
//   // Fetch initial data on client side
//   const [initialCourses, setInitialCourses] = React.useState<any[]>([]);
//   const [categories, setCategories] = React.useState<any[]>([]);
//   const [availableTags, setAvailableTags] = React.useState<any[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true);

//   // Fetch initial data
//   useEffect(() => {
//     async function fetchInitialData() {
//       try {
//         setIsLoading(true);
        
//         const [coursesResult, categoriesResult, tagsResult] = await Promise.all([
//           getCoursesAction({
//             is_published: true,
//             category_slug: resolvedSearchParams.category,
//             limit: 50
//           }),
//           getCategoriesAction(),
//           getTagsAction()
//         ]);

//         setInitialCourses(coursesResult.courses || []);
//         setCategories(categoriesResult.categories || []);
//         setAvailableTags(tagsResult.tags || []);
//       } catch (error) {
//         console.error('Error fetching initial data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchInitialData();
//   }, [resolvedSearchParams.category]);

//   function CourseSearchContent() {
//     const {
//       courses,
//       loading,
//       error,
//       filters,
//       pagination,
//       updateFilters,
//       resetFilters,
//       loadMore,
//       searchCourses
//     } = useCourseSearch(initialCourses);

//     // Initialize with URL params
//     useEffect(() => {
//       const urlFilters = {
//         searchQuery: resolvedSearchParams.search || '',
//         category_slug: resolvedSearchParams.category || '',
//         difficulty: resolvedSearchParams.difficulty || '',
//         content_type: resolvedSearchParams.content_type || '',
//         price_range: resolvedSearchParams.price_range || '',
//         min_rating: parseFloat(resolvedSearchParams.min_rating || '0'),
//         sort_by: resolvedSearchParams.sort_by || 'relevance'
//       };
      
//       if (Object.values(urlFilters).some(value => value !== '' && value !== 0)) {
//         updateFilters(urlFilters);
//       }
//     }, [resolvedSearchParams]);

//     const handleSearch = (query: string) => {
//       updateFilters({ searchQuery: query });
//     };

//     // Create extended category navigation props
//     const categoryNavProps: ExtendedCategoryNavigationProps & { currentCategory?: string } = {
//       showCourseCounts: true,
//       className: "max-h-96 overflow-y-auto",
//       currentCategory: filters.category_slug
//     };

//     if (isLoading) {
//       return (
//         <div className="container mx-auto px-4 py-8">
//           <div className="max-w-7xl mx-auto text-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
//             <p className="text-gray-600">Loading courses...</p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">
//               Explore Our Courses
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Discover amazing courses taught by expert instructors. Start your learning journey today!
//             </p>
//           </div>

//           {/* Search Bar */}
//           <div className="max-w-2xl mx-auto mb-8">
//             <SearchBar
//               onSearch={handleSearch}
//               placeholder="Search courses by title, description, tags, or instructor..."
//               initialValue={filters.searchQuery}
//             />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             {/* Sidebar with Categories and Filters */}
//             <div className="lg:col-span-1 space-y-6">
//               {/* Categories */}
//               <Card>
//               <CardHeader>
//                 <CardTitle>Categories</CardTitle>
//                 <CardDescription>
//                   Browse by category
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <CategoryNavigation 
//                   showCourseCounts={true}
//                   className="max-h-96 overflow-y-auto"
//                   currentCategory={filters.category_slug} // This prop now works
//                 />
//               </CardContent>
//             </Card>

//               {/* Advanced Filters */}
//               <CourseFilters
//                 filters={filters}
//                 onFiltersChange={updateFilters}
//                 onReset={resetFilters}
//                 availableTags={availableTags}
//               />

//               {/* Quick Stats */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Platform Stats</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span>Showing:</span>
//                     <span className="font-semibold">{courses.length} of {pagination.total}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Categories:</span>
//                     <span className="font-semibold">{categories.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Tags:</span>
//                     <span className="font-semibold">{availableTags.length}</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Courses Grid */}
//             <div className="lg:col-span-3">
//               {/* Results Header */}
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     {filters.category_slug ? (
//                       <>Category: {categories.find(cat => cat.slug === filters.category_slug)?.name}</>
//                     ) : filters.searchQuery ? (
//                       <>Search Results for "{filters.searchQuery}"</>
//                     ) : (
//                       <>All Courses</>
//                     )}
//                   </h2>
//                   <p className="text-gray-600 mt-1">
//                     {loading ? (
//                       'Searching...'
//                     ) : (
//                       <>
//                         {/* {pagination.total} course{pagination.total !== 1 ? 's' : ''} found
//                         {hasActiveFilters(filters) && ' (filtered)'} */}
//                       </>
//                     )}
//                   </p>
//                 </div>

//                 {/* Active Filters */}
//                 {hasActiveFilters(filters) && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={resetFilters}
//                   >
//                     Clear Filters
//                   </Button>
//                 )}
//               </div>

//               {/* Error State */}
//               {error && (
//                 <Card className="mb-6 border-red-200 bg-red-50">
//                   <CardContent className="p-4">
//                     <p className="text-red-700">Error: {error}</p>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Loading State */}
//               {loading && courses.length === 0 && (
//                 <div className="text-center py-12">
//                   <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
//                   <p className="text-gray-600">Searching courses...</p>
//                 </div>
//               )}

//               {/* Courses Grid */}
//               <CourseGrid 
//                 courses={courses}
//                 showInstructor={true}
//                 showActions={false}
//                 emptyMessage={
//                   filters.searchQuery || hasActiveFilters(filters)
//                     ? "No courses found matching your criteria. Try adjusting your filters."
//                     : "No courses available yet. Check back soon!"
//                 }
//               />

//               {/* Load More Button */}
//               {pagination.hasMore && (
//                 <div className="text-center mt-8">
//                   <Button
//                     onClick={loadMore}
//                     disabled={loading}
//                     variant="outline"
//                     className="min-w-32"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                         Loading...
//                       </>
//                     ) : (
//                       'Load More'
//                     )}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return <CourseSearchContent />;
// }

// // Helper function to check if any filters are active
// function hasActiveFilters(filters: any): boolean {
//   return Object.keys(filters).some(key => {
//     if (key === 'searchQuery') return filters[key] !== '';
//     if (key === 'min_rating') return filters[key] > 0;
//     if (key === 'tags') return filters[key].length > 0;
//     if (key === 'is_featured' || key === 'is_trending') return filters[key];
//     return filters[key] !== '';
//   });
// }














