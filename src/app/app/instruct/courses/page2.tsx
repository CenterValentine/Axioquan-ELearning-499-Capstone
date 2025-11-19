"use client"

// /src/app/dashboard/page.tsx


import { Card, CardContent } from '@/components/ui/card';  
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  BookOpen,
  Users,
  Star,
  TrendingUp,
  Edit,
  Eye,
  BarChart3,
  Settings,
  MessageSquare,
  FileText,
  Video,
  Code,
  CheckSquare
} from 'lucide-react';

import { useState } from 'react';
import { instructorCoursesMock } from '@/mocks/instructor-courses.mock';
import type { InstructorCourseOverview } from '@/types/instructor-course';



export default  function InstructMyCoursesView() {

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const courses: InstructorCourseOverview[] = instructorCoursesMock;
  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  
//   Figma generated styling gradient.
const getThumbnailGradient = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-400 to-blue-600';
      case 'purple': return 'from-purple-400 to-purple-600';
      case 'green': return 'from-green-400 to-green-600';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  return (
    <>
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
            Instructor Courses
            </h1>
            <p className="text-gray-600 mt-2">
            Update courses, check grades, course stats, discussions and more.
            </p>
        </div>
        <div className="flex">
            <div className="p-6 border-b border-slate-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                    <Input placeholder="Search courses..." className="pl-10" />
                </div>
            </div>
        </div>
        <div>
         {instructorCoursesMock.map((course) => (
            <Card key={course.id}>
                <CardContent className="p-4">
                    <div className={`bg-gradient-to-br ${getThumbnailGradient(course.thumbnail)} h-32 rounded-lg flex items-center justify-center mb-4`}>
                        <BookOpen className="size-12 text-white" />
                    </div>
                    <h3 className="text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-slate-600 mb-3 line-clamp-2">{course.description}</p>

   <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1">
                      <Users className="size-4" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 text-yellow-500 fill-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">{course.status}</Badge>
                    <p className="text-slate-500">{course.modules} modules</p>
                  </div>
                </div>
                 </CardContent>
            </Card>
            ))}
        </div>

    </>
  );
};
