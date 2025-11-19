`use client`;

import { usePathname } from 'next/navigation';
import { Award, BookOpen,  LayoutDashboard,  Users } from 'lucide-react';


type LearnProps = {
    isLearnSection: boolean;
    linkBase: string;
    active: string;
}


export function LearnNav ({isLearnSection, linkBase, active}: LearnProps ) {
    const pathname = usePathname()
    return (<>
    {isLearnSection && (
          <div className="mt-1 ml-6 space-y-1">
            <a
              href="/app/learn/dashboard"
              className={`${linkBase} ${
                pathname === '/app/learn/dashboard' ? active : ''
              }`}
            >
              <LayoutDashboard></LayoutDashboard>Dashboard
            </a>

            <a
              href="/app/learn/my-courses"
              className={`${linkBase} ${
                pathname.startsWith('/app/learn/my-courses') ? active : ''
              }`}
            >
              <BookOpen> </BookOpen>My Courses
            </a>
            <a
              href="/app/learn/certificates"
              className={`${linkBase} ${
                pathname.startsWith('/app/learn/certificates') ? active : ''
              }`}
            >
              <Award/>Certificates
            </a>
            <a
              href="/app/learn/study-groups"
              className={`${linkBase} ${
                pathname.startsWith('/app/learn/study-groups') ? active : ''
              }`}
            >
             <Users></Users> Study Groups
            </a>
          </div>
        )}</>)
}




//  {/* Teaching Assistant-specific links */}
//        {isInstructSection && userRole === 'teaching_assistant' && (
//             <>
//              <div className="mt-1 ml-6 space-y-1">

//            <a
//             href="/app/instruct/dashboard"
//             className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//           >
//              <LayoutDashboard></LayoutDashboard>Dashboard
//           </a>
//           <a
//             href="/app/instruct/curriculums"
//             className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//           >
//            <BookA></BookA>             My Courses
//           </a>
//           <a
//             href="/app/instruct/create"
//   className={`${linkBase} ${
//                 pathname.startsWith('/app/instruct/my-courses') ? active : ''
//               }`}
//           >
//            <PlusIcon> </PlusIcon>Create Course
//           </a>


//  <a
//             href="/app/instruct/create"
//   className={`${linkBase} ${
//                 pathname.startsWith('/app/instruct/my-courses') ? active : ''
//               }`}
//           >
//             <Users/> My Students
//           </a>
        

//             <a
//             href="/app/instruct/view"
//             // href="/app/instruct/view/{session.course.id}"
//             className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//           >
//            <EyeIcon></EyeIcon> View Courses
//           </a>
//           </div>
//         </>
//       )}