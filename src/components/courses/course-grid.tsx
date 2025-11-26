
// // // /src/components/courses/course-grid.tsx

// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { 
//   Star, 
//   Clock, 
//   Users, 
//   PlayCircle, 
//   Sparkles, 
//   Zap,
//   BookOpen,
//   Target,
//   List
// } from 'lucide-react';
// import { Course } from '@/types/courses';

// interface CourseGridProps {
//   courses: Course[];
//   showInstructor?: boolean;
//   showActions?: boolean;
//   onEdit?: (course: Course) => void;
//   onDelete?: (course: Course) => void;
//   onPublish?: (course: Course) => void;
//   onUnpublish?: (course: Course) => void;
//   emptyMessage?: string;
// }

// export function CourseGrid({ 
//   courses, 
//   showInstructor = true,
//   showActions = false,
//   onEdit,
//   onDelete,
//   onPublish,
//   onUnpublish,
//   emptyMessage = "No courses found"
// }: CourseGridProps) {
//   if (!courses || courses.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <div className="max-w-md mx-auto">
//           <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//             <BookOpen className="h-10 w-10 text-blue-400" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Found</h3>
//           <p className="text-gray-600">{emptyMessage}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//       {courses.map((course, index) => (
//         <CourseCard 
//           key={course.id} 
//           course={course} 
//           showInstructor={showInstructor}
//           showActions={showActions}
//           onEdit={onEdit}
//           onDelete={onDelete}
//           onPublish={onPublish}
//           onUnpublish={onUnpublish}
//           index={index}
//         />
//       ))}
//     </div>
//   );
// }

// interface CourseCardProps {
//   course: Course;
//   showInstructor: boolean;
//   showActions: boolean;
//   onEdit?: (course: Course) => void;
//   onDelete?: (course: Course) => void;
//   onPublish?: (course: Course) => void;
//   onUnpublish?: (course: Course) => void;
//   index: number;
// }

// function CourseCard({ 
//   course, 
//   showInstructor, 
//   showActions, 
//   onEdit,
//   onDelete,
//   onPublish,
//   onUnpublish,
//   index 
// }: CourseCardProps) {
//   // Map your existing data structure to the new design
//   const difficultyColors = {
//     beginner: 'from-green-500 to-emerald-400',
//     intermediate: 'from-blue-500 to-cyan-400',
//     advanced: 'from-purple-500 to-pink-400',
//     expert: 'from-red-500 to-orange-400'
//   };

//   const contentTypeIcons = {
//     video: PlayCircle,
//     document: BookOpen,
//     interactive: Target,
//     mixed: Zap
//   };

//   const ContentIcon = contentTypeIcons[course.content_type as keyof typeof contentTypeIcons] || PlayCircle;

//   // Format data for the new design
//   const formatPrice = (priceCents: number) => {
//     if (priceCents === 0) return 'Free';
//     return `$${(priceCents / 100).toFixed(0)}`;
//   };

//   const formatDuration = (minutes: number) => {
//     if (!minutes || minutes === 0) return '0m';
//     if (minutes < 60) return `${minutes}m`;
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
//   };

//   return (
//     <Card className="group relative border-0 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
//       {/* Gradient Border Effect */}
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm group-hover:blur-md" />
//       <div className="absolute inset-[2px] rounded-3xl bg-white/80 backdrop-blur-sm" />
      
//       {/* Course Image/Thumbnail */}
//       <div className="relative h-48 overflow-hidden rounded-t-3xl">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 z-10" />
//         {course.thumbnail_url ? (
//           <img 
//             src={course.thumbnail_url} 
//             alt={course.title}
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           />
//         ) : (
//           <div className={`w-full h-full bg-gradient-to-br ${difficultyColors[course.difficulty_level as keyof typeof difficultyColors] || 'from-gray-500 to-gray-400'} flex items-center justify-center`}>
//             <ContentIcon className="h-16 w-16 text-white/80" />
//           </div>
//         )}
        
//         {/* Difficulty Badge */}
//         <div className="absolute top-4 left-4">
//           <span className={`px-3 py-1.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r ${difficultyColors[course.difficulty_level as keyof typeof difficultyColors] || 'from-gray-600 to-gray-500'} backdrop-blur-sm border border-white/20 shadow-lg`}>
//             {course.difficulty_level?.charAt(0).toUpperCase() + course.difficulty_level?.slice(1) || 'All Levels'}
//           </span>
//         </div>

//         {/* Featured Badge */}
//         {course.is_featured && (
//           <div className="absolute top-4 right-4">
//             <span className="px-3 py-1.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-400 backdrop-blur-sm border border-white/20 shadow-lg flex items-center gap-1">
//               <Sparkles className="h-3 w-3" />
//               Featured
//             </span>
//           </div>
//         )}

