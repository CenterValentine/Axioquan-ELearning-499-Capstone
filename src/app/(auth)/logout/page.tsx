
// /src/app/(auth)/logout/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/lib/auth/actions';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logoutAction();
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback redirect
        router.push('/');
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  );
}