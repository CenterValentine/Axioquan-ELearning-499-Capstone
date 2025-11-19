// /app/api/courses/search/route.ts

import { NextRequest } from 'next/server';
import { getCoursesAction } from '@/lib/courses/actions';
import { Course, CourseTag } from '@/types/courses';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract all possible filter parameters
    const searchQuery = searchParams.get('q') || '';
    const category_slug = searchParams.get('category_slug');
    const difficulty = searchParams.get('difficulty');
    const content_type = searchParams.get('content_type');
    const price_range = searchParams.get('price_range'); // free, paid, premium
    const min_rating = parseFloat(searchParams.get('min_rating') || '0');
    const language = searchParams.get('language');
    const tags = searchParams.get('tags')?.split(',') || [];
    const is_featured = searchParams.get('is_featured') === 'true';
    const is_trending = searchParams.get('is_trending') === 'true';
    const sort_by = searchParams.get('sort_by') || 'relevance';
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get all published courses first
    const result = await getCoursesAction({
      is_published: true,
      category_slug: category_slug || undefined,
      limit: 1000, // Get all for filtering on backend
      offset: 0
    });

    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to fetch courses' },
        { status: 400 }
      );
    }

    let courses = result.courses || [];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.subtitle?.toLowerCase().includes(query) ||
        course.short_description?.toLowerCase().includes(query) ||
        course.tags?.some((tag: CourseTag) => tag.name.toLowerCase().includes(query)) ||
        course.instructor_name?.toLowerCase().includes(query)
      );
    }

    // Apply difficulty filter
    if (difficulty) {
      courses = courses.filter(course => course.difficulty_level === difficulty);
    }

    // Apply content type filter
    if (content_type) {
      courses = courses.filter(course => course.content_type === content_type);
    }

    // Apply price range filter
    if (price_range) {
      switch (price_range) {
        case 'free':
          courses = courses.filter(course => course.price_cents === 0);
          break;
        case 'paid':
          courses = courses.filter(course => course.price_cents > 0 && course.price_cents <= 5000);
          break;
        case 'premium':
          courses = courses.filter(course => course.price_cents > 5000);
          break;
      }
    }

    // Apply rating filter
    if (min_rating > 0) {
      courses = courses.filter(course => course.average_rating >= min_rating);
    }

    // Apply language filter
    if (language) {
      courses = courses.filter(course => 
        course.language?.toLowerCase().includes(language.toLowerCase())
      );
    }

    // Apply tags filter
    if (tags.length > 0) {
      courses = courses.filter(course =>
        course.tags?.some((tag: CourseTag) => tags.includes(tag.name) || tags.includes(tag.id))
      );
    }

    // Apply featured/trending filters
    if (is_featured) {
      courses = courses.filter(course => course.is_featured);
    }
    if (is_trending) {
      courses = courses.filter(course => course.is_trending);
    }

    // Apply sorting
    switch (sort_by) {
      case 'newest':
        courses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price_low':
        courses.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case 'price_high':
        courses.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case 'rating':
        courses.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'students':
        courses.sort((a, b) => b.enrolled_students_count - a.enrolled_students_count);
        break;
      case 'relevance':
      default:
        // Relevance scoring based on search query match
        if (searchQuery) {
          courses.sort((a, b) => {
            const scoreA = calculateRelevanceScore(a, searchQuery);
            const scoreB = calculateRelevanceScore(b, searchQuery);
            return scoreB - scoreA;
          });
        } else {
          // Default: featured first, then by enrollment
          courses.sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return b.enrolled_students_count - a.enrolled_students_count;
          });
        }
        break;
    }

    // Apply pagination
    const total = courses.length;
    const paginatedCourses = courses.slice(offset, offset + limit);

    return Response.json({
      courses: paginatedCourses,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      filters: {
        searchQuery,
        category_slug,
        difficulty,
        content_type,
        price_range,
        min_rating,
        language,
        tags,
        is_featured,
        is_trending,
        sort_by
      }
    });
  } catch (error: any) {
    console.error('❌ API Error searching courses:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function for relevance scoring
function calculateRelevanceScore(course: Course, query: string): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();

  // Title matches are most important
  if (course.title.toLowerCase().includes(lowerQuery)) {
    score += 10;
  }

  // Subtitle matches
  if (course.subtitle?.toLowerCase().includes(lowerQuery)) {
    score += 5;
  }

  // Description matches
  if (course.short_description?.toLowerCase().includes(lowerQuery)) {
    score += 3;
  }

  // Tag matches
  if (course.tags?.some((tag: CourseTag) => tag.name.toLowerCase().includes(lowerQuery))) {
    score += 4;
  }

  // Instructor name matches
  if (course.instructor_name?.toLowerCase().includes(lowerQuery)) {
    score += 2;
  }

  // Boost featured and popular courses
  if (course.is_featured) score += 3;
  if (course.is_trending) score += 2;
  if (course.enrolled_students_count > 100) score += 1;

  return score;
}