
// /src/hooks/use-active-path.ts
'use client';

import { usePathname } from 'next/navigation';

export function useActivePath(): (path: string) => boolean {
  const pathname = usePathname();

  const checkActivePath = (path: string): boolean => {
    // Exact match
    if (pathname === path) return true;
    
    // For courses and categories, check if current path starts with the menu path
    if (path === '/courses' && pathname.startsWith('/courses/')) {
      return true;
    }
    
    if (path === '/categories' && pathname.startsWith('/categories/')) {
      return true;
    }
    
    // For auth pages
    if (path === '/login' && pathname === '/login') {
      return true;
    }
    
    if (path === '/signup' && pathname === '/signup') {
      return true;
    }

    if (path === '/admin-signup' && pathname === '/admin-signup') {
      return true;
    }

    if (path === '/forgot-password' && pathname === '/forgot-password') {
      return true;
    }

    if (path === '/reset-password' && pathname.startsWith('/reset-password')) {
      return true;
    }
    
    return false;
  };

  return checkActivePath;
}