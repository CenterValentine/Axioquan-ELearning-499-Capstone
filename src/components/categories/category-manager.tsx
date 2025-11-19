// /components/categories/category-manager.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  course_count: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

interface CategoryManagerProps {
  initialCategories?: Category[];
}

export function CategoryManager({ initialCategories = [] }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '', // Keep as empty string for form
    icon: '',
    color: '#3B82F6',
    is_active: true,
    is_featured: false,
    sort_order: 0
  });
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories?includeInactive=true');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories || []);
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to fetch categories'
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error', {
        description: 'Failed to fetch categories'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      // ✅ FIX: Prepare data with proper parent_id handling
      const submitData = {
        ...formData,
        parent_id: formData.parent_id || undefined // Convert empty string to undefined
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Success', {
          description: data.message || 'Category saved successfully'
        });
        
        setFormData({
          name: '',
          slug: '',
          description: '',
          parent_id: '',
          icon: '',
          color: '#3B82F6',
          is_active: true,
          is_featured: false,
          sort_order: 0
        });
        setEditingCategory(null);
        fetchCategories();
        router.refresh();
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to save category'
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Error', {
        description: 'Failed to save category'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '', // Keep as empty string for form
      icon: category.icon || '',
      color: category.color,
      is_active: category.is_active,
      is_featured: category.is_featured,
      sort_order: category.sort_order
    });
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Success', {
          description: data.message || 'Category deleted successfully'
        });
        fetchCategories();
        router.refresh();
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to delete category'
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error', {
        description: 'Failed to delete category'
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const renderCategory = (category: Category, level: number = 0) => (
    <div key={category.id} className="ml-4 border-l-2 border-gray-200 pl-4">
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border mb-2">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: category.color }}
          ></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{category.name}</span>
              {category.icon && (
                <span className="text-sm text-gray-500">{category.icon}</span>
              )}
              {!category.is_active && (
                <Badge variant="secondary">Inactive</Badge>
              )}
              {category.is_featured && (
                <Badge variant="default">Featured</Badge>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {category.slug} • {category.course_count} courses
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(category)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(category.id)}
            className="bg-red-600 hover:bg-red-700 text-white" // ✅ FIX: Ensure white text on red background
          >
            Delete
          </Button>
        </div>
      </div>
      
      {category.children?.map(child => renderCategory(child, level + 1))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </CardTitle>
          <CardDescription>
            {editingCategory 
              ? 'Update the category details below'
              : 'Add a new category to organize courses'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-1">
                  Slug *
                </label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="parent" className="block text-sm font-medium mb-1">
                  Parent Category
                </label>
                <select
                  id="parent"
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">No Parent</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="icon" className="block text-sm font-medium mb-1">
                  Icon
                </label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="code, globe, etc."
                />
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="sort_order" className="block text-sm font-medium mb-1">
                  Sort Order
                </label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Active
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_featured" className="text-sm font-medium">
                  Featured
                </label>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
              </Button>
              
              {editingCategory && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      name: '',
                      slug: '',
                      description: '',
                      parent_id: '',
                      icon: '',
                      color: '#3B82F6',
                      is_active: true,
                      is_featured: false,
                      sort_order: 0
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage all categories and their hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories found. Create your first category above.
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map(category => renderCategory(category))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}