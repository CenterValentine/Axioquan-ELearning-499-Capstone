// /components/courses/course-filters.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input'; // ADD MISSING IMPORT
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchFilters } from '@/hooks/use-course-search';

interface CourseFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
  className?: string;
  availableTags?: { id: string; name: string; color?: string }[];
}

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'all-levels', label: 'All Levels' }
];

const contentTypeOptions = [
  { value: 'video', label: 'Video' },
  { value: 'text', label: 'Text' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'interactive', label: 'Interactive' }
];

const priceRangeOptions = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid ($0 - $50)' },
  { value: 'premium', label: 'Premium ($50+)' }
];

const ratingOptions = [
  { value: 4.5, label: '4.5+ stars' },
  { value: 4.0, label: '4.0+ stars' },
  { value: 3.5, label: '3.5+ stars' },
  { value: 3.0, label: '3.0+ stars' }
];

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'students', label: 'Most Popular' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' }
];

export function CourseFilters({
  filters,
  onFiltersChange,
  onReset,
  className = "",
  availableTags = []
}: CourseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ [key]: value });
  };

  const handleTagToggle = (tagName: string) => {
    const newTags = filters.tags.includes(tagName)
      ? filters.tags.filter(t => t !== tagName)
      : [...filters.tags, tagName];
    handleFilterChange('tags', newTags);
  };

  const hasActiveFilters = 
    filters.difficulty !== '' ||
    filters.content_type !== '' ||
    filters.price_range !== '' ||
    filters.min_rating > 0 ||
    filters.language !== '' ||
    filters.tags.length > 0 ||
    filters.is_featured ||
    filters.is_trending;

  const activeFilterCount = [
    filters.difficulty,
    filters.content_type,
    filters.price_range,
    filters.min_rating > 0,
    filters.language,
    filters.tags.length,
    filters.is_featured,
    filters.is_trending
  ].filter(Boolean).length;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-xs"
              >
                Clear All
              </Button>
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

      <CardContent className="space-y-4">
        {/* Sort By - Always visible */}
        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            value={filters.sort_by}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">All Levels</option>
                {difficultyOptions.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <select
                value={filters.content_type}
                onChange={(e) => handleFilterChange('content_type', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">All Types</option>
                {contentTypeOptions.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <select
                value={filters.price_range}
                onChange={(e) => handleFilterChange('price_range', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">All Prices</option>
                {priceRangeOptions.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Rating</label>
              <select
                value={filters.min_rating}
                onChange={(e) => handleFilterChange('min_rating', parseFloat(e.target.value))}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value={0}>Any Rating</option>
                {ratingOptions.map(rating => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <Input
                type="text"
                placeholder="Filter by language..."
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Featured & Trending */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Course Type</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.is_featured ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('is_featured', !filters.is_featured)}
                  className="text-xs"
                >
                  Featured
                </Button>
                <Button
                  variant={filters.is_trending ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('is_trending', !filters.is_trending)}
                  className="text-xs"
                >
                  Trending
                </Button>
              </div>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={filters.tags.includes(tag.name) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => handleTagToggle(tag.name)}
                      style={filters.tags.includes(tag.name) ? {
                        backgroundColor: tag.color || '#3B82F6',
                        borderColor: tag.color || '#3B82F6'
                      } : {}}
                    >
                      {tag.name}
                      {filters.tags.includes(tag.name) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}