//         {/* Draft Badge */}
//         {!course.is_published && (
//           <div className="absolute top-4 right-4">
//             <span className="px-3 py-1.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-400 backdrop-blur-sm border border-white/20 shadow-lg">
//               Draft
//             </span>
//           </div>
//         )}

//         {/* Content Type Badge */}
//         <div className="absolute bottom-4 right-4">
//           <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center">
//             <ContentIcon className="h-5 w-5 text-gray-700" />
//           </div>
//         </div>
//       </div>

//       {/* Card Content */}
//       <CardContent className="relative pt-6 pb-4 px-5">
//         {/* Category */}
//         {course.category_name && (
//           <div className="mb-2">
//             <span className="px-2.5 py-1 rounded-xl text-xs font-medium text-gray-600 bg-gray-100/80 border border-gray-200">
//               {course.category_name}
//             </span>
//           </div>
//         )}

//         {/* Course Title with Link */}
//         <Link href={course.is_published ? `/courses/${course.slug}` : '#'}>
//           <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-gray-800 transition-colors hover:text-blue-600 cursor-pointer">
//             {course.title}
//           </h3>
//         </Link>

//         {/* Course Description */}
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
//           {course.short_description || course.subtitle || 'Explore this comprehensive course designed to enhance your skills and knowledge.'}
//         </p>

//         {/* Instructor */}
//         {showInstructor && (
//           <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
//             {/* Instructor Image - Using course.instructor_image like in the old design */}
//             {course.instructor_image ? (
//               <img 
//                 src={course.instructor_image} 
//                 alt={course.instructor_name || 'Instructor'}
//                 className="w-8 h-8 rounded-full object-cover border border-gray-200"
//               />
//             ) : (
//               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
//                 {course.instructor_name?.charAt(0) || 'I'}
//               </div>
//             )}
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 truncate">
//                 {course.instructor_name || 'Unknown Instructor'}
//               </p>
//               <p className="text-xs text-gray-500 truncate">
//                 Course Instructor
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Course Stats */}
//         <div className="flex items-center justify-between mb-4">
//           {/* Rating */}
//           <div className="flex items-center gap-1.5">
//             <div className="flex items-center gap-1">
//               <Star className="h-4 w-4 text-yellow-400 fill-current" />
//               <span className="text-sm font-semibold text-gray-900">
//                 {course.average_rating > 0 ? course.average_rating.toFixed(1) : 'New'}
//               </span>
//             </div>
//             {course.review_count > 0 && (
//               <span className="text-xs text-gray-500">
//                 ({course.review_count})
//               </span>
//             )}
//           </div>

//           {/* Duration */}
//           <div className="flex items-center gap-1.5 text-gray-600">
//             <Clock className="h-4 w-4" />
//             <span className="text-sm">{formatDuration(course.total_video_duration)}</span>
//           </div>

//           {/* Students */}
//           <div className="flex items-center gap-1.5 text-gray-600">
//             <Users className="h-4 w-4" />
//             <span className="text-sm">{course.enrolled_students_count || '0'}</span>
//           </div>
//         </div>

//         {/* Additional Course Info */}
//         <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
//           <div className="flex items-center space-x-1">
//             <span>📚</span>
//             <span>{course.total_lessons || 0} lessons</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span>⭐</span>
//             <span>
//               {course.average_rating > 0 ? course.average_rating.toFixed(1) : 'New'}
//               {course.review_count > 0 && ` (${course.review_count})`}
//             </span>
//           </div>
//         </div>

//         {/* Price & Actions */}
//         <div className="flex items-center justify-between">
//           {/* Price */}
//           <div className="flex items-baseline gap-2">
//             {course.price_cents === 0 ? (
//               <span className="text-2xl font-bold text-green-600">Free</span>
//             ) : (
//               <span className="text-2xl font-bold text-gray-900">{formatPrice(course.price_cents)}</span>
//             )}
//           </div>

//           {/* Action Buttons */}
//           {showActions ? (
//             <div className="flex flex-col gap-2 w-full max-w-[200px]">
//               {/* Top Row - Primary Actions */}
//               <div className="flex flex-wrap gap-2">
//                 {/* Curriculum Button */}
//                 <Link href={`/dashboard/instructor/courses/${course.id}/curriculum`} className="flex-1 min-w-[100px]">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="w-full rounded-2xl border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-semibold"
//                   >
//                     <List className="h-3 w-3 mr-1" />
//                     Curriculum
//                   </Button>
//                 </Link>
                
//                 {/* Publish/Unpublish Button */}
//                 {!course.is_published ? (
//                   <Button
//                     size="sm"
//                     onClick={() => onPublish?.(course)}
//                     className="flex-1 min-w-[80px] rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg border-0 font-semibold"
//                   >
//                     Publish
//                   </Button>
//                 ) : (
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => onUnpublish?.(course)}
//                     className="flex-1 min-w-[80px] rounded-2xl border-gray-300 hover:bg-gray-50"
//                   >
//                     Unpublish
//                   </Button>
//                 )}
//               </div>

