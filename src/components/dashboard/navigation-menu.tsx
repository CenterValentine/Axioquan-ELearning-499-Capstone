
// // /src/components/auth/logout-button.tsx
// 'use client';

// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { logoutAction } from '@/lib/auth/actions';
// import { toast } from 'sonner';

// interface LogoutButtonProps {
//   variant?: 'default' | 'dropdown';
//   onLogout?: () => void;
// }

// export function LogoutButton({ variant = 'default', onLogout }: LogoutButtonProps) {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       // Show loading state
//       const toastId = toast.loading('Logging out...');
      
//       await logoutAction();
      
//       // Show success message
//       toast.success('Logged out successfully!', {
//         id: toastId,
//       });
      
//       if (onLogout) {
//         onLogout();
//       }
      
//       // The redirect happens in the server action
//     } catch (error) {
//       console.error('Logout error:', error);
      
//       // Show error message only if logout actually fails
//       toast.error('Logout failed. Please try again.', {
//         description: 'If the problem persists, please refresh the page.',
//       });
      
//       // Fallback client-side redirect
//       router.push('/');
//       router.refresh();
//     }
//   };

//   if (variant === 'dropdown') {
//     return (
//       <button
//         onClick={handleLogout}
//         className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
//       >
//         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//         </svg>
//         <span>Sign Out</span>
//       </button>
//     );
//   }

//   return (
//     <Button 
//       variant="outline" 
//       onClick={handleLogout}
//       className="w-full justify-start text-gray-600 hover:bg-gray-50"
//     >
//       Sign Out
//     </Button>
//   );
// }


























// /components/dashboard/navigation-menu.tsx

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

export function NavigationMenu({ className }: { className?: string }) {
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