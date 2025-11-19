// // /src/components/courses/course-card.tsx

// 'use client';

// import Link from 'next/link';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Course, CourseTag } from '@/types/courses';

// interface CourseCardProps {
//   course: Course;
//   showInstructor?: boolean;
//   showActions?: boolean;
//   onEdit?: (course: Course) => void;
//   onDelete?: (course: Course) => void;
//   onPublish?: (course: Course) => void;
//   onUnpublish?: (course: Course) => void;
// }

// export function CourseCard({ 
//   course, 
//   showInstructor = true,
//   showActions = false,
//   onEdit,
//   onDelete,
//   onPublish,
//   onUnpublish
// }: CourseCardProps) {
//   const formatPrice = (priceCents: number) => {
//     if (priceCents === 0) return 'Free';
//     return `$${(priceCents / 100).toFixed(2)}`;
//   };

//   const formatDuration = (minutes: number) => {
//     if (!minutes || minutes === 0) return '0m';
//     if (minutes < 60) return `${minutes}m`;
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
//   };

//   const getDifficultyColor = (level: string) => {
//     switch (level) {
//       case 'beginner': return 'bg-green-100 text-green-800';
//       case 'intermediate': return 'bg-yellow-100 text-yellow-800';
//       case 'advanced': return 'bg-red-100 text-red-800';
//       default: return 'bg-blue-100 text-blue-800';
//     }
//   };

//   return (
//     <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 w-full">
      
//       {/* Thumbnail */}
//       <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
//         {course.thumbnail_url ? (
//           <>
//             <img 
//               src={course.thumbnail_url} 
//               alt={course.title}
//               className="w-full h-full object-cover"
//             />
//             {/* Video play indicator */}
//             {course.promo_video_url && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
//                   <span className="text-white text-lg">▶</span>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
//             <span className="text-4xl">
//               {course.content_type === 'video' ? '🎥' : 
//                course.content_type === 'document' ? '📄' : '📚'}
//             </span>
//           </div>
//         )}
        
//         {/* Status badges */}
//         <div className="absolute top-2 left-2 flex flex-wrap gap-1">
//           {!course.is_published && (
//             <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
//               Draft
//             </Badge>
//           )}
//           {course.is_featured && (
//             <Badge variant="default" className="bg-purple-100 text-purple-800">
//               Featured
//             </Badge>
//           )}
//           <Badge variant="secondary" className={getDifficultyColor(course.difficulty_level)}>
//             {course.difficulty_level}
//           </Badge>
//         </div>

//         {/* Price */}
//         <div className="absolute top-2 right-2">
//           <Badge variant="default" className="bg-white text-gray-900 font-semibold">
//             {formatPrice(course.price_cents)}
//           </Badge>
//         </div>
//       </div>

//       <CardHeader className="flex-grow pb-3">
//         <div className="space-y-2">
//           {course.category_name && (
//             <Badge variant="outline" className="text-xs">
//               {course.category_name}
//             </Badge>
//           )}
//           <CardTitle className="line-clamp-2 text-lg">
//             <Link 
//               href={course.is_published ? `/courses/${course.slug}` : '#'}
//               className="hover:text-blue-600 transition-colors"
//             >
//               {course.title}
//             </Link>
//           </CardTitle>
//           {course.subtitle && (
//             <CardDescription className="line-clamp-2">
//               {course.subtitle}
//             </CardDescription>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="pb-3">
//         {course.short_description && (
//           <p className="text-sm text-gray-600 line-clamp-3 mb-3">
//             {course.short_description}
//           </p>
//         )}

//         {/* Tags */}
//         {course.tags && course.tags.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-3">
//             {course.tags.slice(0, 3).map(tag => (
//               <Badge 
//                 key={tag.id}
//                 variant="outline"
//                 className="text-xs"
//                 style={{ 
//                   backgroundColor: `${tag.color}20`,
//                   borderColor: tag.color,
//                   color: tag.color
//                 }}
//               >
//                 {tag.name}
//               </Badge>
//             ))}
//             {course.tags.length > 3 && (
//               <Badge variant="outline" className="text-xs">
//                 +{course.tags.length - 3}
//               </Badge>
//             )}
//           </div>
//         )}

//         {/* Course stats */}
//         <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
//           <div className="flex items-center space-x-1">
//             <span>📚</span>
//             <span>{course.total_lessons} lessons</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span>⏱️</span>
//             <span>{formatDuration(course.total_video_duration)}</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span>👥</span>
//             <span>{course.enrolled_students_count} students</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span>⭐</span>
//             <span>
//               {course.average_rating > 0 ? course.average_rating.toFixed(1) : 'New'}
//               {course.review_count > 0 && ` (${course.review_count})`}
//             </span>
//           </div>
//         </div>
//       </CardContent>

//       <CardFooter className="pt-0">
//         <div className="w-full flex justify-between items-center">
//           {showInstructor && (
//             <div className="text-sm text-gray-600">
//               By <span className="font-medium">{course.instructor_name}</span>
//             </div>
//           )}