//               {/* Bottom Row - Secondary Actions */}
//               <div className="flex flex-wrap gap-2">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => onEdit?.(course)}
//                   className="flex-1 min-w-[70px] rounded-2xl border-gray-300 hover:bg-gray-50"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   onClick={() => onDelete?.(course)}
//                   className="flex-1 min-w-[70px] rounded-2xl bg-red-500 hover:bg-red-600 text-white border-0"
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <Link href={course.is_published ? `/courses/${course.slug}` : '#'}>
//               <Button className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-0 px-6 font-semibold">
//                 {course.is_published ? 'View Course' : 'Preview'}
//               </Button>
//             </Link>
//           )}
//         </div>

//         {/* Tags */}
//         {course.tags && course.tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-4">
//             {course.tags.slice(0, 3).map((tag: any) => (
//               <span 
//                 key={tag.id}
//                 className="px-2.5 py-1 rounded-xl text-xs font-medium text-gray-600 bg-gray-100/80 border border-gray-200 backdrop-blur-sm"
//                 style={{ 
//                   backgroundColor: `${tag.color}20`,
//                   borderColor: tag.color,
//                   color: tag.color
//                 }}
//               >
//                 {tag.name}
//               </span>
//             ))}
//             {course.tags.length > 3 && (
//               <span className="px-2.5 py-1 rounded-xl text-xs font-medium text-gray-500 bg-gray-100/80 border border-gray-200">
//                 +{course.tags.length - 3}
//               </span>
//             )}
//           </div>
//         )}
//       </CardContent>

//       {/* Hover Glow Effect */}
//       <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
//     </Card>
//   );
// }















// /components/courses/course-grid.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Clock, 
  Users, 
  PlayCircle, 
  Sparkles, 
  Zap,
  BookOpen,
  Target,
  List,
  Heart,
  Share2,
  Eye
} from 'lucide-react';
import { Course } from '@/types/courses';
import { LikeButton } from '@/components/social/like-button';
import { ShareButton } from '@/components/social/share-button';

interface CourseGridProps {
  courses: Course[];
  showInstructor?: boolean;
  showActions?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onPublish?: (course: Course) => void;
  onUnpublish?: (course: Course) => void;
  emptyMessage?: string;
}

export function CourseGrid({ 
  courses, 
  showInstructor = true,
  showActions = false,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  emptyMessage = "No courses found"
}: CourseGridProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Found</h3>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          showInstructor={showInstructor}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          index={index}
        />
      ))}
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  showInstructor: boolean;
  showActions: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onPublish?: (course: Course) => void;
  onUnpublish?: (course: Course) => void;
  index: number;
}

