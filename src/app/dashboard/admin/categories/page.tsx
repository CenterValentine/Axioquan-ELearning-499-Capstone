
// /app/dashboard/admin/categories/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { requireRole } from '@/lib/auth/utils';
import { CategoryManager } from '@/components/categories/category-manager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminCategoriesPage() {
  const session = await withSessionRefresh();
  await requireRole('admin'); // Only admins can manage categories

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <p className="text-gray-600 mt-2">
          Create, edit, and organize course categories
        </p>
      </div>

      {/* ✅ SURGICAL ADDITION: Icon Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle>Category Icon Reference</CardTitle>
          <CardDescription>
            Quick copy-paste icons for categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>📚</span>
              <span>Books</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>💻</span>
              <span>Laptop</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🎨</span>
              <span>Art</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>📊</span>
              <span>Chart</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🎵</span>
              <span>Music</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>📷</span>
              <span>Camera</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🌐</span>
              <span>Globe</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🔧</span>
              <span>Wrench</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>🧠</span>
              <span>Brain</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span>💼</span>
              <span>Briefcase</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CategoryManager />
    </div>
  );
}