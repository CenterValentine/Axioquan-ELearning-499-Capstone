// // /src/app/instructors/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';
// import { InstructorCard } from '@/components/instructors/instructor-card';
// import { InstructorModal } from '@/components/instructors/instructor-modal';
// import { Button } from '@/components/ui/button';
// import { Loader2, Users, Search } from 'lucide-react';
// import { InstructorProfile } from '@/lib/db/queries/instructors';
// import { Input } from '@/components/ui/input';

// export default function InstructorsPage() {
//   const [instructors, setInstructors] = useState<InstructorProfile[]>([]);
//   const [filteredInstructors, setFilteredInstructors] = useState<InstructorProfile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Modal state
//   const [selectedInstructor, setSelectedInstructor] = useState<{
//     id: string;
//     name: string;
//   } | null>(null);

//   useEffect(() => {
//     fetchInstructors();
//   }, []);

//   // Filter instructors based on search
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredInstructors(instructors);
//     } else {
//       const query = searchQuery.toLowerCase();
//       const filtered = instructors.filter(
//         (instructor) =>
//           instructor.name.toLowerCase().includes(query) ||
//           instructor.headline?.toLowerCase().includes(query) ||
//           instructor.bio?.toLowerCase().includes(query) ||
//           instructor.skills?.some(skill => skill.toLowerCase().includes(query))
//       );
//       setFilteredInstructors(filtered);
//     }
//   }, [searchQuery, instructors]);

//   const fetchInstructors = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await fetch('/api/instructors');
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch instructors');
//       }
      
//       const data = await response.json();
//       setInstructors(data);
//       setFilteredInstructors(data);
//     } catch (err: any) {
//       console.error('Error fetching instructors:', err);
//       setError(err.message || 'Failed to load instructors');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMeetInstructor = (instructor: InstructorProfile) => {
//     setSelectedInstructor({
//       id: instructor.id,
//       name: instructor.name,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />

//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="flex items-center justify-center mb-4">
//             <Users size={48} />
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">
//             Meet Our Expert Instructors
//           </h1>
//           <p className="text-xl opacity-90 max-w-3xl mx-auto">
//             Learn from industry professionals and thought leaders who are passionate about sharing their knowledge
//           </p>
//         </div>
//       </section>

//       {/* Search and Stats Section */}
//       <section className="py-8 bg-muted/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             {/* Search Bar */}
//             <div className="relative w-full md:w-96">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
//               <Input
//                 type="text"
//                 placeholder="Search instructors by name, skills, or expertise..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             {/* Stats */}
//             {!loading && (
//               <div className="flex items-center gap-6 text-sm text-muted-foreground">
//                 <div>
//                   <span className="font-bold text-2xl text-foreground">
//                     {filteredInstructors.length}
//                   </span>{' '}
//                   {filteredInstructors.length === 1 ? 'Instructor' : 'Instructors'}
//                 </div>
//                 <div>
//                   <span className="font-bold text-2xl text-foreground">
//                     {instructors.reduce((sum, i) => sum + i.total_courses, 0)}
//                   </span>{' '}
//                   Courses
//                 </div>
//                 <div>
//                   <span className="font-bold text-2xl text-foreground">
//                     {instructors.reduce((sum, i) => sum + i.total_students, 0).toLocaleString()}
//                   </span>{' '}
//                   Students
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Loading State */}
//       {loading && (
//         <div className="py-16 flex justify-center">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="py-16 text-center max-w-2xl mx-auto px-4">
//           <div className="text-red-600 text-lg mb-4">Error: {error}</div>
//           <Button onClick={fetchInstructors} variant="outline">
//             Try Again
//           </Button>
//         </div>
//       )}

