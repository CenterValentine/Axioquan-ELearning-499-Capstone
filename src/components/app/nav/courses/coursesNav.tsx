`use client`;

import { usePathname } from 'next/navigation';
import { Compass} from 'lucide-react';


type CoursesProps = {
    linkBase: string;
    active: string;
}


export function CoursesNav ({linkBase, active}: CoursesProps ) {
    const pathname = usePathname()
    return (
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
)
}