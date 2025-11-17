
// /src/app/dashboard/admin/cleanup/page.tsx

import { requireRole } from '@/lib/auth/utils';
import { cleanupDualRoles } from '@/lib/db/queries/cleanup';
import { CleanupForm } from '@/components/admin/cleanup-form';

export default async function CleanupPage() {
  await requireRole('admin');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Role Cleanup Tools</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800">About Dual Roles</h2>
        <p className="text-yellow-700 mt-2">
          Some users have both "student" and upgraded roles (instructor/teaching_assistant). 
          This cleanup will remove the student role and set the upgraded role as primary.
        </p>
      </div>

      <CleanupForm />
    </div>
  );
}
