// /src/components/instructors/instructor-card.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, BookOpen, Users, Award, Sparkles } from 'lucide-react';
import { InstructorProfile } from '@/lib/db/queries/instructors';

interface InstructorCardProps {
  instructor: InstructorProfile;
  onMeetClick: () => void;
}

export function InstructorCard({ instructor, onMeetClick }: InstructorCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-slate-200 hover:border-amber-300">
      {/* Instructor Image with Overlay */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
        <Image
          src={instructor.image || '/placeholder-user.jpg'}
          alt={instructor.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        {/* Golden Badge for Top Instructors */}
        {instructor.average_rating >= 4.5 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg font-semibold text-xs">
            <Award size={14} />
            <span>Top Rated</span>
          </div>
        )}
        
        {/* Stats Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2">
          <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-1.5 rounded-md">
              <BookOpen size={14} className="text-slate-900" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{instructor.total_courses}</div>
              <div className="text-[10px] text-slate-600">Courses</div>
            </div>
          </div>
          <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-1.5 rounded-md">
              <Users size={14} className="text-slate-900" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{instructor.total_students.toLocaleString()}</div>
              <div className="text-[10px] text-slate-600">Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Info */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Name */}
        <h3 className="font-bold text-xl mb-2 line-clamp-1 text-slate-900 group-hover:text-amber-600 transition-colors">
          {instructor.name}
        </h3>
        
        {/* Headline */}
        {instructor.headline && (
          <div className="flex items-start gap-2 mb-3">
            <Sparkles size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-600 font-medium line-clamp-2">
              {instructor.headline}
            </p>
          </div>
        )}

        {/* Bio Preview */}
        {instructor.bio && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
            {instructor.bio}
          </p>
        )}

        {/* Skills Tags (if available) */}
        {instructor.skills && instructor.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {instructor.skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 font-medium"
              >
                {skill}
              </span>
            ))}
            {instructor.skills.length > 3 && (
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                +{instructor.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        {instructor.average_rating > 0 && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-1">
              <Star className="text-amber-400 fill-amber-400" size={18} />
              <span className="font-bold text-slate-900">{instructor.average_rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-500">Instructor Rating</span>
          </div>
        )}

        {/* Meet Button with Gold Theme */}
        <Button 
          onClick={onMeetClick}
          className="w-full mt-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all duration-300 group/button"
        >
          <span className="flex items-center justify-center gap-2">
            Meet {instructor.name.split(' ')[0]}
            <Award size={16} className="group-hover/button:rotate-12 transition-transform" />
          </span>
        </Button>
      </div>
    </div>
  );
}