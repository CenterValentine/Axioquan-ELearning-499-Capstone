'use client';

import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { Award, BookA, BookOpen, BookUser, Compass, EyeIcon, Icon, Inbox, LayoutDashboard, Library, LibraryBig, Megaphone, MessageCircle, PlusIcon, SquareUserRound, Users } from 'lucide-react';
import { Certificate } from 'crypto';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

type SidebarNavProps = {
  userRole: string;
  userRoles: string[];
};

export function SidebarNav ({ userRole, userRoles }: SidebarNavProps){

const pathname = usePathname()

const isLearnSection = pathname.startsWith('/app/learn')
const isCoursesSection   = pathname.startsWith('/app/courses')
const isInstructSection   = pathname.startsWith('/app/instruct')
const isCommsSection     = pathname.startsWith('/app/communications')

type SidebarNavProps = {
  userRole: string;
  userRoles: string[];
};

const linkBase =
    'flex gap-2 block py-2 px-4 rounded-lg transition-colors text-gray-600 hover:bg-gray-50';
  const active =
    'bg-blue-50 text-blue-600';


    return(
            <nav className="p-4 space-y-2">
            {/* Dashboard Navigation */}
              <a 
                href="/app/learn/dashboard" 
                className="flex gap-2 block py-2 px-4
                rounded-lg"
              >
                <BookOpen/>Learn
              </a>

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
        )}
              
 {/* Instructor-specific links */}

{(userRole === 'teaching_assistant' || userRole === 'instructor' ) && (
  <>
  <a
          href="/app/instruct/dashboard"
          className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        ><SquareUserRound /> Instruct
  </a>
  </>
)}


{/* instructor only menu options */}
      {isInstructSection && userRole === 'instructor' && (
        <>
 <div className="mt-1 ml-6 space-y-1">
         <a
            href="/app/instruct/dashboard"
            className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
             <LayoutDashboard></LayoutDashboard>Dashboard
          </a>
          <a
            href="/app/instruct/curriculums"
            className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            My Courses
          </a>
          <a
            href="/app/instruct/create"
            className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Create Course
          </a>

             <a
            href="/app/instruct/view"
            className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
          <EyeIcon></EyeIcon> View Course
          </a>
          </div>
        </>
      )}

      {/* Teaching Assistant-specific links */}
       {isInstructSection && userRole === 'teaching_assistant' && (
            <>
             <div className="mt-1 ml-6 space-y-1">

           <a
            href="/app/instruct/dashboard"
            className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
             <LayoutDashboard></LayoutDashboard>Dashboard
          </a>
          <a
            href="/app/instruct/curriculums"
            className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
           <BookA></BookA>             My Courses

          </a>
          <a
            href="/app/instruct/create"
  className={`${linkBase} ${
                pathname.startsWith('/app/instruct/my-courses') ? active : ''
              }`}
          >
           <PlusIcon> </PlusIcon>Create Course
          </a>


 <a
            href="/app/instruct/create"
  className={`${linkBase} ${
                pathname.startsWith('/app/instruct/my-courses') ? active : ''
              }`}
          >
            <Users/> My Students
          </a>
        

            <a
            href="/app/instruct/view"
            // href="/app/instruct/view/{session.course.id}"
            className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
           <EyeIcon></EyeIcon> View Courses
          </a>
          </div>
        </>
      )}



 <a 
                href="/app/courses/search" 
                className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Library></Library>Course Library
              </a>

              {isCoursesSection && (
          <div className="mt-1 ml-6 space-y-1">
            <a
              href="/app/courses/search"
              className={`${linkBase} ${
                pathname === '/app/courses/explore' ? active : ''
              }`}
            >
              <Compass/>Explore
            </a>

          </div>
        )}

              
{/* Communications */}
               <a 
                href="/app/communications/inbox" 
                    className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
<span><MessageCircle/></span>
                Communication
              </a>

              {isCommsSection && (
                <>
                 <div className="mt-1 ml-6 space-y-1">

 <a
              href="/app/communications/inbox"
              className={`${linkBase} ${
                pathname === '/app/courses/explore' ? active : ''
              }`}
            >
             <Inbox></Inbox> inbox
            </a>

            <a
              href="/app/communications/news"
              className={`${linkBase} ${
                pathname === '/app/courses/explore' ? active : ''
              }`}
            >
             <Megaphone/> Announcements
            </a>
</div>
                </>
              )}

              {/* Admin Panel Link - Only for Admin Users */}
              {userRoles.includes('admin') && (
                <a 
                  href="/app/admin" 
                  className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Admin Panel
                </a>
              )}

              {/* Role Upgrade Link - Only for Students */}
              {userRole === 'student' && (
                <a 
                  href="/app/request-upgrade" 
                  className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Request Upgrade
                </a>
              )}

             

              {/* Logout Button - Keep the sidebar logout for accessibility */}
              <div className="pt-4 border-t border-gray-200">
                <LogoutButton />
              </div>
            </nav>
    )
}