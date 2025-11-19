// File: /src/app/page.tsx
// Description: Home page — featured/trending/newly added course sections WITH HEADER ADDED.

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CourseGrid } from '@/components/courses/course-grid';
import { Loader2 } from 'lucide-react';

type CourseAny = any;

export default function HomePage() {
  const [courses, setCourses] = useState<CourseAny[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch published courses (we fetch a reasonable limit and derive the sections client-side)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/courses?is_published=true&limit=50', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || `Failed to load courses (${res.status})`);
        }

        const payload = await res.json();
        const list = payload?.courses || payload || [];
        if (isMounted) setCourses(Array.isArray(list) ? list : []);
      } catch (err: any) {
        console.error('Homepage fetch error', err);
        if (isMounted) setError(err.message || 'Failed to load courses');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, []);

  const featured = courses.filter(c => !!c.is_featured).slice(0, 8);
  const trending = courses.filter(c => !!c.is_trending).slice(0, 8);
  const newlyAdded = [...courses]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const fallback = courses.slice(0, 8);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">

      {/* -------------------------------------------------- */}
      {/* ✅ INSERTED HEADER FROM FIRST CODE — UNTOUCHED     */}
      {/* -------------------------------------------------- */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">AxioQuan</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* -------------------------------------------------- */}
      {/* END HEADER                                          */}
      {/* -------------------------------------------------- */}



      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
                Learn anything. Build anything. <span className="text-red-600">Start today.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Discover expert-led courses across development, data, design and more.
                Carefully curated learning paths, hands-on projects and real-world instructors.
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <Link href="/courses">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                    Browse All Courses
                  </Button>
                </Link>

                <Link href="/dashboard/instructor/create">
                  <Button variant="outline" size="lg">
                    Create a Course
                  </Button>
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-xs text-center px-3 py-2 bg-white rounded shadow-sm">
                  <div className="font-semibold text-lg">10K+</div>
                  <div className="text-gray-500">Students</div>
                </div>
                <div className="text-xs text-center px-3 py-2 bg-white rounded shadow-sm">
                  <div className="font-semibold text-lg">500+</div>
                  <div className="text-gray-500">Courses</div>
                </div>
                <div className="text-xs text-center px-3 py-2 bg-white rounded shadow-sm">
                  <div className="font-semibold text-lg">200+</div>
                  <div className="text-gray-500">Instructors</div>
                </div>
                <div className="text-xs text-center px-3 py-2 bg-white rounded shadow-sm">
                  <div className="font-semibold text-lg">4.8</div>
                  <div className="text-gray-500">Avg rating</div>
                </div>
              </div>
            </div>

            {/* Promo visual */}
            <div className="hidden lg:block">
              <div className="relative w-full h-80 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-2 gap-3 p-6">
                  {courses.slice(0, 4).map((c, i) => (
                    <div key={c.id || i} className="rounded-lg overflow-hidden bg-gray-100 border">
                      <img
                        src={c.thumbnail_url || '/placeholder-course.png'}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gradient-to-tr from-red-400 to-pink-400 rounded-full opacity-20 filter blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* SECTIONS */}
      <section className="container mx-auto px-6 lg:px-8 py-12 space-y-12">

        {/* Featured */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
              <p className="text-sm text-gray-500">Hand-picked courses, recommended for you.</p>
            </div>
            <Link href="/courses">
              <Button variant="ghost">View all courses</Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-red-600">Error loading courses: {error}</div>
          ) : (
            <CourseGrid courses={(featured.length ? featured : fallback)} showInstructor />
          )}
        </div>



        {/* Trending */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
              <p className="text-sm text-gray-500">What others are learning right now.</p>
            </div>
            <Link href="/courses?sort=trending">
              <Button variant="ghost">View all courses</Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            <CourseGrid courses={(trending.length ? trending : fallback)} showInstructor />
          )}
        </div>



        {/* Newly Added */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Newly Added</h2>
              <p className="text-sm text-gray-500">Latest courses recently published.</p>
            </div>
            <Link href="/courses?sort=newest">
              <Button variant="ghost">View all courses</Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            <CourseGrid courses={(newlyAdded.length ? newlyAdded : fallback)} showInstructor />
          )}
        </div>



        {/* CTA strip */}
        <div className="rounded-lg p-8 bg-gradient-to-r from-slate-50 to-white border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Ready to learn something new?</h3>
            <p className="text-sm text-gray-600">Explore hundreds of courses and start building real skills today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/courses">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">Explore Courses</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg">Teach on AxioQuan</Button>
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}
