// /src/app/dashboard/layout.tsx

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/logout-button';
import { RealTimeProvider } from '@/components/providers/realtime-provider';
import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';
import { UserProfileNav } from '@/components/dashboard/user-profile-nav';
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

  return (
    <RealTimeProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen border-r">
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-gray-900">AxioQuan</h1>
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
            <nav className="p-4 space-y-2">
              {/* Main Navigation */}
              <a 
                href="/dashboard" 
                className="block py-2 px-4 text-blue-600 bg-blue-50 rounded-lg transition-colors"
              >
                Overview
              </a>
              <a 
                href="/dashboard/profile" 
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Profile
              </a>
              <a 
                href="/courses" 
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Courses
              </a>

              {/* Admin Panel Link - Only for Admin Users */}
              {userRoles.includes('admin') && (
                <div className="space-y-1">
                  <a 
                    href="/dashboard/admin" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    Admin Panel
                  </a>
                  
                  {/* Admin Sub-menu */}
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-2">
                    <a 
                      href="/dashboard/admin/categories" 
                      className="block py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Categories
                    </a>
                    <a 
                      href="/dashboard/admin/tags" 
                      className="block py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Tags
                    </a>
                    <a 
                      href="/dashboard/admin/cleanup" 
                      className="block py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Role Cleanup
                    </a>
                  </div>
                </div>
              )}

              {/* Role Upgrade Link - Only for Students */}
              {userRole === 'student' && (
                <a 
                  href="/dashboard/request-upgrade" 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Request Upgrade
                </a>
              )}


              {/* Instructor-specific links */}
              {(userRole === 'instructor' || userRoles.includes('instructor')) && (
                <>
                  <a 
                    href="/dashboard/instructor/courses" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    My Courses
                  </a>
                  <a 
                    href="/dashboard/instructor/create" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Create Course
                  </a>
                </>
              )}

              
              {/* Instructor-specific links */}
              {/* {userRole === 'instructor' && (
                <>
                  <a 
                    href="/dashboard/instructor/courses" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    My Courses
                  </a>
                  <a 
                    href="/dashboard/instructor/create" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Create Course
                  </a>
                </>
              )} */}

              {/* Teaching Assistant-specific links */}
              {userRole === 'teaching_assistant' && (
                <a 
                  href="/dashboard/assistant" 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Assistant Dashboard
                </a>
              )}

              {/* Logout Button - Keep the sidebar logout for accessibility */}
              <div className="pt-4 border-t border-gray-200">
                <LogoutButton />
              </div>
            </nav>
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