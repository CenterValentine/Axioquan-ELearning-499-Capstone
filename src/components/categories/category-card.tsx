// /components/courses/category-card.tsx

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/categories';

interface CategoryCardProps {
  category: Category;
  view: 'grid' | 'list';
}

const categoryIcons: { [key: string]: string } = {
  'web-development': '💻',
  'programming': '👨‍💻',
  'design': '🎨',
  'data-science': '📊',
  'business': '💼',
  'marketing': '📈',
  'photography': '📷',
  'music': '🎵',
  'health': '🏥',
  'language': '🌐',
  'default': '📚'
};

const getCategoryIcon = (slug: string, icon?: string) => {
  if (icon) return icon;
  return categoryIcons[slug] || categoryIcons.default;
};

export function CategoryCard({ category, view }: CategoryCardProps) {
  if (view === 'list') {
    return (
      <Link href={`/categories/${category.slug}`}>
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
            style={{ 
              backgroundColor: category.color ? `${category.color}15` : '#f3f4f6',
              color: category.color || '#6b7280'
            }}
          >
            {getCategoryIcon(category.slug, category.icon)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
              {category.is_featured && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 truncate">{category.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="whitespace-nowrap">
              {category.course_count} course{category.course_count !== 1 ? 's' : ''}
            </Badge>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-200">
        {/* Category Header with Gradient */}
        <div 
          className="relative h-32 overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white"
          style={{
            background: category.color 
              ? `linear-gradient(135deg, ${category.color}40, #000000)`
              : 'linear-gradient(135deg, #1f2937, #000000)'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
              {getCategoryIcon(category.slug, category.icon)}
            </span>
          </div>
          
          {/* Featured Badge */}
          {category.is_featured && (
            <span className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
              <Star className="h-3 w-3 inline mr-1" />
              FEATURED
            </span>
          )}
          
          {/* Course Count Badge */}
          <span className="absolute bottom-3 left-3 bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {category.course_count} course{category.course_count !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Category Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{category.name}</h3>
          
          {/* Category Description */}
          {category.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
                borderColor: category.color || '#d1d5db',
                color: category.color || '#374151'
              }}
            >
              Explore Courses
            </Badge>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}