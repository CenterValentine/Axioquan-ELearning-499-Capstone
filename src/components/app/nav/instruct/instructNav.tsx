
`use client`;

import { usePathname } from 'next/navigation';
import { EyeIcon, LayoutDashboard, Folder, Plus,  LayoutList } from 'lucide-react';


type InstructProps = {
    isInstructSection: boolean;
    linkBase: string;
    active: string;
}


export function InstructNav ({isInstructSection, linkBase, active}: InstructProps ) {
  const pathname = usePathname()
    return (<>
    <div className="mt-1 ml-6 space-y-1">
         <a
            href="/app/instruct/dashboard"
             className={`${linkBase} ${
                pathname.startsWith('/app/learn/my-courses') ? active : ''
              }`}
          >
             <LayoutDashboard></LayoutDashboard>Dashboard
          </a>
          <a
            href="/app/instruct/curriculums"
           className={`${linkBase} ${
                pathname.startsWith('/app/learn/my-courses') ? active : ''
              }`}
          >
            <LayoutList> </LayoutList>Instructor Courses
          </a>
          <a
            href="/app/instruct/create"
            className={`${linkBase} ${
                pathname.startsWith('/app/learn/my-courses') ? active : ''
              }`}
          >
            <Plus></Plus>Create Course
          </a>

             {/* <a
            href="/app/instruct/view"
            className={`${linkBase} ${
                pathname.startsWith('/app/learn/my-courses') ? active : ''
              }`}
          >
          <EyeIcon></EyeIcon> View Course
          </a> */}
          </div>
    </>)
}