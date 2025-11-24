
// // /components/dashboard/quick-actions.tsx

// 'use client'

// import Link from 'next/link'

// interface QuickActionsProps {
//   roleSpecificData: any
//   userRole?: string
// }

// export default function QuickActions({ roleSpecificData, userRole }: QuickActionsProps) {
//   const renderRoleSpecificActions = () => {
//     switch (userRole) {
//       case 'student':
//         return (
//           <>
//             <Link 
//               href="/courses" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Browse Courses</div>
//               <div className="text-sm text-gray-600">Explore available courses to enroll</div>
//             </Link>
            
//             <Link 
//               href="/dashboard/profile" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Update Profile</div>
//               <div className="text-sm text-gray-600">Complete your profile information</div>
//             </Link>

//             <Link 
//               href="/dashboard/request-upgrade" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Request Role Upgrade</div>
//               <div className="text-sm text-gray-600">Upgrade to instructor or admin role</div>
//             </Link>

//             {roleSpecificData.enrolledCourses > 0 && (
//               <Link 
//                 href="/dashboard/my-courses" 
//                 className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <div className="font-medium text-gray-900">My Learning</div>
//                 <div className="text-sm text-gray-600">Continue your enrolled courses</div>
//               </Link>
//             )}
//           </>
//         )

//       case 'instructor':
//         return (
//           <>
//             <Link 
//               href="/dashboard/instructor/courses" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Manage Courses</div>
//               <div className="text-sm text-gray-600">View and edit your courses</div>
//             </Link>
            
//             <Link 
//               href="/dashboard/instructor/create" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Create New Course</div>
//               <div className="text-sm text-gray-600">Start building a new course</div>
//             </Link>

//             <Link 
//               href="/dashboard/instructor" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Instructor Analytics</div>
//               <div className="text-sm text-gray-600">View course performance and student progress</div>
//             </Link>

//             <Link 
//               href="/courses" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Browse Courses</div>
//               <div className="text-sm text-gray-600">Explore other courses on the platform</div>
//             </Link>
//           </>
//         )

//       case 'admin':
//         return (
//           <>
//             <Link 
//               href="/dashboard/admin" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Admin Dashboard</div>
//               <div className="text-sm text-gray-600">Manage users, roles, and platform settings</div>
//             </Link>

//             {roleSpecificData.pendingRoleRequests > 0 && (
//               <Link 
//                 href="/dashboard/admin/role-requests" 
//                 className="block w-full text-left p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
//               >
//                 <div className="font-medium text-orange-900">Review Role Requests</div>
//                 <div className="text-sm text-orange-700">
//                   {roleSpecificData.pendingRoleRequests} pending request{roleSpecificData.pendingRoleRequests !== 1 ? 's' : ''}
//                 </div>
//               </Link>
//             )}

//             <Link 
//               href="/dashboard/admin/categories" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Category Management</div>
//               <div className="text-sm text-gray-600">Manage course categories and tags</div>
//             </Link>

//             <Link 
//               href="/courses" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Browse Courses</div>
//               <div className="text-sm text-gray-600">Explore available courses to enroll</div>
//             </Link>
//           </>
//         )

//       default:
//         return (
//           <>
//             <Link 
//               href="/courses" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Browse Courses</div>
//               <div className="text-sm text-gray-600">Explore available courses</div>
//             </Link>
            
//             <Link 
//               href="/dashboard/profile" 
//               className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="font-medium text-gray-900">Update Profile</div>
//               <div className="text-sm text-gray-600">Complete your profile information</div>
//             </Link>
//           </>
//         )
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg p-6 border border-gray-200">
//       <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
//       <div className="space-y-3">
//         {renderRoleSpecificActions()}
//       </div>
//     </div>
//   )
// }




























'use client'

import Link from 'next/link'

interface QuickActionsProps {
  roleSpecificData: any
  userRole?: string
}

export default function QuickActions({ roleSpecificData, userRole }: QuickActionsProps) {
  const renderRoleSpecificActions = () => {
    switch (userRole) {
      case 'student':
        return (
          <>
            <Link 
              href="/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Browse Courses</div>
              <div className="text-sm text-gray-600">Explore available courses to enroll</div>
            </Link>
            
            <Link 
              href="/dashboard/profile" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Update Profile</div>
              <div className="text-sm text-gray-600">Complete your profile information</div>
            </Link>

            <Link 
              href="/dashboard/request-upgrade" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Request Role Upgrade</div>
              <div className="text-sm text-gray-600">Upgrade to instructor or admin role</div>
            </Link>

            {roleSpecificData.enrolledCourses > 0 && (
              <Link 
                href="/dashboard/my-courses" 
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">My Learning</div>
                <div className="text-sm text-gray-600">Continue your enrolled courses</div>
              </Link>
            )}
          </>
        )

      case 'instructor':
        return (
          <>
            <Link 
              href="/dashboard/instructor/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Manage Courses</div>
              <div className="text-sm text-gray-600">View and edit your courses</div>
            </Link>
            
            <Link 
              href="/dashboard/instructor/create" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Create New Course</div>
              <div className="text-sm text-gray-600">Start building a new course</div>
            </Link>

            <Link 
              href="/dashboard/instructor/analytics" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Instructor Analytics</div>
              <div className="text-sm text-gray-600">View course performance and student progress</div>
            </Link>

            {roleSpecificData.instructorCourses > 0 && (
              <Link 
                href="/dashboard/instructor/students" 
                className="block w-full text-left p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium text-blue-900">Manage Students</div>
                <div className="text-sm text-blue-700">
                  {roleSpecificData.totalStudents} student{roleSpecificData.totalStudents !== 1 ? 's' : ''} enrolled
                </div>
              </Link>
            )}

            <Link 
              href="/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Browse Courses</div>
              <div className="text-sm text-gray-600">Explore other courses on the platform</div>
            </Link>

            <Link 
              href="/dashboard/instructor/earnings" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Earnings & Reports</div>
              <div className="text-sm text-gray-600">View your earnings and performance reports</div>
            </Link>
          </>
        )

      case 'admin':
        return (
          <>
            <Link 
              href="/dashboard/admin" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Admin Dashboard</div>
              <div className="text-sm text-gray-600">Manage users, roles, and platform settings</div>
            </Link>

            {roleSpecificData.pendingRoleRequests > 0 && (
              <Link 
                href="/dashboard/admin/role-requests" 
                className="block w-full text-left p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="font-medium text-orange-900">Review Role Requests</div>
                <div className="text-sm text-orange-700">
                  {roleSpecificData.pendingRoleRequests} pending request{roleSpecificData.pendingRoleRequests !== 1 ? 's' : ''}
                </div>
              </Link>
            )}

            <Link 
              href="/dashboard/admin/categories" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Category Management</div>
              <div className="text-sm text-gray-600">Manage course categories and tags</div>
            </Link>

            <Link 
              href="/dashboard/admin/users" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">User Management</div>
              <div className="text-sm text-gray-600">Manage all platform users</div>
            </Link>

            <Link 
              href="/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Browse Courses</div>
              <div className="text-sm text-gray-600">Explore available courses to enroll</div>
            </Link>
          </>
        )

      default:
        return (
          <>
            <Link 
              href="/courses" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Browse Courses</div>
              <div className="text-sm text-gray-600">Explore available courses</div>
            </Link>
            
            <Link 
              href="/dashboard/profile" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Update Profile</div>
              <div className="text-sm text-gray-600">Complete your profile information</div>
            </Link>
          </>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {renderRoleSpecificActions()}
      </div>
    </div>
  )
}