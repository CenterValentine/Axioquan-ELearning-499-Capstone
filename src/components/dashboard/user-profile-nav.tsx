
// // /src/components/dashboard/user-profile-nav.tsx

// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'

// interface UserProfileNavProps {
//   userName: string
//   userEmail: string
//   userRole: string
//   userImage?: string
// }

// export function UserProfileNav({ 
//   userName, 
//   userEmail, 
//   userRole, 
//   userImage 
// }: UserProfileNavProps) {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

//   const getInitials = (name: string): string => {
//     return name
//       .split(' ')
//       .map(part => part.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', { method: 'POST' })
//       window.location.href = '/login'
//     } catch (error) {
//       console.error('Logout failed:', error)
//     }
//   }

//   return (
//     <div className="mt-4 relative">
//       {/* User Profile Card */}
//       <div 
//         className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
//         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//       >
//         {/* Profile Image */}
//         <div className="flex-shrink-0">
//           {userImage ? (
//             <img
//               src={userImage}
//               alt={`${userName}'s profile`}
//               className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
//             />
//           ) : (
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//               <span className="text-white text-sm font-bold">
//                 {getInitials(userName)}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* User Info */}
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-medium text-gray-900 truncate">
//             {userName}
//           </p>
//           <p className="text-xs text-gray-500 truncate">
//             {userEmail}
//           </p>
//           <p className="text-xs text-gray-400 capitalize mt-0.5">
//             {userRole}
//           </p>
//         </div>

//         {/* Dropdown Icon */}
//         <svg 
//           className={`w-4 h-4 text-gray-400 transition-transform ${
//             isDropdownOpen ? 'rotate-180' : ''
//           }`}
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </div>

//       {/* Dropdown Menu */}
//       {isDropdownOpen && (
//         <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//           <div className="p-2 space-y-1">
//             <Link
//               href="/dashboard/profile"
//               className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
//               onClick={() => setIsDropdownOpen(false)}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               <span>Edit Profile</span>
//             </Link>
            
//             <Link
//               href="/dashboard/settings"
//               className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
//               onClick={() => setIsDropdownOpen(false)}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               <span>Settings</span>
//             </Link>

//             <div className="border-t border-gray-100 my-1"></div>

//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



















// // /src/components/dashboard/user-profile-nav.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'

interface UserProfileNavProps {
  userName: string
  userEmail: string
  userRole: string
  userImage?: string
}

export function UserProfileNav({ 
  userName, 
  userEmail, 
  userRole, 
  userImage 
}: UserProfileNavProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="relative">
      {/* User Profile Card */}
      <div 
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {userImage ? (
            <img
              src={userImage}
              alt={`${userName}'s profile`}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {getInitials(userName)}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {userEmail}
          </p>
          <p className="text-xs text-gray-400 capitalize mt-0.5">
            {userRole}
          </p>
        </div>

        {/* Dropdown Icon */}
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2 space-y-1">
            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Edit Profile</span>
            </Link>
            
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}




















// // /src/components/dashboard/user-profile-nav.tsx

// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'

// interface UserProfileNavProps {
//   userName: string
//   userEmail: string
//   userRole: string
//   userImage?: string
// }

// export function UserProfileNav({ 
//   userName, 
//   userEmail, 
//   userRole, 
//   userImage 
// }: UserProfileNavProps) {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

//   // Mock notification count - you'll replace this with real data
//   const notificationCount = 3

//   const getInitials = (name: string): string => {
//     return name
//       .split(' ')
//       .map(part => part.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', { method: 'POST' })
//       window.location.href = '/login'
//     } catch (error) {
//       console.error('Logout failed:', error)
//     }
//   }

//   return (
//     <div className="relative">
//       {/* User Profile Card */}
//       <div 
//         className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
//         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//       >
//         {/* Profile Image */}
//         <div className="flex-shrink-0">
//           {userImage ? (
//             <img
//               src={userImage}
//               alt={`${userName}'s profile`}
//               className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
//             />
//           ) : (
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//               <span className="text-white text-sm font-bold">
//                 {getInitials(userName)}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* User Info */}
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-medium text-gray-900 truncate">
//             {userName}
//           </p>
//           <p className="text-xs text-gray-500 truncate">
//             {userEmail}
//           </p>
//           <p className="text-xs text-gray-400 capitalize mt-0.5">
//             {userRole}
//           </p>
//         </div>

//         {/* Notification Badge - NEW: Added notification indicator */}
//         {notificationCount > 0 && (
//           <div className="flex-shrink-0">
//             <div className="relative">
//               <Link
//                 href="/dashboard/inbox"
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
//                 title={`${notificationCount} unread notifications`}
//               >
//                 <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1.5-2.5A3.5 3.5 0 006 12a3.5 3.5 0 002.5 2.5z" />
//                 </svg>
//                 <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full">
//                   {notificationCount}
//                 </span>
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Dropdown Icon */}
//         <svg 
//           className={`w-4 h-4 text-gray-400 transition-transform ${
//             isDropdownOpen ? 'rotate-180' : ''
//           }`}
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </div>

//       {/* Dropdown Menu */}
//       {isDropdownOpen && (
//         <div className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//           <div className="p-2 space-y-1">
//             {/* NEW: Added Inbox link to dropdown */}
//             <Link
//               href="/dashboard/inbox"
//               className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
//               onClick={() => setIsDropdownOpen(false)}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//               <span>Inbox {notificationCount > 0 && `(${notificationCount})`}</span>
//             </Link>
            
//             <Link
//               href="/dashboard/profile"
//               className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
//               onClick={() => setIsDropdownOpen(false)}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               <span>Edit Profile</span>
//             </Link>
            
//             <Link
//               href="/dashboard/settings"
//               className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
//               onClick={() => setIsDropdownOpen(false)}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               <span>Settings</span>
//             </Link>

//             <div className="border-t border-gray-100 my-1"></div>

//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }