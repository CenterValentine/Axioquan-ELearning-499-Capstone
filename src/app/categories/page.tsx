// // /app/categories/page.tsx (Enhanced)

// import { getCategoriesAction } from '@/lib/categories/actions';
// import { CategoryNavigation } from '@/components/categories/category-navigation';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import Link from 'next/link';
// import { Home, BookOpen } from 'lucide-react';

// export default async function CategoriesPage() {
//   const categoriesResult = await getCategoriesAction();
//   const categories = categoriesResult.categories || [];

//   const featuredCategories = categories.filter(cat => cat.is_featured);
//   const totalCourses = categories.reduce((sum, cat) => sum + (cat.course_count || 0), 0);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
//             <Link href="/" className="hover:text-gray-700 flex items-center">
//               <Home className="h-4 w-4 mr-1" />
//               Home
//             </Link>
//             <span>/</span>
//             <Link href="/courses" className="hover:text-gray-700">
//               Courses
//             </Link>
//             <span>/</span>
//             <span className="text-gray-900 font-medium">Categories</span>
//           </nav>

//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Course Categories
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Browse our {categories.length} categories with {totalCourses} total courses. Find the perfect learning path for your interests.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Categories Navigation */}
//           <div className="lg:col-span-1">
//             <Card>
//               <CardHeader>
//                 <CardTitle>All Categories</CardTitle>
//                 <CardDescription>
//                   {categories.length} categories, {totalCourses} courses
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <CategoryNavigation 
//                   showCourseCounts={true}
//                   className="max-h-96 overflow-y-auto"
//                 />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Featured Categories Grid */}
//           <div className="lg:col-span-3">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {featuredCategories.map(category => (
//                 <Link key={category.id} href={`/categories/${category.slug}`}>
//                   <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group border-2 border-transparent hover:border-blue-200">
//                     <CardHeader className="pb-3">
//                       <div className="flex items-center space-x-3">
//                         {category.icon && (
//                           <span 
//                             className="text-2xl group-hover:scale-110 transition-transform"
//                             style={{ color: category.color }}
//                           >
//                             {category.icon}
//                           </span>
//                         )}
//                         <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
//                           {category.name}
//                         </CardTitle>
//                       </div>
//                       <CardDescription className="line-clamp-2">
//                         {category.description || `Explore ${category.course_count} courses in ${category.name}`}
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="flex items-center justify-between">
//                         <Badge 
//                           variant="secondary"
//                           style={{ 
//                             backgroundColor: `${category.color}20`,
//                             borderColor: category.color,
//                             color: category.color
//                           }}
//                         >
//                           {category.course_count} course{category.course_count !== 1 ? 's' : ''}
//                         </Badge>
//                         <Button variant="ghost" size="sm" className="group-hover:bg-blue-50">
//                           <BookOpen className="h-4 w-4 mr-1" />
//                           Explore
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               ))}
//             </div>

//             {featuredCategories.length === 0 && (
//               <Card>
//                 <CardContent className="text-center py-12">
//                   <div className="text-6xl mb-4">📚</div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured categories</h3>
//                   <p className="text-gray-600">Featured categories will appear here once they are marked as featured.</p>
//                   <Link href="/courses" className="inline-block mt-4">
//                     <Button>Browse All Courses</Button>
//                   </Link>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }































// /app/categories/page.tsx (Enhanced)

import { getCategoriesAction } from '@/lib/categories/actions';
import { CategoryNavigation } from '@/components/categories/category-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Home, BookOpen } from 'lucide-react';
import { Suspense } from 'react'; // ✅ Added

export default async function CategoriesPage() {
  const categoriesResult = await getCategoriesAction();
  const categories = categoriesResult.categories || [];

  const featuredCategories = categories.filter(cat => cat.is_featured);
  const totalCourses = categories.reduce((sum, cat) => sum + (cat.course_count || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-gray-700">
              Courses
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Categories</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Course Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our {categories.length} categories with {totalCourses} total courses. 
            Find the perfect learning path for your interests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>All Categories</CardTitle>
                <CardDescription>
                  {categories.length} categories, {totalCourses} courses
                </CardDescription>
              </CardHeader>
              <CardContent>

                {/* ✅ FIX APPLIED HERE */}
                <Suspense fallback={<div>Loading filters...</div>}>
                  <CategoryNavigation 
                    showCourseCounts={true}
                    className="max-h-96 overflow-y-auto"
                  />
                </Suspense>
                {/* END FIX */}

              </CardContent>
            </Card>
          </div>

          {/* Featured Categories Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredCategories.map(category => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group border-2 border-transparent hover:border-blue-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        {category.icon && (
                          <span 
                            className="text-2xl group-hover:scale-110 transition-transform"
                            style={{ color: category.color }}
                          >
                            {category.icon}
                          </span>
                        )}
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {category.description || `Explore ${category.course_count} courses in ${category.name}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
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
                        <Button variant="ghost" size="sm" className="group-hover:bg-blue-50">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Explore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {featuredCategories.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured categories</h3>
                  <p className="text-gray-600">
                    Featured categories will appear here once they are marked as featured.
                  </p>
                  <Link href="/courses" className="inline-block mt-4">
                    <Button>Browse All Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
