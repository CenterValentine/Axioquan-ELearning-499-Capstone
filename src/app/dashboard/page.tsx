
// // /src/app/dashboard/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { checkAuthStatus } from '@/lib/auth/actions';
import { getInstructorCourses } from '@/lib/db/queries/courses';
import { getRoleRequests } from '@/lib/db/queries/roles';
import { sql } from '@/lib/db/index';
import DashboardOverview from '@/components/dashboard/dashboard-overview';
import ContinueLearning from '@/components/dashboard/continue-learning';
import WeeklyGoal from '@/components/dashboard/weekly-goal';
import RecentAchievements from '@/components/dashboard/recent-achievements';
import TrendingCourses from '@/components/dashboard/trending-courses';
import InstructorCourses from '@/components/dashboard/instructor-courses';
import QuickActions from '@/components/dashboard/quick-actions';
import RecentActivity from '@/components/dashboard/recent-activity';

// Sample courses data to display while we're not fetching from dashboard
const sampleCourses = [
  {
    id: 1,
    title: 'Introduction to Python Programming',
    description: 'Learn fundamentals of Python',
    icon: '🐍',
    progress: 85,
    category: 'Programming',
  },
  {
    id: 2,
    title: 'Modern Web Design Principles',
    description: 'Master responsive design',
    icon: '🎨',
    progress: 60,
    category: 'Design',
  },
  {
    id: 3,
    title: 'Data Structures and Algorithms',
    description: 'Advanced programming concepts',
    icon: '📊',
    progress: 25,
    category: 'Programming',
  },
];

