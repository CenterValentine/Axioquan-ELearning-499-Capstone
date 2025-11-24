
// // /src/app/dashboard/layout.tsx

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/logout-button';
import { RealTimeProvider } from '@/components/providers/realtime-provider';
import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';
import Sidebar from '@/components/dashboard/sidebar';
import { sql } from '@/lib/db';

export default async function DashboardLayout({
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
  const userRoles = session.roles;

  const userData = {
    ...session,
    name: userName,
    image: userImage,
    primaryRole: userRole,
    roles: userRoles
  };

  return (
    <RealTimeProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Updated Sidebar Component - Now completely fixed */}
        <Sidebar user={userData} />
        
        {/* Main Content - FIXED: This is the only part that scrolls with proper margin */}
        <main className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
          userData.primaryRole ? 'lg:ml-64' : 'lg:ml-0'
        }`}>
          <div className="pt-5 lg:pt-8 px-4 lg:px-8 pb-8">
            <RoleRefreshHandler />
            {children}
          </div>
        </main>
      </div>
    </RealTimeProvider>
  );
}