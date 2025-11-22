// /src/app/dashboard/layout.tsx

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { RealTimeProvider } from '@/components/providers/realtime-provider';
import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';
import { SidebarNav } from '@/components/app/nav/Sidebar'
import { UserProfileNav } from '@/components/dashboard/user-profile-nav';
import { sql } from '@/lib/db';


// https://lucide.dev/icons/
import { BookOpen, Icon, LayoutDashboard, Library, LibraryBig, MessageCircle, SquareUserRound } from 'lucide-react';


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // ✅ DIRECT DATABASE FETCH: Get the latest user data including profile image
  let userImage = session.image; // Fallback to session image
  let userName = session.name;
  
  
  try {
    const userData = await sql`
      SELECT name, image FROM users WHERE id = ${session.userId} LIMIT 1
    `;
    
    if (userData.length > 0) {
      // Use the latest data from database, not session
      userImage = userData[0].image || session.image;
      userName = userData[0].name || session.name;
    }
  } catch (error) {
    console.error('❌ Error fetching user data for dashboard:', error);
    // If there's an error, fall back to session data
  }

  // Use primaryRole for role-based navigation
  const userRole = session.primaryRole;
  const userRoles = session.roles ?? [];

  return (
    <RealTimeProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen border-r">
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-gray-900">AxioQuan {session.primaryRole !== 'student' && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Pro
              </span>
            )}</h1>
              
               
              <p className="text-sm text-gray-600">Dashboard</p>
              
              {/* Updated: Use UserProfileNav component with latest image from database */}
              <UserProfileNav 
                userName={userName}
                userEmail={session.email}
                userRole={userRole}
                userImage={userImage} 
              />
              
              <div className="flex items-center mt-2 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live Updates Active
              </div>
            </div>
            {/* Main Navigation */}
<SidebarNav userRole={userRole} userRoles={userRoles} />

          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <RoleRefreshHandler />
            {children}
          </main>
        </div>
      </div>
    </RealTimeProvider>
  );
}