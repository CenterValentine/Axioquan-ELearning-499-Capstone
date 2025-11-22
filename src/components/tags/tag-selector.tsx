
// /components/tags/tag-selector.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CourseTag } from '@/types/courses';

interface TagSelectorProps {
  selectedTags: CourseTag[];
  onTagsChange: (tags: CourseTag[]) => void;
  maxTags?: number;
  placeholder?: string;
}

export function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  maxTags = 10,
  placeholder = "Search and select tags..." 
}: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<CourseTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.length > 1) {
      searchTags(searchQuery);
    } else {
      setAvailableTags([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const searchTags = async (query: string) => {
    try {
      setIsSearching(true);
      const response = await fetch(`/api/tags?search=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      
      if (response.ok) {
        // Filter out already selected tags
        const filteredTags = data.tags.filter((tag: CourseTag) => 
          !selectedTags.some(selected => selected.id === tag.id)
        );
        setAvailableTags(filteredTags);
        setShowDropdown(true);
      } else {
        toast.error('Error', {
          description: data.error || 'Failed to search tags'
        });
      }
    } catch (error) {
      console.error('Error searching tags:', error);
      toast.error('Error', {
        description: 'Failed to search tags'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTag = (tag: CourseTag) => {
    if (selectedTags.length >= maxTags) {
      toast.error('Limit reached', {
        description: `Maximum ${maxTags} tags allowed`
      });
      return;
    }
    
    if (!selectedTags.some(selected => selected.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    
    setSearchQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim() && availableTags.length === 0) {
      e.preventDefault();
      // Optionally create a new tag here if needed
    } else if (e.key === 'Backspace' && !searchQuery && selectedTags.length > 0) {
      // Remove last tag on backspace when input is empty
      handleRemoveTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center space-x-1 px-3 py-1"
              style={{ 
                backgroundColor: `${tag.color}20`,
                borderColor: tag.color,
                color: tag.color
              }}
            >
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 hover:opacity-70 focus:outline-none"
                style={{ color: tag.color }}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={selectedTags.length >= maxTags}
        />
        
        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-1 text-sm">Searching tags...</p>
              </div>
            ) : availableTags.length > 0 ? (
              availableTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => handleAddTag(tag)}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span>{tag.name}</span>
                  {tag.is_featured && (
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </button>
              ))
            ) : searchQuery.trim() ? (
              <div className="p-4 text-center text-gray-500">
                No tags found for "{searchQuery}"
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-sm text-gray-500">
        {selectedTags.length} of {maxTags} tags selected
      </div>
    </div>
  );
}