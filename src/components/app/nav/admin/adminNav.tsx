
`use client`;

import { usePathname } from 'next/navigation';
import { LibraryBig, User, ShieldAlert} from 'lucide-react';


type AdminProps = {
    linkBase: string;
    active: string;
}


export function AdminNav ({linkBase, active}: AdminProps ) {
    const pathname = usePathname()
    return (<>
                 <div className="mt-1 ml-6 space-y-1">
 <a
              href="/app/admin/users"
              className={`${linkBase} ${
                pathname === '/app/courses/explore' ? active : ''
              }`}
            >
             <User></User> Users
            </a>

            <a
              href="/app/admin/courses"
              className={`${linkBase} ${
                pathname === '/app/courses/explore' ? active : ''
              }`}
            >
             <LibraryBig/> Courses
            </a>
                   <a
              href="/app/admin/role-requests"
              className={`${linkBase} ${
                pathname === '/app/admin' ? active : ''
              }`}
            >
             <ShieldAlert/> Role Requests
            </a>
</div>
                </>)
}