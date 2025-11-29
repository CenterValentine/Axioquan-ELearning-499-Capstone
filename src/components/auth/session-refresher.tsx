// /src/components/auth/session-refresher.tsx

'use client';

import { useEffect } from 'react';

export function SessionRefresher() {
  useEffect(() => {
    const refreshSession = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (!response.ok) {
          // Session might be expired or invalid
          console.log('Session refresh failed');
        }
      } catch (error) {
        console.error('Session refresh error:', error);
      }
    };

    // Refresh session on component mount
    refreshSession();

    // Set up interval to refresh session periodically (every 15 minutes)
    const interval = setInterval(refreshSession, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}