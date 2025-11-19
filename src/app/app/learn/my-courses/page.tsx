

// /src/app/dashboard/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { checkAuthStatus } from '@/lib/auth/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui/card';  
import {User, BookOpen, Clock} from 'lucide-react';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Progress} from '@/components/ui/progress';
import { enrolledCoursesMock, completedCoursesMock} from '@/mocks/my-courses.mock';
import {Module} from '@/types/module'

interface MyCoursesViewProps {
  onSelectModule: (module: Module) => void;
}

export default async function MyCoursesViewPage({onSelectModule}: MyCoursesViewProps) {
  // Use withSessionRefresh to automatically refresh session if needed
  const session = await withSessionRefresh();
  const authStatus = await checkAuthStatus();

  // Calculate session expiry time safely
  const sessionExpiry = session.expires ? Math.round((new Date(session.expires).getTime() - Date.now()) / (60 * 1000)) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
My Courses
        </h1>
        <p className="text-gray-600 mt-2">
Track your learning journey and manage your enrolled courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">


<Card>
  <CardHeader>
    <CardTitle>In Progress</CardTitle>
    <CardContent className=" p-0 text-green-600">
      2
    </CardContent>
  </CardHeader>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Completed</CardTitle>
    <CardContent className="p-0 text-purple-600">
      1
    </CardContent>
  </CardHeader>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Enrolled</CardTitle>
    <CardContent className=" p-0 text-blue-600">
      5
    </CardContent>
  </CardHeader>
</Card>


      </div>

     <Tabs defaultValue="in-progress">
          <TabsList>
            <TabsTrigger value="in-progress">In Progress (
                {enrolledCoursesMock.length}
                )</TabsTrigger>
            <TabsTrigger value="completed">Completed (
                {completedCoursesMock.length}
                )</TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="space-y-4 mt-6">

{/* Mock data */}
 {enrolledCoursesMock.map((course) => (

<Card key={course.id} className="hover:shadow-lg transition-shadow">
     <CardContent className="p-6">


<div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg shrink-0">
                      <BookOpen className="size-8 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-slate-900 mb-2">{course.title}</h3>
                          <p className="text-slate-600 mb-3">{course.description}</p>
                        </div>
                        <Badge variant={
                          course.difficulty === 'Beginner' ? 'default' : 
                          course.difficulty === 'Intermediate' ? 'secondary' : 
                          'outline'
                        }>
                          {course.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>{course.duration}</span>
                        </div>
                        <Badge variant="secondary">{course.category}</Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Progress</span>
                          <span>{course.progress}% complete</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>

                      <Button 
                    //   onClick={() => onSelectModule(course)}
                    >
                        Continue Learning
                      </Button>
                    </div>
                  </div>
     </CardContent>
</Card>
))
}
</TabsContent>

<TabsContent value="completed" className="space-y-4 mt-6" >
 {/* Mock data */}
 {completedCoursesMock.map((course) => (
<Card key={course.id} className="hover:shadow-lg transition-shadow">
     <CardContent className="p-6">


<div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg shrink-0">
                      <BookOpen className="size-8 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-slate-900 mb-2">{course.title}</h3>
                          <p className="text-slate-600 mb-3">{course.description}</p>
                        </div>
                        <Badge variant={
                          course.difficulty === 'Beginner' ? 'default' : 
                          course.difficulty === 'Intermediate' ? 'secondary' : 
                          'outline'
                        }>
                          {course.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>{course.duration}</span>
                        </div>
                        <Badge variant="secondary">{course.category}</Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Progress</span>
                          <span>{course.progress}% complete</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>

                      <Button 
                    //   onClick={() => onSelectModule(course)}
                    >
                        Continue Learning
                      </Button>
                    </div>
                  </div>
     </CardContent>
</Card>
))
}
</TabsContent>
</Tabs> 


</div>
  );
}
