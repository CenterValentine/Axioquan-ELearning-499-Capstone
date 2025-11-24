
// /src/components/auth/logout-button.tsx
// Purpose: Clean logout flow that shows only one correct toast message.

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
    const toastId = toast.loading('Logging out...');

    try {
      // Try to log out (server action may cause redirect)
      await logoutAction();

      // If the action resolves normally (no redirect)
      toast.success('You have been logged out.', { id: toastId });

      if (onLogout) onLogout();

      // Fallback client redirect
      router.push('/');
      router.refresh();
    } catch (error: any) {
      // ✅ Ignore known redirect exceptions from Next.js
      const isRedirectError =
        error instanceof Error && error.message?.includes('NEXT_REDIRECT');

      if (isRedirectError) {
        toast.success('You have been logged out.', { id: toastId });
        return; // Don't show error toast
      }

      console.error('Logout error:', error);

      toast.error('Logout failed. Please try again.', {
        id: toastId,
        description: 'If this persists, please refresh the page.',
      });

      // Fallback redirect to home
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
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
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
