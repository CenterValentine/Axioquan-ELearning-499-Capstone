

// /components/curriculum/curriculum-builder.tsx
// uses /components/curriculum/module-accordion.tsx and /components/curriculum/lesson-editor.tsx


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Module, Lesson } from '@/lib/db/queries/curriculum';
import { ModuleAccordion } from './module-accordion';
import { LessonEditor } from './lesson-editor';

interface CurriculumBuilderProps {
  courseId: string;
  initialCurriculum?: Module[];
}

export function CurriculumBuilder({ courseId, initialCurriculum = [] }: CurriculumBuilderProps) {
  const [modules, setModules] = useState<Module[]>(initialCurriculum);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Refresh curriculum data
  const refreshCurriculum = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/modules`);
      const data = await response.json();
      if (response.ok) {
        setModules(data.curriculum || []);
      }
    } catch (error) {
      console.error('Error refreshing curriculum:', error);
    }
  };

  // Add new module
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error('Error', { description: 'Module title is required' });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newModuleTitle.trim(),
          order_index: modules.length,
          is_published: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: 'Module created successfully' });
        setNewModuleTitle('');
        setIsAddingModule(false);
        await refreshCurriculum();
      } else {
        toast.error('Error', { description: data.error || 'Failed to create module' });
      }
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Error', { description: 'Failed to create module' });
    } finally {
      setLoading(false);
    }
  };

  // Update module
  const handleUpdateModule = async (moduleId: string, updates: any) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: 'Module updated successfully' });
        await refreshCurriculum();
      } else {
        toast.error('Error', { description: data.error || 'Failed to update module' });
      }
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Error', { description: 'Failed to update module' });
    }
  };

  // Delete module
  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? All lessons in this module will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: 'Module deleted successfully' });
        await refreshCurriculum();
      } else {
        toast.error('Error', { description: data.error || 'Failed to delete module' });
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Error', { description: 'Failed to delete module' });
    }
  };

  // Add lesson to module
  const handleAddLesson = async (moduleId: string, lessonData: any) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lessonData,
          course_id: courseId
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: 'Lesson created successfully' });
        setEditingLesson(null);
        await refreshCurriculum();
      } else {
        toast.error('Error', { description: data.error || 'Failed to create lesson' });
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Error', { description: 'Failed to create lesson' });
    }
  };

  // Update lesson
  const handleUpdateLesson = async (lessonId: string, updates: any) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: 'Lesson updated successfully' });
        setEditingLesson(null);
        await refreshCurriculum();
      } else {
        toast.error('Error', { description: data.error || 'Failed to update lesson' });
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Error', { description: 'Failed to update lesson' });
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: 'Lesson deleted successfully' });
        await refreshCurriculum();
      } else {
        toast.error('Error', { description: data.error || 'Failed to delete lesson' });
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Error', { description: 'Failed to delete lesson' });
    }
  };

  // Reorder modules (simplified - would need drag & drop for full implementation)
  const handleReorderModules = async (newOrder: Module[]) => {
    setModules(newOrder);
    // In a real implementation, you'd send updates to the backend
    toast.info('Reordering', { description: 'Module order updated' });
  };

  if (editingLesson) {
    return (
      <LessonEditor
        lesson={editingLesson}
        onSave={(updates) => handleUpdateLesson(editingLesson.id, updates)}
        onCancel={() => setEditingLesson(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Course Curriculum</CardTitle>
          <CardDescription>
            Build your course structure by adding modules and lessons. Drag and drop to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mr-2">
                {modules.length} Modules
              </Badge>
              <Badge variant="outline">
                {modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} Lessons
              </Badge>
            </div>
            <Button 
              onClick={() => setIsAddingModule(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Module
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Module Form */}
      {isAddingModule && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="moduleTitle" className="block text-sm font-medium mb-1">
                  Module Title *
                </label>
                <Input
                  id="moduleTitle"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="e.g., Introduction to Web Development"
                  autoFocus
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleAddModule} 
                  disabled={loading || !newModuleTitle.trim()}
                >
                  {loading ? 'Creating...' : 'Create Module'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingModule(false);
                    setNewModuleTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module, index) => (
          <ModuleAccordion
            key={module.id}
            module={module}
            onUpdate={(updates) => handleUpdateModule(module.id, updates)}
            onDelete={() => handleDeleteModule(module.id)}
            onAddLesson={(lessonData) => handleAddLesson(module.id, lessonData)}
            onEditLesson={setEditingLesson}
            onDeleteLesson={handleDeleteLesson}
            order={index}
            onReorder={(newOrder) => handleReorderModules(newOrder)}
          />
        ))}
      </div>

      {/* Empty State */}
      {modules.length === 0 && !isAddingModule && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your course curriculum by adding your first module
            </p>
            <Button 
              onClick={() => setIsAddingModule(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Your First Module
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}