// File: /src/app/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight, Play, ArrowRight, Users, BookOpen, Star, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';

type CourseAny = any;
type CategoryAny = any;

// Premium Course Card Component
function PremiumCourseCard({ course }: { course: CourseAny }) {
  return (
    <Link href={`/courses/${course.slug || course.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full">
        {/* Course Image with Play Button */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary to-secondary">
          <img
            src={course.thumbnail_url || "/placeholder-course.png"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
              <Play size={32} className="text-primary fill-primary" />
            </div>
          </div>
          <span className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
            {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : 'NEW'}
          </span>
        </div>

        {/* Course Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
          
          {/* Instructor with Profile Image */}
          <div className="flex items-center gap-2 mb-4">
            {course.instructor_image && (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={course.instructor_image}
                  alt={course.instructor_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {course.instructor_name || 'Expert Instructor'}
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-primary font-bold">
              {course.price_cents ? `$${(course.price_cents / 100).toFixed(2)}` : 'FREE'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="font-semibold">{course.rating || '4.8'}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {course.enrollment_count ? `${course.enrollment_count.toLocaleString()} students` : 'Join now!'}
          </p>
        </div>
      </div>
    </Link>
  );
}

// Course Grid Component with Load More
function PremiumCourseGrid({ courses, title, description, viewAllLink }: { 
  courses: CourseAny[], 
  title: string, 
  description?: string,
  viewAllLink: string 
}) {
  const [visibleCourses, setVisibleCourses] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);

  if (!courses || courses.length === 0) return null;

  const displayedCourses = courses.slice(0, visibleCourses);
  const hasMoreCourses = visibleCourses < courses.length;

  const loadMore = () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCourses(prev => prev + 8);
      setLoadingMore(false);
    }, 500);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          <Link href={viewAllLink} className="text-primary font-semibold flex items-center hover:gap-2 transition-all">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayedCourses.map((course) => (
            <PremiumCourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreCourses && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              disabled={loadingMore}
              variant="outline"
              className="min-w-48 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8 py-3 font-semibold"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Courses
                  <ArrowRight className="ml-2" size={16} />
                </>
              )}
            </Button>
          </div>
        )}

        {/* No more courses message */}
        {!hasMoreCourses && courses.length > 8 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              🎉 You've seen all {courses.length} courses!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Categories Section with Horizontal Scroll
function CategoriesSection({ categories }: { categories: CategoryAny[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (!categories || categories.length === 0) return null;

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Update arrow visibility after scroll
      setTimeout(updateArrowVisibility, 300);
    }
  };

  const updateArrowVisibility = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateArrowVisibility();
    
    const handleResize = () => updateArrowVisibility();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover courses in your favorite subjects and start learning today
          </p>
        </div>

        {/* Categories with Horizontal Scroll */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 hover:bg-gray-50"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-700" />
            </button>
          )}

          {/* Scrollable Categories Container */}
          <div
            ref={scrollContainerRef}
            onScroll={updateArrowVisibility}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group flex-shrink-0"
              >
                <div className="w-40 p-6 rounded-xl text-center transition-all transform hover:scale-105 hover:shadow-lg bg-muted hover:bg-primary hover:text-primary-foreground">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(category.slug, category.icon)}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-xs opacity-70">
                    {category.course_count || 0} courses
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-8">
          <Link href="/categories">
            <Button variant="outline" className="rounded-full">
              View All Categories <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>

        {/* Custom scrollbar styles */}
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}

// Auto Slider Component with 6 Images
function AutoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Start Your Learning Journey',
      description: 'Access 1000+ courses from industry experts',
      cta: 'Explore Courses',
      image: '/images/python-course.jpg',
      link: '/courses'
    },
    {
      id: 2,
      title: 'Become an Instructor',
      description: 'Share your knowledge and earn money teaching',
      cta: 'Start Teaching',
      image: '/images/react-course-hero.jpg',
      link: '/admin-signup'
    },
    {
      id: 3,
      title: 'Premium Membership',
      description: 'Unlimited access to all courses + certificates',
      cta: 'Upgrade Now',
      image: '/images/ios-swift-development.jpg',
      link: '/premium'
    },
    // {
    //   id: 4,
    //   title: 'Learn at Your Own Pace',
    //   description: '24/7 access to course materials and lifetime updates',
    //   cta: 'Start Learning',
    //   image: '/images/react-advanced.jpg',
    //   link: '/courses'
    // },
    {
      id: 5,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and thought leaders',
      cta: 'Meet Instructors',
      image: '/images/ios-development.png',
      link: '/instructors'
    },
    {
      id: 6,
      title: 'Career Advancement',
      description: 'Get certified and boost your career opportunities',
      cta: 'View Certificates',
      image: '/images/instructor-portrait.png',
      link: '/certificates'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide 
                ? 'translate-x-0' 
                : index < currentSlide 
                ? '-translate-x-full' 
                : 'translate-x-full'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{slide.title}</h2>
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">{slide.description}</p>
                  <Link
                    href={slide.link || "/courses"}
                    className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-opacity-90 transition text-lg"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition backdrop-blur-sm"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition backdrop-blur-sm"
      >
        <ChevronRightIcon size={28} />
      </button>

      {/* Slider Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 z-20 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [courses, setCourses] = useState<CourseAny[]>([]);
  const [categories, setCategories] = useState<CategoryAny[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/courses?is_published=true&limit=100'), // Increased limit for load more
          fetch('/api/categories')
        ]);

        if (!coursesRes.ok) throw new Error('Failed to load courses');
        if (!categoriesRes.ok) throw new Error('Failed to load categories');

        const coursesData = await coursesRes.json();
        const categoriesData = await categoriesRes.json();

        if (isMounted) {
          setCourses(Array.isArray(coursesData) ? coursesData : coursesData.courses || []);
          setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
        }
      } catch (err: any) {
        console.error('Homepage fetch error', err);
        if (isMounted) setError(err.message || 'Failed to load data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, []);

  // All courses for load more functionality
  const allCourses = courses;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <AutoSlider />

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center mb-6">
                <BookOpen className="text-primary mr-3" size={32} />
                <h3 className="text-2xl font-bold">Learn & Grow</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Explore thousands of courses from basic to advanced. Learn at your own pace with lifetime access.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Certificate of Completion
                </li>
                <li className="flex items-center text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  24/7 Access to Course Materials
                </li>
                <li className="flex items-center text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  One-on-one Mentorship
                </li>
              </ul>
              <Link
                href="/signup"
                className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                Start Learning <ArrowRight className="inline ml-2" size={18} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-white">
              <div className="flex items-center mb-6">
                <Users className="text-white mr-3" size={32} />
                <h3 className="text-2xl font-bold">Teach & Inspire</h3>
              </div>
              <p className="mb-6 opacity-90">
                Share your expertise and reach millions of learners worldwide. Build your teaching career with us.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Easy Course Creation Tools
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Earn Up to 70% Commission
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  24/7 Support Team
                </li>
              </ul>
              <Link
                href="/admin-signup"
                className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                Become an Instructor <ArrowRight className="inline ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real Categories Section with Horizontal Scroll */}
      {!loading && categories.length > 0 && (
        <CategoriesSection categories={categories} />
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-16 text-center">
          <div className="text-red-600 text-lg mb-4">Error loading data: {error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )}

      {/* Courses Section with Load More */}
      {!loading && !error && allCourses.length > 0 && (
        <PremiumCourseGrid
          courses={allCourses}
          title="Popular Courses"
          description="Explore our most engaging courses"
          viewAllLink="/courses"
        />
      )}

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="opacity-90">Active Learners</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="opacity-90">Expert Instructors</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="opacity-90">Courses Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <p className="opacity-90">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}