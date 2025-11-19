
`use client`;

import { usePathname } from 'next/navigation';
import { Inbox, Megaphone } from 'lucide-react';


type CommProps = {
    linkBase: string;
    active: string;
}


export function CommNav ({linkBase, active}: CommProps ) {
    const pathname = usePathname()
    return (<>
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
                </>)
}