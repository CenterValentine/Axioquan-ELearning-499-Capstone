// /src/components/admin/cleanup-form.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CleanupForm() {
  const [cleaning, setCleaning] = useState(false);

  const handleCleanupAll = async () => {
    if (!confirm('This will remove student roles from all users who have upgraded roles. Continue?')) {
      return;
    }

    setCleaning(true);
    try {
      const response = await fetch('/api/admin/cleanup-dual-roles', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Cleaned up ${result.fixedUsers.length} users`);
        
        // Show detailed results
        if (result.fixedUsers.length > 0) {
          result.fixedUsers.forEach((user: any) => {
            console.log(`✅ ${user.username}: ${user.before} → ${user.after}`);
          });
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to cleanup dual roles');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-4">
      <h3 className="text-lg font-semibold">Cleanup Dual Roles</h3>
      
      <div className="space-y-4">
        <Button
          onClick={handleCleanupAll}
          disabled={cleaning}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white" // ✅ FIX: Added text-white
        >
          {cleaning ? 'Cleaning Up...' : 'Cleanup All Dual Roles'}
        </Button>
        
        <p className="text-sm text-gray-600">
          This will find all users with both "student" and upgraded roles, 
          remove the student role, and set the upgraded role as primary.
        </p>
      </div>
    </div>
  );
}