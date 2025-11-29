
// /components/curriculum/module-accordion.tsx

// Used in /components/curriculum/curriculum-builder.tsx
// 

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, GripVertical } from 'lucide-react';
import { Module, Lesson } from '@/lib/db/queries/curriculum';
import { LessonCard } from './lesson-card';

interface ModuleAccordionProps {
  module: Module;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onAddLesson: (lessonData: any) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  order: number;
  onReorder: (newOrder: Module[]) => void;
}

export function ModuleAccordion({
  module,
  onUpdate,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  order
}: ModuleAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editData, setEditData] = useState({
    title: module.title,
    description: module.description || '',
    estimated_duration: module.estimated_duration || 0
  });
  const [newLessonData, setNewLessonData] = useState({
    title: '',
    lesson_type: 'video' as const,
    description: ''
  });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: module.title,
      description: module.description || '',
      estimated_duration: module.estimated_duration || 0
    });
    setIsEditing(false);
  };

  const handleAddLesson = () => {
    if (!newLessonData.title.trim()) {
      return;
    }

    onAddLesson({
      ...newLessonData,
      order_index: module.lessons?.length || 0
    });

    setNewLessonData({
      title: '',
      lesson_type: 'video',
      description: ''
    });
    setIsAddingLesson(false);
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'text': return '📝';
      case 'document': return '📄';
      case 'quiz': return '❓';
      case 'assignment': return '📋';
      case 'live_session': return '🔴';
      case 'audio': return '🎧';
      case 'interactive': return '⚡';
      case 'code': return '💻';
      case 'discussion': return '💬';
      default: return '📚';
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-purple-100 text-purple-800';
      case 'assignment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalDuration = module.lessons?.reduce((total, lesson) => total + (lesson.video_duration || 0), 0) || 0;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex items-center pt-1">
              <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
            </div>
            
            {isEditing ? (
              <div className="flex-1 space-y-3">
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Module title"
                  className="text-lg font-semibold"
                />
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Module description"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  {!module.is_published && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Draft
                    </Badge>
                  )}
                  {module.is_preview_available && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Preview
                    </Badge>
                  )}
                </div>
                {module.description && (
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>{module.lessons?.length || 0} lessons</span>
                  <span>•</span>
                  <span>{Math.round(totalDuration / 60)} min total</span>
                  {module.estimated_duration > 0 && (
                    <>
                      <span>•</span>
                      <span>{module.estimated_duration} min estimated</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Lessons List */}
          <div className="space-y-3 mb-4">
            {module.lessons?.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                order={index}
                onEdit={() => onEditLesson(lesson)}
                onDelete={() => onDeleteLesson(lesson.id)}
              />
            ))}
          </div>

          {/* Add Lesson Form */}
          {isAddingLesson ? (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Input
                    value={newLessonData.title}
                    onChange={(e) => setNewLessonData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Lesson title"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <select
                      value={newLessonData.lesson_type}
                      onChange={(e) => setNewLessonData(prev => ({ ...prev, lesson_type: e.target.value as any }))}
                      className="flex-1 p-2 border rounded-md text-sm"
                    >
                      <option value="video">Video</option>
                      <option value="text">Text</option>
                      <option value="document">Document</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                      <option value="live_session">Live Session</option>
                      <option value="audio">Audio</option>
                      <option value="interactive">Interactive</option>
                      <option value="code">Code</option>
                      <option value="discussion">Discussion</option>
                    </select>
                    <Button size="sm" onClick={handleAddLesson}>
                      Add
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingLesson(false);
                        setNewLessonData({ title: '', lesson_type: 'video', description: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingLesson(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}