function CourseCard({ 
  course, 
  showInstructor, 
  showActions, 
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  index 
}: CourseCardProps) {
  // Map your existing data structure to the new design
  const difficultyColors = {
    beginner: 'from-green-500 to-emerald-400',
    intermediate: 'from-blue-500 to-cyan-400',
    advanced: 'from-purple-500 to-pink-400',
    expert: 'from-red-500 to-orange-400'
  };

  const contentTypeIcons = {
    video: PlayCircle,
    document: BookOpen,
    interactive: Target,
    mixed: Zap
  };

  const ContentIcon = contentTypeIcons[course.content_type as keyof typeof contentTypeIcons] || PlayCircle;

  // Format data for the new design
  const formatPrice = (priceCents: number) => {
    if (priceCents === 0) return 'Free';
    return `$${(priceCents / 100).toFixed(0)}`;
  };

  const formatDuration = (minutes: number) => {
    if (!minutes || minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card className="group relative border-0 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm group-hover:blur-md" />
      <div className="absolute inset-[2px] rounded-3xl bg-white/80 backdrop-blur-sm" />
      
      {/* Course Image/Thumbnail */}
      <div className="relative h-48 overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 z-10" />
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${difficultyColors[course.difficulty_level as keyof typeof difficultyColors] || 'from-gray-500 to-gray-400'} flex items-center justify-center`}>
            <ContentIcon className="h-16 w-16 text-white/80" />
          </div>
        )}
        
        {/* Difficulty Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r ${difficultyColors[course.difficulty_level as keyof typeof difficultyColors] || 'from-gray-600 to-gray-500'} backdrop-blur-sm border border-white/20 shadow-lg`}>
            {course.difficulty_level?.charAt(0).toUpperCase() + course.difficulty_level?.slice(1) || 'All Levels'}
          </span>
        </div>

        {/* Featured Badge */}
        {course.is_featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-400 backdrop-blur-sm border border-white/20 shadow-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          </div>
        )}

        {/* Draft Badge */}
        {!course.is_published && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-400 backdrop-blur-sm border border-white/20 shadow-lg">
              Draft
            </span>
          </div>
        )}

        {/* Content Type Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center">
            <ContentIcon className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="relative pt-6 pb-4 px-5">
        {/* Category */}
        {course.category_name && (
          <div className="mb-2">
            <span className="px-2.5 py-1 rounded-xl text-xs font-medium text-gray-600 bg-gray-100/80 border border-gray-200">
              {course.category_name}
            </span>
          </div>
        )}

        {/* Course Title with Link */}
        <Link href={course.is_published ? `/courses/${course.slug}` : '#'}>
          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-gray-800 transition-colors hover:text-blue-600 cursor-pointer">
            {course.title}
          </h3>
        </Link>

        {/* Course Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {course.short_description || course.subtitle || 'Explore this comprehensive course designed to enhance your skills and knowledge.'}
        </p>

        {/* Social Engagement Stats */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-red-500">
              <Heart size={14} className="fill-red-500" />
              <span className="text-xs font-semibold">{course.like_count || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500">
              <Share2 size={14} />
              <span className="text-xs font-semibold">{course.share_count || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-500">
              <Eye size={14} />
              <span className="text-xs font-semibold">{course.total_views || 0}</span>
            </div>
          </div>
        </div>

        {/* Instructor */}
        {showInstructor && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
            {/* Instructor Image - Using course.instructor_image like in the old design */}
            {course.instructor_image ? (
              <img 
                src={course.instructor_image} 
                alt={course.instructor_name || 'Instructor'}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                {course.instructor_name?.charAt(0) || 'I'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {course.instructor_name || 'Unknown Instructor'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Course Instructor
              </p>
            </div>
          </div>
        )}

        {/* Course Stats */}
        <div className="flex items-center justify-between mb-4">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-gray-900">
                {course.average_rating > 0 ? course.average_rating.toFixed(1) : 'New'}
              </span>
            </div>
            {course.review_count > 0 && (
              <span className="text-xs text-gray-500">
                ({course.review_count})
              </span>
            )}
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formatDuration(course.total_video_duration)}</span>
          </div>

          {/* Students */}
          <div className="flex items-center gap-1.5 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm">{course.enrolled_students_count || '0'}</span>
          </div>
        </div>

        {/* Additional Course Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <span>📚</span>
            <span>{course.total_lessons || 0} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>⭐</span>
            <span>
              {course.average_rating > 0 ? course.average_rating.toFixed(1) : 'New'}
              {course.review_count > 0 && ` (${course.review_count})`}
            </span>
          </div>
        </div>

        {/* Social Actions */}
        <div className="flex gap-2 mb-4">
          <LikeButton 
            courseId={course.id}
            initialLikeCount={course.like_count || 0}
            size="sm"
            showCount={true}
            className="flex-1"
          />
          <ShareButton 
            courseId={course.id}
            courseTitle={course.title}
            initialShareCount={course.share_count || 0}
            size="sm"
            showCount={true}
            className="flex-1"
          />
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            {course.price_cents === 0 ? (
              <span className="text-2xl font-bold text-green-600">Free</span>
            ) : (
              <span className="text-2xl font-bold text-gray-900">{formatPrice(course.price_cents)}</span>
            )}
          </div>

          {/* Action Buttons */}
          {showActions ? (
            <div className="flex flex-col gap-2 w-full max-w-[200px]">
              {/* Top Row - Primary Actions */}
              <div className="flex flex-wrap gap-2">
                {/* Curriculum Button */}
                <Link href={`/dashboard/instructor/courses/${course.id}/curriculum`} className="flex-1 min-w-[100px]">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full rounded-2xl border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-semibold"
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
                    className="flex-1 min-w-[80px] rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg border-0 font-semibold"
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUnpublish?.(course)}
                    className="flex-1 min-w-[80px] rounded-2xl border-gray-300 hover:bg-gray-50"
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
                  className="flex-1 min-w-[70px] rounded-2xl border-gray-300 hover:bg-gray-50"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete?.(course)}
                  className="flex-1 min-w-[70px] rounded-2xl bg-red-500 hover:bg-red-600 text-white border-0"
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <Link href={course.is_published ? `/courses/${course.slug}` : '#'}>
              <Button className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-0 px-6 font-semibold">
                {course.is_published ? 'View Course' : 'Preview'}
              </Button>
            </Link>
          )}
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {course.tags.slice(0, 3).map((tag: any) => (
              <span 
                key={tag.id}
                className="px-2.5 py-1 rounded-xl text-xs font-medium text-gray-600 bg-gray-100/80 border border-gray-200 backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${tag.color}20`,
                  borderColor: tag.color,
                  color: tag.color
                }}
              >
                {tag.name}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-medium text-gray-500 bg-gray-100/80 border border-gray-200">
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
}