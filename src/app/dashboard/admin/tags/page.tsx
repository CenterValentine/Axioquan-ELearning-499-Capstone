
// /app/dashboard/admin/tags/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { requireRole } from '@/lib/auth/utils';
import { TagManager } from '@/components/tags/tag-manager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminTagsPage() {
  const session = await withSessionRefresh();
  await requireRole('admin'); // Only admins can manage tags

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tag Management</h1>
        <p className="text-gray-600 mt-2">
          Create, edit, and manage course tags
        </p>
      </div>

      {/* ✅ SURGICAL ADDITION: Icon Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Icon Reference</CardTitle>
          <CardDescription>
            Quick copy-paste icons for tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>⭐</span>
              <span>Star</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🔥</span>
              <span>Fire</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🆕</span>
              <span>New</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🏆</span>
              <span>Trophy</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>💡</span>
              <span>Lightbulb</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>⚡</span>
              <span>Zap</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🛡️</span>
              <span>Shield</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🌟</span>
              <span>Glowing Star</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <TagManager />
    </div>
  );
}