//       {/* Instructors Grid */}
//       {!loading && !error && filteredInstructors.length > 0 && (
//         <section className="py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredInstructors.map((instructor) => (
//                 <InstructorCard
//                   key={instructor.id}
//                   instructor={instructor}
//                   onMeetClick={() => handleMeetInstructor(instructor)}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* No Results */}
//       {!loading && !error && filteredInstructors.length === 0 && instructors.length > 0 && (
//         <div className="py-16 text-center max-w-2xl mx-auto px-4">
//           <Users size={64} className="mx-auto mb-4 text-muted-foreground" />
//           <h3 className="text-2xl font-bold mb-2">No instructors found</h3>
//           <p className="text-muted-foreground mb-6">
//             Try adjusting your search terms or clear the search to see all instructors
//           </p>
//           <Button onClick={() => setSearchQuery('')} variant="outline">
//             Clear Search
//           </Button>
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && !error && instructors.length === 0 && (
//         <div className="py-16 text-center max-w-2xl mx-auto px-4">
//           <Users size={64} className="mx-auto mb-4 text-muted-foreground" />
//           <h3 className="text-2xl font-bold mb-2">No instructors yet</h3>
//           <p className="text-muted-foreground">
//             Check back soon as we onboard more expert instructors to our platform
//           </p>
//         </div>
//       )}

//       {/* Instructor Detail Modal */}
//       {selectedInstructor && (
//         <InstructorModal
//           instructorId={selectedInstructor.id}
//           instructorName={selectedInstructor.name}
//           open={!!selectedInstructor}
//           onOpenChange={(open) => {
//             if (!open) setSelectedInstructor(null);
//           }}
//         />
//       )}

//       <Footer />
//     </div>
//   );
// }



// /src/app/instructors/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { InstructorCard } from '@/components/instructors/instructor-card';
import { InstructorModal } from '@/components/instructors/instructor-modal';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Search, Award, BookOpen, Star, TrendingUp } from 'lucide-react';
import { InstructorProfile } from '@/lib/db/queries/instructors';
import { Input } from '@/components/ui/input';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<InstructorProfile[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<InstructorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedInstructor, setSelectedInstructor] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Filter instructors based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInstructors(instructors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = instructors.filter(
        (instructor) =>
          instructor.name.toLowerCase().includes(query) ||
          instructor.headline?.toLowerCase().includes(query) ||
          instructor.bio?.toLowerCase().includes(query) ||
          instructor.skills?.some(skill => skill.toLowerCase().includes(query))
      );
      setFilteredInstructors(filtered);
    }
  }, [searchQuery, instructors]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/instructors');
      
      if (!response.ok) {
        throw new Error('Failed to fetch instructors');
      }
      
      const data = await response.json();
      setInstructors(data);
      setFilteredInstructors(data);
    } catch (err: any) {
      console.error('Error fetching instructors:', err);
      setError(err.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleMeetInstructor = (instructor: InstructorProfile) => {
    setSelectedInstructor({
      id: instructor.id,
      name: instructor.name,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Modern Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            {/* Icon with Gold Accent */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-amber-400 to-yellow-500 p-6 rounded-2xl shadow-2xl">
                  <Award size={56} className="text-slate-900" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Meet Our{' '}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Expert Instructors
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Learn from industry professionals and thought leaders who are passionate about transforming lives through education
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Star className="text-amber-400" size={20} />
                <span className="text-sm font-medium">Top-Rated Educators</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <BookOpen className="text-amber-400" size={20} />
                <span className="text-sm font-medium">Industry Experts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <TrendingUp className="text-amber-400" size={20} />
                <span className="text-sm font-medium">Proven Success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)"/>
          </svg>
        </div>
      </section>

      {/* Search and Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                type="text"
                placeholder="Search by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            {/* Stats */}
            {!loading && (
              <div className="flex items-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {filteredInstructors.length}
                  </div>
                  <div className="text-slate-600 text-xs uppercase tracking-wide">
                    {filteredInstructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </div>
                </div>
                <div className="h-12 w-px bg-slate-200"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {instructors.reduce((sum, i) => sum + i.total_courses, 0)}
                  </div>
                  <div className="text-slate-600 text-xs uppercase tracking-wide">Courses</div>
                </div>
                <div className="h-12 w-px bg-slate-200"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {instructors.reduce((sum, i) => sum + i.total_students, 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600 text-xs uppercase tracking-wide">Students</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mb-4" />
          <p className="text-slate-600">Loading our amazing instructors...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-16 text-center max-w-2xl mx-auto px-4">
          <div className="text-red-600 text-lg mb-4">Error: {error}</div>
          <Button 
            onClick={fetchInstructors} 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold shadow-lg"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Instructors Grid */}
      {!loading && !error && filteredInstructors.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredInstructors.map((instructor) => (
                <InstructorCard
                  key={instructor.id}
                  instructor={instructor}
                  onMeetClick={() => handleMeetInstructor(instructor)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Results */}
      {!loading && !error && filteredInstructors.length === 0 && instructors.length > 0 && (
        <div className="py-24 text-center max-w-2xl mx-auto px-4">
          <div className="bg-amber-50 rounded-2xl p-12 border border-amber-200">
            <Users size={64} className="mx-auto mb-4 text-amber-500" />
            <h3 className="text-2xl font-bold mb-2 text-slate-900">No instructors found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or clear the search to see all instructors
            </p>
            <Button 
              onClick={() => setSearchQuery('')} 
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold shadow-lg"
            >
              Clear Search
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && instructors.length === 0 && (
        <div className="py-24 text-center max-w-2xl mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-12 border border-amber-200">
            <Award size={64} className="mx-auto mb-4 text-amber-500" />
            <h3 className="text-2xl font-bold mb-2 text-slate-900">No instructors yet</h3>
            <p className="text-slate-600">
              Check back soon as we onboard more expert instructors to our platform
            </p>
          </div>
        </div>
      )}

      {/* Instructor Detail Modal */}
      {selectedInstructor && (
        <InstructorModal
          instructorId={selectedInstructor.id}
          instructorName={selectedInstructor.name}
          open={!!selectedInstructor}
          onOpenChange={(open) => {
            if (!open) setSelectedInstructor(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}