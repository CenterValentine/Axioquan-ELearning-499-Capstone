'use client';

import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { UserLock, BookOpen, Library, MessageCircle, SquareUserRound} from 'lucide-react';


import { AdminNav } from '@/components/app/nav/admin/adminNav';
import { LearnNav } from '@/components/app/nav/learn/learnNav';
import { InstructNav} from '@/components/app/nav/instruct/instructNav';
import { CoursesNav } from '@/components/app/nav/courses/coursesNav'
import { CommNav } from '@/components/app/nav/communications/commNav';


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
const isAdminSection     = pathname.startsWith('/app/admin')

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


<LearnNav isLearnSection={isLearnSection}
  linkBase={linkBase}
  active={active}></LearnNav>
              
 {/* Instructor-specific links */}



  {(userRole === 'teaching_assistant' || userRole === 'instructor' ) && (
  <>
  <a
          href="/app/instruct/dashboard"
          className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        ><SquareUserRound /> Instruct
  </a>


{/* instructor only menu options */}
      {isInstructSection && (userRole === 'instructor' || userRole === 'teaching_assistant') && (
        <>
        <InstructNav
isInstructSection={isInstructSection}
  linkBase={linkBase}
  active={active}
></InstructNav>
        </>
      )}

  </>
)}


 <a 
                href="/app/courses/explore" 
                className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Library></Library>Course Library
              </a>

               {isCoursesSection && (
                <CoursesNav
                  linkBase={linkBase}
  active={active}
                ></CoursesNav>
               )}

      
              
{/* Communications */}
               <a 
                href="/app/communications/inbox" 
                    className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
<span><MessageCircle/></span>
                Communicate
              </a>
              {isCommsSection && (
                <CommNav
                linkBase={linkBase}
                active={active}
                >
                </CommNav>
              )}


              {/* Admin Panel Link - Only for Admin Users */}
              {(userRoles.includes('admin')) && (<>
                <a 
                  href="/app/admin" 
                  className="flex gap-2 block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UserLock></UserLock>Admin
                </a>

                { isAdminSection && (
                <AdminNav
                 linkBase={linkBase}
                active={active}
                ></AdminNav>
                
                )}
                </>
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