//           {showActions ? (
//             <div className="flex space-x-2">
//               {!course.is_published ? (
//                 <Button
//                   size="sm"
//                   onClick={() => onPublish?.(course)}
//                   className="bg-green-600 hover:bg-green-700"
//                 >
//                   Publish
//                 </Button>
//               ) : (
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => onUnpublish?.(course)}
//                 >
//                   Unpublish
//                 </Button>
//               )}
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={() => onEdit?.(course)}
//               >
//                 Edit
//               </Button>
//               <Button
//                 size="sm"
//                 variant="destructive"
//                 onClick={() => onDelete?.(course)}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Delete
//               </Button>
//             </div>
//           ) : (
//             <Link href={course.is_published ? `/courses/${course.slug}` : '#'}>
//               <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
//                 {course.is_published ? 'View Course' : 'Preview'}
//               </Button>
//             </Link>
//           )}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }



























// /src/components/courses/course-card.tsx

'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course, CourseTag } from '@/types/courses';
import { List } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  showInstructor?: boolean;
  showActions?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onPublish?: (course: Course) => void;
  onUnpublish?: (course: Course) => void;
}

export function CourseCard({ 
  course, 
  showInstructor = true,
  showActions = false,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish
}: CourseCardProps) {
  const formatPrice = (priceCents: number) => {
    if (priceCents === 0) return 'Free';
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    if (!minutes || minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 w-full">
      
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
        {course.thumbnail_url ? (
          <>
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            {/* Video play indicator */}
            {course.promo_video_url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
                  <span className="text-white text-lg">▶</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-4xl">
              {course.content_type === 'video' ? '🎥' : 
               course.content_type === 'document' ? '📄' : '📚'}
            </span>
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {!course.is_published && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Draft
            </Badge>
          )}
          {course.is_featured && (
            <Badge variant="default" className="bg-purple-100 text-purple-800">
              Featured
            </Badge>
          )}
          <Badge variant="secondary" className={getDifficultyColor(course.difficulty_level)}>
            {course.difficulty_level}
          </Badge>
        </div>

        {/* Price */}
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="bg-white text-gray-900 font-semibold">
            {formatPrice(course.price_cents)}
          </Badge>
        </div>
      </div>

      <CardHeader className="flex-grow pb-3">
        <div className="space-y-2">
          {course.category_name && (
            <Badge variant="outline" className="text-xs">
              {course.category_name}
            </Badge>
          )}
          <CardTitle className="line-clamp-2 text-lg">
            <Link 
              href={course.is_published ? `/courses/${course.slug}` : '#'}
              className="hover:text-blue-600 transition-colors"
            >
              {course.title}
            </Link>
          </CardTitle>
          {course.subtitle && (
            <CardDescription className="line-clamp-2">
              {course.subtitle}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {course.short_description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {course.short_description}
          </p>
        )}

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag.id}
                variant="outline"
                className="text-xs"
                style={{ 
                  backgroundColor: `${tag.color}20`,
                  borderColor: tag.color,
                  color: tag.color
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Course stats */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <span>📚</span>
            <span>{course.total_lessons} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>⏱️</span>
            <span>{formatDuration(course.total_video_duration)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>👥</span>
            <span>{course.enrolled_students_count} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>⭐</span>
            <span>
              {course.average_rating > 0 ? course.average_rating.toFixed(1) : 'New'}
              {course.review_count > 0 && ` (${course.review_count})`}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full">
          {showInstructor && (
            <div className="flex items-center space-x-2 mb-3">
              {/* Instructor Image */}
              {course.instructor_image ? (
                <img 
                  src={course.instructor_image} 
                  alt={course.instructor_name || 'Instructor'}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
                </div>
              )}

              {/* Name */}
              <div className="text-sm text-gray-700">
                By <span className="font-medium">{course.instructor_name}</span>
              </div>
            </div>
          )}

          {showActions ? (
            <div className="flex flex-col gap-2">
              {/* Top Row - Primary Actions */}
              <div className="flex flex-wrap gap-2 justify-between">
                {/* Curriculum Button */}
                <Link href={`/dashboard/instructor/courses/${course.id}/curriculum`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 flex-1 min-w-[120px]"
                  >
                    <List className="h-3 w-3 mr-1" />
                    Curriculum
                  </Button>
                </Link>
                
                {/* Publish/Unpublish Button */}
                {!course.is_published ? (
                  <Button
                    size="sm"
                    onClick={() => onPublish?.(course)}
                    className="bg-green-600 hover:bg-green-700 flex-1 min-w-[100px]"
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUnpublish?.(course)}
                    className="flex-1 min-w-[100px]"
                  >
                    Unpublish
                  </Button>
                )}
              </div>

              {/* Bottom Row - Secondary Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(course)}
                  className="flex-1 min-w-[80px]"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete?.(course)}
                  className="flex-1 min-w-[80px] bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <Link href={course.is_published ? `/courses/${course.slug}` : '#'}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {course.is_published ? 'View Course' : 'Preview'}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}