export default async function DashboardPage() {
  // Use withSessionRefresh to automatically refresh session if needed
  const session = await withSessionRefresh();
  const authStatus = await checkAuthStatus();

  // Calculate session expiry time safely
  const sessionExpiry = session.expires ? Math.round((new Date(session.expires).getTime() - Date.now()) / (60 * 1000)) : 0;

  // Role-based data fetching
  let roleSpecificData = {
    enrolledCourses: 0,
    learningProgress: 0,
    instructorCourses: 0,
    totalStudents: 0,
    pendingRoleRequests: 0,
    totalUsers: 0,
    certificatesEarned: 0,
    certificatesIssued: 0
  };

  let instructorCoursesList: any[] = [];
  let enrolledCoursesList: any[] = [];

  try {
    if (session.primaryRole === 'student') {
      // Get student-specific data
      const enrolledCourses = await sql`
        SELECT COUNT(*) as count FROM enrollments 
        WHERE user_id = ${session.userId} AND status = 'active'
      `;
      roleSpecificData.enrolledCourses = parseInt(enrolledCourses[0]?.count || '0');

      // Get learning progress (simplified - you'll need to implement this based on your progress tracking)
      const progress = await sql`
        SELECT COALESCE(AVG(progress_percentage), 0) as average_progress 
        FROM enrollments 
        WHERE user_id = ${session.userId} AND status = 'active'
      `;
      roleSpecificData.learningProgress = Math.round(parseFloat(progress[0]?.average_progress || '0'));

      // Try to get certificates count for student - fallback to mock data if table doesn't exist
      try {
        const certificatesCount = await sql`
          SELECT COUNT(*) as count FROM certificates 
          WHERE user_id = ${session.userId} AND status = 'issued'
        `;
        roleSpecificData.certificatesEarned = parseInt(certificatesCount[0]?.count || '0');
      } catch (certError) {
        console.log('Certificates table not available, using mock data');
        // Mock certificates data for now
        roleSpecificData.certificatesEarned = 3; // Mock value
      }

      // Get enrolled courses for the ContinueLearning component
      const enrolledCoursesData = await sql`
        SELECT c.*, e.progress_percentage as progress 
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = ${session.userId} AND e.status = 'active'
      `;
      enrolledCoursesList = enrolledCoursesData;

    } else if (session.primaryRole === 'instructor') {
      // Get instructor-specific data
      const instructorCourses = await getInstructorCourses(session.userId);
      instructorCoursesList = instructorCourses;
      roleSpecificData.instructorCourses = instructorCourses.length;

      // Calculate total students across all courses
      const totalStudents = instructorCourses.reduce((total, course) => {
        return total + (course.enrolled_students_count || 0);
      }, 0);
      roleSpecificData.totalStudents = totalStudents;

      // Try to get certificates count for instructor - fallback to mock data if table doesn't exist
      try {
        const certificatesCount = await sql`
          SELECT COUNT(*) as count FROM certificates c
          JOIN courses co ON c.course_id = co.id
          WHERE co.instructor_id = ${session.userId} AND c.status = 'issued'
        `;
        roleSpecificData.certificatesIssued = parseInt(certificatesCount[0]?.count || '0');
      } catch (certError) {
        console.log('Certificates table not available, using mock data for instructor');
        // Mock certificates data for now
        roleSpecificData.certificatesIssued = 12; // Mock value
      }

      // Get course completion stats
      const publishedCourses = instructorCourses.filter(course => course.is_published);
      const draftCourses = instructorCourses.filter(course => !course.is_published);
      
      // For demo - you might want more sophisticated progress tracking
      roleSpecificData.learningProgress = publishedCourses.length > 0 ? 
        Math.round((publishedCourses.length / instructorCourses.length) * 100) : 0;

    } else if (session.primaryRole === 'admin') {
      // Get admin-specific data - USING YOUR EXACT IMPLEMENTATION
      const totalUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_active = true`;
      roleSpecificData.totalUsers = parseInt(totalUsers[0]?.count || '0');

      const pendingRequests = await getRoleRequests({ status: 'pending' });
      roleSpecificData.pendingRoleRequests = pendingRequests.length;

      // Get platform statistics
      const totalCourses = await sql`SELECT COUNT(*) as count FROM courses WHERE is_published = true`;
      roleSpecificData.enrolledCourses = parseInt(totalCourses[0]?.count || '0');
    }
  } catch (error) {
    console.error('Error fetching role-specific data:', error);
    // Set default values for certificates if there's an error
    if (session.primaryRole === 'student') {
      roleSpecificData.certificatesEarned = 0;
    } else if (session.primaryRole === 'instructor') {
      roleSpecificData.certificatesIssued = 0;
    }
    // Continue with default values if there's an error
  }

  const getWelcomeMessage = () => {
    const name = session.name || 'there';
    
    switch (session.primaryRole) {
      case 'student':
        return `Ready to continue your learning journey, ${name}?`;
      case 'instructor':
        return `Welcome back, Instructor ${name}! Ready to inspire some learners today?`;
      case 'admin':
        return `Welcome back, Admin ${name}. Here's your platform overview.`;
      default:
        return `Welcome back, ${name}!`;
    }
  };

  const getRoleBadgeColor = () => {
    switch (session.primaryRole) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'instructor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Welcome Message and Role Badge */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {getWelcomeMessage()}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
            {session.primaryRole?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* NEW UI LAYOUT - Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Dashboard Overview Component */}
          <DashboardOverview 
            roleSpecificData={roleSpecificData}
            userRole={session.primaryRole}
          />
          
          {/* Role-specific content - ADMIN SHOULD NOT SEE ContinueLearning */}
          {session.primaryRole === 'instructor' ? (
            <InstructorCourses courses={instructorCoursesList} />
          ) : session.primaryRole === 'student' ? (
            <ContinueLearning courses={enrolledCoursesList.length > 0 ? enrolledCoursesList : sampleCourses} />
          ) : null /* ADMIN SEES NOTHING HERE */}

          {/* New Quick Actions Component */}
          <QuickActions 
            roleSpecificData={roleSpecificData}
            userRole={session.primaryRole}
          />

          {/* New Recent Activity Component */}
          <RecentActivity />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* ADMIN SHOULD NOT SEE WeeklyGoal */}
          {session.primaryRole !== 'admin' && <WeeklyGoal />}
          
          {/* ADMIN SHOULD NOT SEE RecentAchievements */}
          {session.primaryRole !== 'admin' && <RecentAchievements />}
          
          {/* ADMIN CAN SEE TrendingCourses */}
          <TrendingCourses />

          {/* Session Info */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Session Information</h4>
            <p className="text-sm text-blue-700">
              Session expires in: {sessionExpiry} minutes
            </p>
            <p className="text-sm text-blue-700">
              Roles: {session.roles?.join(', ') || 'No roles assigned'}
            </p>
            <p className="text-sm text-blue-700">
              Auth Status: {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}