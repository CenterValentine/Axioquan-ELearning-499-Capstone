// this could and should be moved to shell folder or even possibly an instructor folder
// /components/dashboard/InstructorTabNavigation.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText,
  Plus,
  List 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const instructorItems = [
  {
    title: 'Overview',
    href: '/dashboard/instructor',
    icon: LayoutDashboard
  },
  {
    title: 'My Courses',
    href: '/dashboard/instructor/courses',
    icon: BookOpen
  },
  {
    title: 'Create Course',
    href: '/dashboard/instructor/create',
    icon: Plus
  }
];

export function InstructorTabNavigation({ className }: { className?: string }) {
  const pathname = usePathname();

  // Extract course ID from pathname when on any course-related page
  const courseMatch = pathname.match(/\/dashboard\/instructor\/courses\/([^\/]+)/);
  const courseId = courseMatch?.[1];
  
  // Check if we're on any course management page (not just curriculum)
  const isCourseManagementPage = courseId && (
    pathname.includes('/curriculum') || 
    pathname === `/dashboard/instructor/courses/${courseId}` ||
    pathname.includes('/edit') ||
    pathname.includes('/settings')
  );

  return (
    <nav className={cn('flex space-x-4 lg:space-x-6', className)}>
      {instructorItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground'
          )}
        >
          <item.icon className="h-4 w-4 mr-2" />
          {item.title}
        </Link>
      ))}
      
      {/* Curriculum link when on any course management page */}
      {isCourseManagementPage && courseId && (
        <>
          <Link
            href={`/dashboard/instructor/courses/${courseId}`}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              pathname === `/dashboard/instructor/courses/${courseId}` 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground'
            )}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Course Details
          </Link>
          
          <Link
            href={`/dashboard/instructor/courses/${courseId}/curriculum`}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              pathname.includes('/curriculum') 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground'
            )}
          >
            <List className="h-4 w-4 mr-2" />
            Curriculum
          </Link>
        </>
      )}
    </nav>
  );
}