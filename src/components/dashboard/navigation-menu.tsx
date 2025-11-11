
// /src/components/auth/logout-button.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/lib/auth/actions';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'dropdown';
  onLogout?: () => void;
}

export function LogoutButton({ variant = 'default', onLogout }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Show loading state
      const toastId = toast.loading('Logging out...');
      
      await logoutAction();
      
      // Show success message
      toast.success('Logged out successfully!', {
        id: toastId,
      });
      
      if (onLogout) {
        onLogout();
      }
      
      // The redirect happens in the server action
    } catch (error) {
      console.error('Logout error:', error);
      
      // Show error message only if logout actually fails
      toast.error('Logout failed. Please try again.', {
        description: 'If the problem persists, please refresh the page.',
      });
      
      // Fallback client-side redirect
      router.push('/');
      router.refresh();
    }
  };

  if (variant === 'dropdown') {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Sign Out</span>
      </button>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="w-full justify-start text-gray-600 hover:bg-gray-50"
    >
      Sign Out
    </Button>
  );
}