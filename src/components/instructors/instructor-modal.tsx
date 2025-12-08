// /src/components/instructors/instructor-modal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Linkedin, 
  Youtube, 
  Globe, 
  BookOpen, 
  Users, 
  Star,
  Loader2,
  X,
  Award,
  TrendingUp,
  Target
} from 'lucide-react';
import { InstructorWithCourses } from '@/lib/db/queries/instructors';

interface InstructorModalProps {
  instructorId: string;
  instructorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstructorModal({ 
  instructorId, 
  instructorName, 
  open, 
  onOpenChange 
}: InstructorModalProps) {
  const [instructor, setInstructor] = useState<InstructorWithCourses | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && instructorId) {
      fetchInstructorDetails();
    }
  }, [open, instructorId]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  const fetchInstructorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/instructors/${instructorId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch instructor details');
      }
      
      const data = await response.json();
      setInstructor(data);
    } catch (err: any) {
      console.error('Error fetching instructor:', err);
      setError(err.message || 'Failed to load instructor details');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-20 rounded-full p-2 bg-slate-100 hover:bg-amber-100 opacity-70 hover:opacity-100 transition-all"
        >
          <X className="h-5 w-5 text-slate-600" />
          <span className="sr-only">Close</span>
        </button>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
              <p className="text-slate-600">Loading instructor details...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-24 px-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-600 mb-4 font-medium">{error}</p>
              <Button 
                onClick={fetchInstructorDetails} 
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && instructor && (
          <>
            {/* Hero Header with Background */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 pb-24">
              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
                {/* Instructor Image */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl">
                    <Image
                      src={instructor.image || '/placeholder-user.jpg'}
                      alt={instructor.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {instructor.average_rating >= 4.5 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 p-2 rounded-full shadow-lg">
                      <Award size={20} />
                    </div>
                  )}
                </div>

                {/* Name and Headline */}
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    {instructor.name}
                  </h2>
                  {instructor.headline && (
                    <p className="text-lg text-amber-300 font-medium mb-4">
                      {instructor.headline}
                    </p>
                  )}
                  
                  {/* Quick Stats Row */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                      <BookOpen size={18} className="text-amber-400" />
                      <div>
                        <span className="font-bold text-xl">{instructor.total_courses}</span>
                        <span className="text-slate-300 text-sm ml-1">Courses</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                      <Users size={18} className="text-amber-400" />
                      <div>
                        <span className="font-bold text-xl">{instructor.total_students.toLocaleString()}</span>
                        <span className="text-slate-300 text-sm ml-1">Students</span>
                      </div>
                    </div>
                    {instructor.average_rating > 0 && (
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                        <Star size={18} className="text-amber-400 fill-amber-400" />
                        <div>
                          <span className="font-bold text-xl">{instructor.average_rating.toFixed(1)}</span>
                          <span className="text-slate-300 text-sm ml-1">Rating</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 -mt-16 relative z-10">
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                {/* Biography */}
                {instructor.bio && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="text-amber-500" size={24} />
                      <h3 className="text-2xl font-bold text-slate-900">About</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                      {instructor.bio}
                    </p>
                  </div>
                )}

                <Separator className="bg-slate-200" />

                {/* Skills */}
                {instructor.skills && instructor.skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="text-amber-500" size={24} />
                      <h3 className="text-2xl font-bold text-slate-900">Skills & Expertise</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {instructor.skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 px-4 py-2 text-sm font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(instructor.website || instructor.linkedin_url || instructor.youtube_channel) && (
                  <>
                    <Separator className="bg-slate-200" />
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900">Connect</h3>
                      <div className="flex flex-wrap gap-3">
                        {instructor.website && (
                          <Button 
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold shadow-md" 
                            size="default" 
                            asChild
                          >
                            <a href={instructor.website} target="_blank" rel="noopener noreferrer">
                              <Globe size={18} className="mr-2" />
                              Website
                              <ExternalLink size={14} className="ml-2" />
                            </a>
                          </Button>
                        )}
                        {instructor.linkedin_url && (
                          <Button 
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold shadow-md" 
                            size="default" 
                            asChild
                          >
                            <a href={instructor.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin size={18} className="mr-2" />
                              LinkedIn
                              <ExternalLink size={14} className="ml-2" />
                            </a>
                          </Button>
                        )}
                        {instructor.youtube_channel && (
                          <Button 
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold shadow-md" 
                            size="default" 
                            asChild
                          >
                            <a href={instructor.youtube_channel} target="_blank" rel="noopener noreferrer">
                              <Youtube size={18} className="mr-2" />
                              YouTube
                              <ExternalLink size={14} className="ml-2" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Courses Taught */}
                {instructor.courses && instructor.courses.length > 0 && (
                  <>
                    <Separator className="bg-slate-200" />
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900">
                        Courses by {instructor.name.split(' ')[0]} ({instructor.courses.length})
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {instructor.courses.map((course) => (
                          <Link
                            key={course.id}
                            href={`/courses/${course.slug}`}
                            className="flex gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-slate-50"
                          >
                            {/* Course Thumbnail */}
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                              <Image
                                src={course.thumbnail_url || '/placeholder.jpg'}
                                alt={course.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            
                            {/* Course Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                                {course.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className="text-xs capitalize border-amber-300 text-amber-700">
                                  {course.difficulty_level}
                                </Badge>
                                {course.average_rating > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                    <span className="font-semibold">{course.average_rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}