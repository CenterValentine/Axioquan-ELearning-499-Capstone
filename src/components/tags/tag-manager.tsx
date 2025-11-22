
// /components/tags/tag-manager.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  is_featured: boolean;
  is_trending: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6',
    icon: '',
    is_featured: false
  });
  const router = useRouter();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tags');
      const data = await response.json();
      
      if (response.ok) {
        setTags(data.tags || []);
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to fetch tags'
        });
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Error', {
        description: 'Failed to fetch tags'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const url = editingTag 
        ? `/api/tags/${editingTag.id}`
        : '/api/tags';
      
      const method = editingTag ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Success', {
          description: data.message || 'Tag saved successfully'
        });
        
        setFormData({
          name: '',
          slug: '',
          description: '',
          color: '#3B82F6',
          icon: '',
          is_featured: false
        });
        setEditingTag(null);
        fetchTags();
        router.refresh();
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to save tag'
        });
      }
    } catch (error) {
      console.error('Error saving tag:', error);
      toast.error('Error', {
        description: 'Failed to save tag'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || '',
      color: tag.color,
      icon: tag.icon || '',
      is_featured: tag.is_featured
    });
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Success', {
          description: data.message || 'Tag deleted successfully'
        });
        fetchTags();
        router.refresh();
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to delete tag'
        });
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Error', {
        description: 'Failed to delete tag'
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
          </CardTitle>
          <CardDescription>
            {editingTag 
              ? 'Update the tag details below'
              : 'Add a new tag for organizing courses'
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
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="icon" className="block text-sm font-medium mb-1">
                  Icon
                </label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🔖, 📚, etc."
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
                {loading ? 'Saving...' : (editingTag ? 'Update Tag' : 'Create Tag')}
              </Button>
              
              {editingTag && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingTag(null);
                    setFormData({
                      name: '',
                      slug: '',
                      description: '',
                      color: '#3B82F6',
                      icon: '',
                      is_featured: false
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
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Manage all tags and their usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tags...</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tags found. Create your first tag above.
            </div>
          ) : (
            <div className="space-y-2">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: tag.color }}
                    ></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{tag.name}</span>
                        {tag.icon && (
                          <span className="text-sm text-gray-500">{tag.icon}</span>
                        )}
                        {tag.is_featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        {tag.is_trending && (
                          <Badge variant="secondary">Trending</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {tag.slug} • Used {tag.usage_count} times
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(tag)}
                    >
                      Edit
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(tag.id)}
                      className="bg-red-600 hover:bg-red-700 text-white" // ✅ FIX: Ensure white text
                    >
                      Delete
                    </Button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}