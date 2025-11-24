
// // /components/dashboard/sidebar.tsx

// 'use client'

// import Link from 'next/link'
// import { useState } from 'react'
// import { UserProfileNav } from './user-profile-nav'

// interface SidebarProps {
//   active?: string
//   user: any
// }

// export default function Sidebar({ active, user }: SidebarProps) {
//   const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')

//   // Common menu items for all roles
//   const commonMenuItems = [
//     {
//       label: 'Learn',
//       icon: '📚',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard', icon: '📊', id: 'dashboard' },
//         { label: 'Profile', href: '/dashboard/profile', icon: '👤', id: 'profile' },
//         { label: 'Courses', href: '/courses', icon: '🎓', id: 'courses' },
//         { label: 'Certificates', href: '#', icon: '📜', id: 'certificates' },
//       ],
//       id: 'learn',
//     },
//   ]

//   // Student specific menu
//   const studentMenuItems = [
//     {
//       label: 'My Learning',
//       icon: '📖',
//       submenu: [
//         { label: 'My Courses', href: '#', icon: '📚', id: 'my-courses' },
//         { label: 'In Progress', href: '#', icon: '⏳', id: 'in-progress' },
//         { label: 'Completed', href: '#', icon: '✅', id: 'completed' },
//       ],
//       id: 'my-learning',
//     },
//   ]

//   // Instructor specific menu
//   const instructorMenuItems = [
//     {
//       label: 'Teaching',
//       icon: '👨‍🏫',
//       submenu: [
//         { label: 'My Courses', href: '/dashboard/instructor/courses', icon: '📚', id: 'instructor-courses' },
//         { label: 'Create Course', href: '/dashboard/instructor/create', icon: '➕', id: 'create-course' },
//         { label: 'Students', href: '#', icon: '👥', id: 'students' },
//         { label: 'Analytics', href: '#', icon: '📈', id: 'analytics' },
//       ],
//       id: 'teaching',
//     },
//   ]

//   // Admin specific menu
//   const adminMenuItems = [
//     {
//       label: 'Admin',
//       icon: '⚙️',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard/admin', icon: '📊', id: 'admin-dashboard' },
//         { label: 'Categories', href: '/dashboard/admin/categories', icon: '📑', id: 'categories' },
//         { label: 'Tags', href: '/dashboard/admin/tags', icon: '🏷️', id: 'tags' },
//         { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: '🧹', id: 'cleanup' },
//         { label: 'Users', href: '#', icon: '👥', id: 'users' },
//       ],
//       id: 'admin',
//     },
//   ]

//   // Get menu items based on user role
//   const getMenuItems = () => {
//     if (!user) return commonMenuItems
    
//     switch (user.primaryRole) {
//       case 'admin':
//         return [...commonMenuItems, ...adminMenuItems, ...instructorMenuItems]
//       case 'instructor':
//         return [...commonMenuItems, ...instructorMenuItems]
//       case 'student':
//         return [...commonMenuItems, ...studentMenuItems]
//       default:
//         return commonMenuItems
//     }
//   }

//   const menuItems = getMenuItems()

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
//       <div className="p-6">
//         {/* Logo */}
//         <div className="flex items-center gap-2 mb-8">
//           <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
//             <span className="text-white font-bold">A</span>
//           </div>
//           <div>
//             <h2 className="font-bold text-gray-900">AxioQuan</h2>
//             <p className="text-xs text-gray-500">Learning Platform</p>
//           </div>
//         </div>

//         {/* Main Menu */}
//         <nav className="space-y-2">
//           {menuItems.map((item) => (
//             <div key={item.id}>
//               <button
//                 onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                 className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
//               >
//                 <div className="flex items-center gap-2">
//                   <span>{item.icon}</span>
//                   <span>{item.label}</span>
//                 </div>
//                 <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
//                   ▼
//                 </span>
//               </button>

//               {expandedMenu === item.id && (
//                 <div className="ml-6 space-y-1 mt-1">
//                   {item.submenu.map((subitem) => (
//                     <Link
//                       key={subitem.id}
//                       href={subitem.href}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                         active === subitem.id
//                           ? 'bg-blue-50 text-blue-600 font-medium'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       }`}
//                     >
//                       <span>{subitem.icon}</span>
//                       <span>{subitem.label}</span>
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* User Profile */}
//         {user && (
//           <UserProfileNav
//             userName={user.name || 'User'}
//             userEmail={user.email || 'user@example.com'}
//             userRole={user.primaryRole || 'user'}
//             userImage={user.image}
//           />
//         )}
//       </div>
//     </aside>
//   )
// }

































// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { UserProfileNav } from './user-profile-nav'

// interface SidebarProps {
//   user: any
// }

// export default function Sidebar({ user }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [isMobileOpen, setIsMobileOpen] = useState(false)
//   const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')
//   const pathname = usePathname()

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setIsMobileOpen(false)
//   }, [pathname])

//   // Close mobile sidebar on resize to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsMobileOpen(false)
//       }
//     }

//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   // Common menu items for all roles
//   const commonMenuItems = [
//     {
//       label: 'Learn',
//       icon: '📚',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard', icon: '📊', id: 'dashboard' },
//         { label: 'Profile', href: '/dashboard/profile', icon: '👤', id: 'profile' },
//         { label: 'Courses', href: '/courses', icon: '🎓', id: 'courses' },
//         { label: 'Certificates', href: '#', icon: '📜', id: 'certificates' },
//       ],
//       id: 'learn',
//     },
//   ]

//   // Student specific menu
//   const studentMenuItems = [
//     {
//       label: 'My Learning',
//       icon: '📖',
//       submenu: [
//         { label: 'My Courses', href: '#', icon: '📚', id: 'my-courses' },
//         { label: 'In Progress', href: '#', icon: '⏳', id: 'in-progress' },
//         { label: 'Completed', href: '#', icon: '✅', id: 'completed' },
//       ],
//       id: 'my-learning',
//     },
//   ]

//   // Instructor specific menu
//   const instructorMenuItems = [
//     {
//       label: 'Teaching',
//       icon: '👨‍🏫',
//       submenu: [
//         { label: 'My Courses', href: '/dashboard/instructor/courses', icon: '📚', id: 'instructor-courses' },
//         { label: 'Create Course', href: '/dashboard/instructor/create', icon: '➕', id: 'create-course' },
//         { label: 'Students', href: '#', icon: '👥', id: 'students' },
//         { label: 'Analytics', href: '#', icon: '📈', id: 'analytics' },
//       ],
//       id: 'teaching',
//     },
//   ]

//   // Admin specific menu
//   const adminMenuItems = [
//     {
//       label: 'Admin',
//       icon: '⚙️',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard/admin', icon: '📊', id: 'admin-dashboard' },
//         { label: 'Categories', href: '/dashboard/admin/categories', icon: '📑', id: 'categories' },
//         { label: 'Tags', href: '/dashboard/admin/tags', icon: '🏷️', id: 'tags' },
//         { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: '🧹', id: 'cleanup' },
//         { label: 'Users', href: '#', icon: '👥', id: 'users' },
//       ],
//       id: 'admin',
//     },
//   ]

//   // Get menu items based on user role
//   const getMenuItems = () => {
//     if (!user) return commonMenuItems
    
//     switch (user.primaryRole) {
//       case 'admin':
//         return [...commonMenuItems, ...adminMenuItems, ...instructorMenuItems]
//       case 'instructor':
//         return [...commonMenuItems, ...instructorMenuItems]
//       case 'student':
//         return [...commonMenuItems, ...studentMenuItems]
//       default:
//         return commonMenuItems
//     }
//   }

//   const menuItems = getMenuItems()

//   // Check if a link is active
//   const isLinkActive = (href: string) => {
//     if (href === '/dashboard' && pathname === '/dashboard') return true
//     if (href !== '/dashboard' && pathname.startsWith(href)) return true
//     return false
//   }

//   // Find active menu item
//   const findActiveMenuItem = () => {
//     for (const item of menuItems) {
//       for (const subitem of item.submenu) {
//         if (isLinkActive(subitem.href)) {
//           return subitem.id
//         }
//       }
//     }
//     return 'dashboard'
//   }

//   const activeMenuItem = findActiveMenuItem()

//   // Mobile sidebar overlay
//   const MobileOverlay = () => (
//     <div 
//       className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
//         isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//       }`}
//       onClick={() => setIsMobileOpen(false)}
//     />
//   )

//   // Sidebar content
//   const SidebarContent = () => (
//     <div className={`bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 flex flex-col h-full ${
//       isCollapsed ? 'w-16' : 'w-64'
//     }`}>
//       <div className="p-4 flex-shrink-0">
//         {/* Logo and Toggle */}
//         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
//           {!isCollapsed && (
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
//                 <span className="text-white font-bold">A</span>
//               </div>
//               <div>
//                 <h2 className="font-bold text-gray-900">AxioQuan</h2>
//                 <p className="text-xs text-gray-500">Learning Platform</p>
//               </div>
//             </div>
//           )}
          
//           {isCollapsed && (
//             <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
//               <span className="text-white font-bold">A</span>
//             </div>
//           )}

//           {/* Desktop Toggle Button */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           >
//             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isCollapsed ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//               )}
//             </svg>
//           </button>
//         </div>

//         {/* Main Menu */}
//         <nav className="space-y-2 flex-1">
//           {menuItems.map((item) => (
//             <div key={item.id}>
//               {/* Main Menu Item */}
//               {isCollapsed ? (
//                 // Collapsed view - just icon
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
//                     expandedMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                   title={item.label}
//                 >
//                   <span className="text-lg">{item.icon}</span>
//                 </button>
//               ) : (
//                 // Expanded view - full label
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>{item.icon}</span>
//                     <span>{item.label}</span>
//                   </div>
//                   <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
//                     ▼
//                   </span>
//                 </button>
//               )}

//               {/* Submenu Items */}
//               {expandedMenu === item.id && (
//                 <div className={`space-y-1 mt-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}>
//                   {item.submenu.map((subitem) => (
//                     <Link
//                       key={subitem.id}
//                       href={subitem.href}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                         isLinkActive(subitem.href)
//                           ? 'bg-blue-50 text-blue-600 font-medium'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       } ${isCollapsed ? 'justify-center' : ''}`}
//                       title={isCollapsed ? subitem.label : undefined}
//                     >
//                       <span>{subitem.icon}</span>
//                       {!isCollapsed && <span>{subitem.label}</span>}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* User Profile - Only show in expanded mode */}
//         {!isCollapsed && user && (
//           <div className="flex-shrink-0 mt-4">
//             <UserProfileNav
//               userName={user.name || 'User'}
//               userEmail={user.email || 'user@example.com'}
//               userRole={user.primaryRole || 'user'}
//               userImage={user.image}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         onClick={() => setIsMobileOpen(true)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
//       >
//         <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       {/* Mobile Overlay */}
//       <MobileOverlay />

//       {/* Sidebar */}
//       <aside className={`
//         fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
//         ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0
//       `}>
//         <SidebarContent />
//       </aside>

//       {/* Close mobile sidebar when clicking outside */}
//       {isMobileOpen && (
//         <div 
//           className="lg:hidden fixed inset-0 z-40"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}
//     </>
//   )
// }































// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { UserProfileNav } from './user-profile-nav'

// interface SidebarProps {
//   user: any
// }

// export default function Sidebar({ user }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [isMobileOpen, setIsMobileOpen] = useState(false)
//   const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')
//   const pathname = usePathname()

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setIsMobileOpen(false)
//   }, [pathname])

//   // Close mobile sidebar on resize to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsMobileOpen(false)
//       }
//     }

//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   // Common menu items for all roles
//   const commonMenuItems = [
//     {
//       label: 'Learn',
//       icon: '📚',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard', icon: '📊', id: 'dashboard' },
//         { label: 'Profile', href: '/dashboard/profile', icon: '👤', id: 'profile' },
//         { label: 'Courses', href: '/courses', icon: '🎓', id: 'courses' },
//         { label: 'Certificates', href: '#', icon: '📜', id: 'certificates' },
//       ],
//       id: 'learn',
//     },
//   ]

//   // Student specific menu
//   const studentMenuItems = [
//     {
//       label: 'My Learning',
//       icon: '📖',
//       submenu: [
//         { label: 'My Courses', href: '#', icon: '📚', id: 'my-courses' },
//         { label: 'In Progress', href: '#', icon: '⏳', id: 'in-progress' },
//         { label: 'Completed', href: '#', icon: '✅', id: 'completed' },
//       ],
//       id: 'my-learning',
//     },
//   ]

//   // Instructor specific menu
//   const instructorMenuItems = [
//     {
//       label: 'Teaching',
//       icon: '👨‍🏫',
//       submenu: [
//         { label: 'My Courses', href: '/dashboard/instructor/courses', icon: '📚', id: 'instructor-courses' },
//         { label: 'Create Course', href: '/dashboard/instructor/create', icon: '➕', id: 'create-course' },
//         { label: 'Students', href: '#', icon: '👥', id: 'students' },
//         { label: 'Analytics', href: '#', icon: '📈', id: 'analytics' },
//       ],
//       id: 'teaching',
//     },
//   ]

//   // Admin specific menu
//   const adminMenuItems = [
//     {
//       label: 'Admin',
//       icon: '⚙️',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard/admin', icon: '📊', id: 'admin-dashboard' },
//         { label: 'Categories', href: '/dashboard/admin/categories', icon: '📑', id: 'categories' },
//         { label: 'Tags', href: '/dashboard/admin/tags', icon: '🏷️', id: 'tags' },
//         { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: '🧹', id: 'cleanup' },
//         { label: 'Users', href: '#', icon: '👥', id: 'users' },
//       ],
//       id: 'admin',
//     },
//   ]

//   // Get menu items based on user role - FIXED: Admin should not see Teaching menu
//   const getMenuItems = () => {
//     if (!user) return commonMenuItems
    
//     switch (user.primaryRole) {
//       case 'admin':
//         return [...commonMenuItems, ...adminMenuItems] // Removed instructorMenuItems for admin
//       case 'instructor':
//         return [...commonMenuItems, ...instructorMenuItems]
//       case 'student':
//         return [...commonMenuItems, ...studentMenuItems]
//       default:
//         return commonMenuItems
//     }
//   }

//   const menuItems = getMenuItems()

//   // Check if a link is active
//   const isLinkActive = (href: string) => {
//     if (href === '/dashboard' && pathname === '/dashboard') return true
//     if (href !== '/dashboard' && pathname.startsWith(href)) return true
//     return false
//   }

//   // Find active menu item
//   const findActiveMenuItem = () => {
//     for (const item of menuItems) {
//       for (const subitem of item.submenu) {
//         if (isLinkActive(subitem.href)) {
//           return subitem.id
//         }
//       }
//     }
//     return 'dashboard'
//   }

//   const activeMenuItem = findActiveMenuItem()

//   // Mobile sidebar overlay
//   const MobileOverlay = () => (
//     <div 
//       className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
//         isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//       }`}
//       onClick={() => setIsMobileOpen(false)}
//     />
//   )

//   // Logo component with link to homepage
//   const Logo = () => (
//     <Link 
//       href="/" 
//       className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
//     >
//       <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
//         <span className="text-white font-bold">A</span>
//       </div>
//       {!isCollapsed && (
//         <div>
//           <h2 className="font-bold text-gray-900">AxioQuan</h2>
//           <p className="text-xs text-gray-500">Learning Platform</p>
//         </div>
//       )}
//     </Link>
//   )

//   // Collapsed logo component
//   const CollapsedLogo = () => (
//     <Link 
//       href="/" 
//       className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
//       title="Go to homepage"
//     >
//       <span className="text-white font-bold">a</span>
//     </Link>
//   )

//   // Sidebar content
//   const SidebarContent = () => (
//     <div className={`bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 flex flex-col h-full ${
//       isCollapsed ? 'w-16' : 'w-64'
//     }`}>
//       <div className="p-4 flex-shrink-0">
//         {/* Logo and Toggle */}
//         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
//           {isCollapsed ? <CollapsedLogo /> : <Logo />}
          
//           {/* Desktop Toggle Button */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           >
//             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isCollapsed ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//               )}
//             </svg>
//           </button>
//         </div>

//         {/* Main Menu */}
//         <nav className="space-y-2 flex-1">
//           {menuItems.map((item) => (
//             <div key={item.id}>
//               {/* Main Menu Item */}
//               {isCollapsed ? (
//                 // Collapsed view - just icon
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
//                     expandedMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                   title={item.label}
//                 >
//                   <span className="text-lg">{item.icon}</span>
//                 </button>
//               ) : (
//                 // Expanded view - full label
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>{item.icon}</span>
//                     <span>{item.label}</span>
//                   </div>
//                   <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
//                     ▼
//                   </span>
//                 </button>
//               )}

//               {/* Submenu Items */}
//               {expandedMenu === item.id && (
//                 <div className={`space-y-1 mt-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}>
//                   {item.submenu.map((subitem) => (
//                     <Link
//                       key={subitem.id}
//                       href={subitem.href}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                         isLinkActive(subitem.href)
//                           ? 'bg-blue-50 text-blue-600 font-medium'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       } ${isCollapsed ? 'justify-center' : ''}`}
//                       title={isCollapsed ? subitem.label : undefined}
//                     >
//                       <span>{subitem.icon}</span>
//                       {!isCollapsed && <span>{subitem.label}</span>}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* User Profile - Only show in expanded mode */}
//         {!isCollapsed && user && (
//           <div className="flex-shrink-0 mt-4">
//             <UserProfileNav
//               userName={user.name || 'User'}
//               userEmail={user.email || 'user@example.com'}
//               userRole={user.primaryRole || 'user'}
//               userImage={user.image}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         onClick={() => setIsMobileOpen(true)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
//       >
//         <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       {/* Mobile Overlay */}
//       <MobileOverlay />

//       {/* Sidebar */}
//       <aside className={`
//         fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
//         ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0
//       `}>
//         <SidebarContent />
//       </aside>

//       {/* Close mobile sidebar when clicking outside */}
//       {isMobileOpen && (
//         <div 
//           className="lg:hidden fixed inset-0 z-40"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}
//     </>
//   )
// }
























// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { UserProfileNav } from './user-profile-nav'

// interface SidebarProps {
//   user: any
// }

// export default function Sidebar({ user }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [isMobileOpen, setIsMobileOpen] = useState(false)
//   const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')
//   const pathname = usePathname()

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setIsMobileOpen(false)
//   }, [pathname])

//   // Close mobile sidebar on resize to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsMobileOpen(false)
//       }
//     }

//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   // Common menu items for all roles
//   const commonMenuItems = [
//     {
//       label: 'Learn',
//       icon: '📚',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard', icon: '📊', id: 'dashboard' },
//         { label: 'Profile', href: '/dashboard/profile', icon: '👤', id: 'profile' },
//         { label: 'Courses', href: '/courses', icon: '🎓', id: 'courses' },
//         { label: 'Certificates', href: '#', icon: '📜', id: 'certificates' },
//       ],
//       id: 'learn',
//     },
//   ]

//   // Student specific menu
//   const studentMenuItems = [
//     {
//       label: 'My Learning',
//       icon: '📖',
//       submenu: [
//         { label: 'My Courses', href: '#', icon: '📚', id: 'my-courses' },
//         { label: 'In Progress', href: '#', icon: '⏳', id: 'in-progress' },
//         { label: 'Completed', href: '#', icon: '✅', id: 'completed' },
//       ],
//       id: 'my-learning',
//     },
//   ]

//   // Instructor specific menu
//   const instructorMenuItems = [
//     {
//       label: 'Teaching',
//       icon: '👨‍🏫',
//       submenu: [
//         { label: 'My Courses', href: '/dashboard/instructor/courses', icon: '📚', id: 'instructor-courses' },
//         { label: 'Create Course', href: '/dashboard/instructor/create', icon: '➕', id: 'create-course' },
//         { label: 'Students', href: '#', icon: '👥', id: 'students' },
//         { label: 'Analytics', href: '#', icon: '📈', id: 'analytics' },
//       ],
//       id: 'teaching',
//     },
//   ]

//   // Admin specific menu
//   const adminMenuItems = [
//     {
//       label: 'Admin',
//       icon: '⚙️',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard/admin', icon: '📊', id: 'admin-dashboard' },
//         { label: 'Categories', href: '/dashboard/admin/categories', icon: '📑', id: 'categories' },
//         { label: 'Tags', href: '/dashboard/admin/tags', icon: '🏷️', id: 'tags' },
//         { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: '🧹', id: 'cleanup' },
//         { label: 'Users', href: '#', icon: '👥', id: 'users' },
//       ],
//       id: 'admin',
//     },
//   ]

//   // Get menu items based on user role - FIXED: Admin should not see Teaching menu
//   const getMenuItems = () => {
//     if (!user) return commonMenuItems
    
//     switch (user.primaryRole) {
//       case 'admin':
//         return [...commonMenuItems, ...adminMenuItems] // Removed instructorMenuItems for admin
//       case 'instructor':
//         return [...commonMenuItems, ...instructorMenuItems]
//       case 'student':
//         return [...commonMenuItems, ...studentMenuItems]
//       default:
//         return commonMenuItems
//     }
//   }

//   const menuItems = getMenuItems()

//   // Check if a link is active
//   const isLinkActive = (href: string) => {
//     if (href === '/dashboard' && pathname === '/dashboard') return true
//     if (href !== '/dashboard' && pathname.startsWith(href)) return true
//     return false
//   }

//   // Find active menu item
//   const findActiveMenuItem = () => {
//     for (const item of menuItems) {
//       for (const subitem of item.submenu) {
//         if (isLinkActive(subitem.href)) {
//           return subitem.id
//         }
//       }
//     }
//     return 'dashboard'
//   }

//   const activeMenuItem = findActiveMenuItem()

//   // Mobile sidebar overlay
//   const MobileOverlay = () => (
//     <div 
//       className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
//         isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//       }`}
//       onClick={() => setIsMobileOpen(false)}
//     />
//   )

//   // Logo component with link to homepage
//   const Logo = () => (
//     <Link 
//       href="/" 
//       className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
//     >
//       <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
//         <span className="text-white font-bold">a</span>
//       </div>
//       {!isCollapsed && (
//         <div>
//           <h2 className="font-bold text-gray-900">AxioQuan</h2>
//           <p className="text-xs text-gray-500">Learning Platform</p>
//         </div>
//       )}
//     </Link>
//   )

//   // Collapsed logo component
//   const CollapsedLogo = () => (
//     <Link 
//       href="/" 
//       className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
//       title="Go to homepage"
//     >
//       <span className="text-white font-bold">a</span>
//     </Link>
//   )

//   // Sidebar content - FIXED: Made non-scrollable with proper spacing
//   const SidebarContent = () => (
//     <div className={`bg-white border-r border-gray-200 flex flex-col h-full ${
//       isCollapsed ? 'w-16' : 'w-64'
//     }`}>
//       {/* Fixed Header Section */}
//       <div className="flex-shrink-0 p-4 border-b border-gray-200">
//         {/* Logo and Toggle */}
//         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
//           {isCollapsed ? <CollapsedLogo /> : <Logo />}
          
//           {/* Desktop Toggle Button */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           >
//             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isCollapsed ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Scrollable Menu Section */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-4">
//           {/* Main Menu */}
//           <nav className="space-y-2">
//             {menuItems.map((item) => (
//               <div key={item.id}>
//                 {/* Main Menu Item */}
//                 {isCollapsed ? (
//                   // Collapsed view - just icon
//                   <button
//                     onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                     className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
//                       expandedMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//                     }`}
//                     title={item.label}
//                   >
//                     <span className="text-lg">{item.icon}</span>
//                   </button>
//                 ) : (
//                   // Expanded view - full label
//                   <button
//                     onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                     className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
//                   >
//                     <div className="flex items-center gap-2">
//                       <span>{item.icon}</span>
//                       <span>{item.label}</span>
//                     </div>
//                     <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
//                       ▼
//                     </span>
//                   </button>
//                 )}

//                 {/* Submenu Items */}
//                 {expandedMenu === item.id && (
//                   <div className={`space-y-1 mt-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}>
//                     {item.submenu.map((subitem) => (
//                       <Link
//                         key={subitem.id}
//                         href={subitem.href}
//                         className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                           isLinkActive(subitem.href)
//                             ? 'bg-blue-50 text-blue-600 font-medium'
//                             : 'text-gray-600 hover:bg-gray-100'
//                         } ${isCollapsed ? 'justify-center' : ''}`}
//                         title={isCollapsed ? subitem.label : undefined}
//                       >
//                         <span>{subitem.icon}</span>
//                         {!isCollapsed && <span>{subitem.label}</span>}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Fixed Footer Section - User Profile */}
//       {!isCollapsed && user && (
//         <div className="flex-shrink-0 border-t border-gray-200">
//           <div className="p-4">
//             <UserProfileNav
//               userName={user.name || 'User'}
//               userEmail={user.email || 'user@example.com'}
//               userRole={user.primaryRole || 'user'}
//               userImage={user.image}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   )

//   return (
//     <>
//       {/* Mobile Hamburger Button - FIXED: Moved to top with more spacing */}
//       <button
//         onClick={() => setIsMobileOpen(true)}
//         className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
//         style={{ marginTop: '0' }}
//       >
//         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       {/* Mobile Overlay */}
//       <MobileOverlay />

//       {/* Sidebar */}
//       <aside className={`
//         fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
//         ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0
//       `}>
//         <SidebarContent />
//       </aside>

//       {/* Close mobile sidebar when clicking outside */}
//       {isMobileOpen && (
//         <div 
//           className="lg:hidden fixed inset-0 z-40"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}
//     </>
//   )
// }















// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { UserProfileNav } from './user-profile-nav'

// interface SidebarProps {
//   user: any
// }

// export default function Sidebar({ user }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [isMobileOpen, setIsMobileOpen] = useState(false)
//   const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')
//   const pathname = usePathname()

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setIsMobileOpen(false)
//   }, [pathname])

//   // Close mobile sidebar on resize to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsMobileOpen(false)
//       }
//     }

//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   // Common menu items for all roles
//   const commonMenuItems = [
//     {
//       label: 'Learn',
//       icon: '📚',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard', icon: '📊', id: 'dashboard' },
//         { label: 'Profile', href: '/dashboard/profile', icon: '👤', id: 'profile' },
//         { label: 'Courses', href: '/courses', icon: '🎓', id: 'courses' },
//         { label: 'Certificates', href: '#', icon: '📜', id: 'certificates' },
//       ],
//       id: 'learn',
//     },
//   ]

//   // Student specific menu
//   const studentMenuItems = [
//     {
//       label: 'My Learning',
//       icon: '📖',
//       submenu: [
//         { label: 'My Courses', href: '#', icon: '📚', id: 'my-courses' },
//         { label: 'In Progress', href: '#', icon: '⏳', id: 'in-progress' },
//         { label: 'Completed', href: '#', icon: '✅', id: 'completed' },
//       ],
//       id: 'my-learning',
//     },
//   ]

//   // Instructor specific menu
//   const instructorMenuItems = [
//     {
//       label: 'Teaching',
//       icon: '👨‍🏫',
//       submenu: [
//         { label: 'My Courses', href: '/dashboard/instructor/courses', icon: '📚', id: 'instructor-courses' },
//         { label: 'Create Course', href: '/dashboard/instructor/create', icon: '➕', id: 'create-course' },
//         { label: 'Students', href: '#', icon: '👥', id: 'students' },
//         { label: 'Analytics', href: '#', icon: '📈', id: 'analytics' },
//       ],
//       id: 'teaching',
//     },
//   ]

//   // Admin specific menu
//   const adminMenuItems = [
//     {
//       label: 'Admin',
//       icon: '⚙️',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard/admin', icon: '📊', id: 'admin-dashboard' },
//         { label: 'Categories', href: '/dashboard/admin/categories', icon: '📑', id: 'categories' },
//         { label: 'Tags', href: '/dashboard/admin/tags', icon: '🏷️', id: 'tags' },
//         { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: '🧹', id: 'cleanup' },
//         { label: 'Users', href: '#', icon: '👥', id: 'users' },
//       ],
//       id: 'admin',
//     },
//   ]

//   // Get menu items based on user role - FIXED: Admin should not see Teaching menu
//   const getMenuItems = () => {
//     if (!user) return commonMenuItems
    
//     switch (user.primaryRole) {
//       case 'admin':
//         return [...commonMenuItems, ...adminMenuItems] // Removed instructorMenuItems for admin
//       case 'instructor':
//         return [...commonMenuItems, ...instructorMenuItems]
//       case 'student':
//         return [...commonMenuItems, ...studentMenuItems]
//       default:
//         return commonMenuItems
//     }
//   }

//   const menuItems = getMenuItems()

//   // Check if a link is active
//   const isLinkActive = (href: string) => {
//     if (href === '/dashboard' && pathname === '/dashboard') return true
//     if (href !== '/dashboard' && pathname.startsWith(href)) return true
//     return false
//   }

//   // Find active menu item
//   const findActiveMenuItem = () => {
//     for (const item of menuItems) {
//       for (const subitem of item.submenu) {
//         if (isLinkActive(subitem.href)) {
//           return subitem.id
//         }
//       }
//     }
//     return 'dashboard'
//   }

//   const activeMenuItem = findActiveMenuItem()

//   // Mobile sidebar overlay
//   const MobileOverlay = () => (
//     <div 
//       className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
//         isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//       }`}
//       onClick={() => setIsMobileOpen(false)}
//     />
//   )

//   // Logo component with link to homepage
//   const Logo = () => (
//     <Link 
//       href="/" 
//       className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
//     >
//       <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
//         <span className="text-white font-bold">A</span>
//       </div>
//       {!isCollapsed && (
//         <div>
//           <h2 className="font-bold text-gray-900">AxioQuan</h2>
//           <p className="text-xs text-gray-500">Learning Platform</p>
//         </div>
//       )}
//     </Link>
//   )

//   // Collapsed logo component
//   const CollapsedLogo = () => (
//     <Link 
//       href="/" 
//       className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
//       title="Go to homepage"
//     >
//       <span className="text-white font-bold">a</span>
//     </Link>
//   )

//   // Sidebar content - FIXED: Completely fixed position
//   const SidebarContent = () => (
//     <div className={`bg-white border-r border-gray-200 flex flex-col h-screen fixed ${
//       isCollapsed ? 'w-16' : 'w-64'
//     }`}>
//       {/* Fixed Header Section */}
//       <div className="flex-shrink-0 p-4 border-b border-gray-200">
//         {/* Logo and Toggle */}
//         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
//           {isCollapsed ? <CollapsedLogo /> : <Logo />}
          
//           {/* Desktop Toggle Button */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           >
//             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isCollapsed ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Menu Section - Fixed, non-scrollable */}
//       <div className="flex-1 p-4">
//         {/* Main Menu */}
//         <nav className="space-y-2">
//           {menuItems.map((item) => (
//             <div key={item.id}>
//               {/* Main Menu Item */}
//               {isCollapsed ? (
//                 // Collapsed view - just icon
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
//                     expandedMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                   title={item.label}
//                 >
//                   <span className="text-lg">{item.icon}</span>
//                 </button>
//               ) : (
//                 // Expanded view - full label
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>{item.icon}</span>
//                     <span>{item.label}</span>
//                   </div>
//                   <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
//                     ▼
//                   </span>
//                 </button>
//               )}

//               {/* Submenu Items */}
//               {expandedMenu === item.id && (
//                 <div className={`space-y-1 mt-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}>
//                   {item.submenu.map((subitem) => (
//                     <Link
//                       key={subitem.id}
//                       href={subitem.href}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                         isLinkActive(subitem.href)
//                           ? 'bg-blue-50 text-blue-600 font-medium'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       } ${isCollapsed ? 'justify-center' : ''}`}
//                       title={isCollapsed ? subitem.label : undefined}
//                     >
//                       <span>{subitem.icon}</span>
//                       {!isCollapsed && <span>{subitem.label}</span>}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Fixed Footer Section - User Profile */}
//       {!isCollapsed && user && (
//         <div className="flex-shrink-0 p-4 border-t border-gray-200">
//           <UserProfileNav
//             userName={user.name || 'User'}
//             userEmail={user.email || 'user@example.com'}
//             userRole={user.primaryRole || 'user'}
//             userImage={user.image}
//           />
//         </div>
//       )}
//     </div>
//   )

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         onClick={() => setIsMobileOpen(true)}
//         className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
//       >
//         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       {/* Mobile Overlay */}
//       <MobileOverlay />

//       {/* Sidebar - FIXED: Completely fixed on both mobile and desktop */}
//       <div className={`
//         ${isMobileOpen ? 'block' : 'hidden'}
//         lg:block
//       `}>
//         <SidebarContent />
//       </div>

//       {/* Close mobile sidebar when clicking outside */}
//       {isMobileOpen && (
//         <div 
//           className="lg:hidden fixed inset-0 z-40"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}
//     </>
//   )
// }























// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { UserProfileNav } from './user-profile-nav'

// interface SidebarProps {
//   user: any
// }

// export default function Sidebar({ user }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [isMobileOpen, setIsMobileOpen] = useState(false)
//   const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')
//   const pathname = usePathname()

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setIsMobileOpen(false)
//   }, [pathname])

//   // Close mobile sidebar on resize to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsMobileOpen(false)
//       }
//     }

//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   // Common menu items for all roles
//   const commonMenuItems = [
//     {
//       label: 'Learn',
//       icon: '📚',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard', icon: '📊', id: 'dashboard' },
//         { label: 'Profile', href: '/dashboard/profile', icon: '👤', id: 'profile' },
//         { label: 'Courses', href: '/courses', icon: '🎓', id: 'courses' },
//         { label: 'Certificates', href: '#', icon: '📜', id: 'certificates' },
//       ],
//       id: 'learn',
//     },
//   ]

//   // Student specific menu
//   const studentMenuItems = [
//     {
//       label: 'My Learning',
//       icon: '📖',
//       submenu: [
//         { label: 'My Courses', href: '#', icon: '📚', id: 'my-courses' },
//         { label: 'In Progress', href: '#', icon: '⏳', id: 'in-progress' },
//         { label: 'Completed', href: '#', icon: '✅', id: 'completed' },
//       ],
//       id: 'my-learning',
//     },
//   ]

//   // Instructor specific menu
//   const instructorMenuItems = [
//     {
//       label: 'Teaching',
//       icon: '👨‍🏫',
//       submenu: [
//         { label: 'My Courses', href: '/dashboard/instructor/courses', icon: '📚', id: 'instructor-courses' },
//         { label: 'Create Course', href: '/dashboard/instructor/create', icon: '➕', id: 'create-course' },
//         { label: 'Students', href: '#', icon: '👥', id: 'students' },
//         { label: 'Analytics', href: '#', icon: '📈', id: 'analytics' },
//       ],
//       id: 'teaching',
//     },
//   ]

//   // Admin specific menu
//   const adminMenuItems = [
//     {
//       label: 'Admin',
//       icon: '⚙️',
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard/admin', icon: '📊', id: 'admin-dashboard' },
//         { label: 'Categories', href: '/dashboard/admin/categories', icon: '📑', id: 'categories' },
//         { label: 'Tags', href: '/dashboard/admin/tags', icon: '🏷️', id: 'tags' },
//         { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: '🧹', id: 'cleanup' },
//         { label: 'Users', href: '#', icon: '👥', id: 'users' },
//       ],
//       id: 'admin',
//     },
//   ]

//   // Get menu items based on user role - FIXED: Admin should not see Teaching menu
//   const getMenuItems = () => {
//     if (!user) return commonMenuItems
    
//     switch (user.primaryRole) {
//       case 'admin':
//         return [...commonMenuItems, ...adminMenuItems] // Removed instructorMenuItems for admin
//       case 'instructor':
//         return [...commonMenuItems, ...instructorMenuItems]
//       case 'student':
//         return [...commonMenuItems, ...studentMenuItems]
//       default:
//         return commonMenuItems
//     }
//   }

//   const menuItems = getMenuItems()

//   // Check if a link is active
//   const isLinkActive = (href: string) => {
//     if (href === '/dashboard' && pathname === '/dashboard') return true
//     if (href !== '/dashboard' && pathname.startsWith(href)) return true
//     return false
//   }

//   // Find active menu item
//   const findActiveMenuItem = () => {
//     for (const item of menuItems) {
//       for (const subitem of item.submenu) {
//         if (isLinkActive(subitem.href)) {
//           return subitem.id
//         }
//       }
//     }
//     return 'dashboard'
//   }

//   const activeMenuItem = findActiveMenuItem()

//   // Mobile sidebar overlay
//   const MobileOverlay = () => (
//     <div 
//       className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
//         isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//       }`}
//       onClick={() => setIsMobileOpen(false)}
//     />
//   )

//   // Logo component with link to homepage
//   const Logo = () => (
//     <Link 
//       href="/" 
//       className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
//     >
//       <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
//         <span className="text-white font-bold">a</span>
//       </div>
//       {!isCollapsed && (
//         <div>
//           <h2 className="font-bold text-gray-900">AxioQuan</h2>
//           <p className="text-xs text-gray-500">Learning Platform</p>
//         </div>
//       )}
//     </Link>
//   )

//   // Collapsed logo component
//   const CollapsedLogo = () => (
//     <Link 
//       href="/" 
//       className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
//       title="Go to homepage"
//     >
//       <span className="text-white font-bold">a</span>
//     </Link>
//   )

//   // Sidebar content - FIXED: Completely fixed position
//   const SidebarContent = () => (
//     <div className={`bg-white border-r border-gray-200 flex flex-col h-screen fixed ${
//       isCollapsed ? 'w-16' : 'w-64'
//     }`}>
//       {/* Fixed Header Section */}
//       <div className="flex-shrink-0 p-4 border-b border-gray-200">
//         {/* Logo and Toggle */}
//         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
//           {isCollapsed ? <CollapsedLogo /> : <Logo />}
          
//           {/* Desktop Toggle Button */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           >
//             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isCollapsed ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Menu Section - Fixed, non-scrollable */}
//       <div className="flex-1 p-4">
//         {/* Main Menu */}
//         <nav className="space-y-2">
//           {menuItems.map((item) => (
//             <div key={item.id}>
//               {/* Main Menu Item */}
//               {isCollapsed ? (
//                 // Collapsed view - just icon
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
//                     expandedMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                   title={item.label}
//                 >
//                   <span className="text-lg">{item.icon}</span>
//                 </button>
//               ) : (
//                 // Expanded view - full label
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>{item.icon}</span>
//                     <span>{item.label}</span>
//                   </div>
//                   <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
//                     ▼
//                   </span>
//                 </button>
//               )}

//               {/* Submenu Items */}
//               {expandedMenu === item.id && (
//                 <div className={`space-y-1 mt-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}>
//                   {item.submenu.map((subitem) => (
//                     <Link
//                       key={subitem.id}
//                       href={subitem.href}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                         isLinkActive(subitem.href)
//                           ? 'bg-blue-50 text-blue-600 font-medium'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       } ${isCollapsed ? 'justify-center' : ''}`}
//                       title={isCollapsed ? subitem.label : undefined}
//                     >
//                       <span>{subitem.icon}</span>
//                       {!isCollapsed && <span>{subitem.label}</span>}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Fixed Footer Section - User Profile */}
//       {!isCollapsed && user && (
//         <div className="flex-shrink-0 p-4 border-t border-gray-200">
//           <UserProfileNav
//             userName={user.name || 'User'}
//             userEmail={user.email || 'user@example.com'}
//             userRole={user.primaryRole || 'user'}
//             userImage={user.image}
//           />
//         </div>
//       )}
//     </div>
//   )

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         onClick={() => setIsMobileOpen(true)}
//         className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
//       >
//         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       {/* Mobile Overlay */}
//       <MobileOverlay />

//       {/* Sidebar - FIXED: Completely fixed on both mobile and desktop */}
//       <div className={`
//         ${isMobileOpen ? 'block' : 'hidden'}
//         lg:block
//       `}>
//         <SidebarContent />
//       </div>

//       {/* Close mobile sidebar when clicking outside */}
//       {isMobileOpen && (
//         <div 
//           className="lg:hidden fixed inset-0 z-40"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}
//     </>
//   )
// }




















// // /components/dashboard/sidebar.tsx

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { UserProfileNav } from './user-profile-nav'

interface SidebarProps {
  user: any
}

export default function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')
  const pathname = usePathname()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Common menu items for all roles
  const commonMenuItems = [
    {
      label: 'Menu',
      icon: '📚',
      submenu: [
        { label: 'Dashboard', href: '/dashboard', icon: '📊', id: 'dashboard' },
        { label: 'Profile', href: '/dashboard/profile', icon: '👤', id: 'profile' },
        { label: 'Courses', href: '/courses', icon: '🎓', id: 'courses' },
        { label: 'Inbox', href: '/dashboard/inbox', icon: '📬', id: 'inbox' },
        // { label: 'Certificates', href: '#', icon: '📜', id: 'certificates' },
      ],
      id: 'Menu',
    },
  ]

  // Student specific menu
  // Student specific menu
  // Student specific menu
  const studentMenuItems = [
    {
      label: 'My Learning',
      icon: '📖',
      submenu: [
        { label: 'My Courses', href: '/dashboard/my-courses', icon: '📚', id: 'my-courses' },
        { label: 'Progress', href: '/dashboard/progress', icon: '📊', id: 'progress' }, 
        { label: 'Certificates', href: '/dashboard/certificates', icon: '📜', id: 'certificates' },

        { label: 'In Progress', href: '#', icon: '⏳', id: 'in-progress' },
        { label: 'Completed', href: '#', icon: '✅', id: 'completed' },
      ],
      id: 'my-learning',
    },
  ]

  // Instructor specific menu
  const instructorMenuItems = [
    {
      label: 'Teaching',
      icon: '👨‍🏫',
      submenu: [
        { label: 'My Courses', href: '/dashboard/instructor/courses', icon: '📚', id: 'instructor-courses' },
        { label: 'Create Course', href: '/dashboard/instructor/create', icon: '➕', id: 'create-course' },
        { label: 'Certificates', href: '/dashboard/instructor/certificates', icon: '📜', id: 'certificates' },
        
        { label: 'Students', href: '#', icon: '👥', id: 'students' },
        { label: 'Analytics', href: '#', icon: '📈', id: 'analytics' },
      ],
      id: 'teaching',
    },
  ]

  // Admin specific menu
  const adminMenuItems = [
    {
      label: 'Admin',
      icon: '⚙️',
      submenu: [
        { label: 'Dashboard', href: '/dashboard/admin', icon: '📊', id: 'admin-dashboard' },
        { label: 'Categories', href: '/dashboard/admin/categories', icon: '📑', id: 'categories' },
        { label: 'Tags', href: '/dashboard/admin/tags', icon: '🏷️', id: 'tags' },
        { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: '🧹', id: 'cleanup' },
        { label: 'Users', href: '#', icon: '👥', id: 'users' },
      ],
      id: 'admin',
    },
  ]

  // Get menu items based on user role - FIXED: Admin should not see Teaching menu
  const getMenuItems = () => {
    if (!user) return commonMenuItems
    
    switch (user.primaryRole) {
      case 'admin':
        return [...commonMenuItems, ...adminMenuItems] // Removed instructorMenuItems for admin
      case 'instructor':
        return [...commonMenuItems, ...instructorMenuItems]
      case 'student':
        return [...commonMenuItems, ...studentMenuItems]
      default:
        return commonMenuItems
    }
  }

  const menuItems = getMenuItems()

  // Check if a link is active
  const isLinkActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true
    if (href !== '/dashboard' && pathname.startsWith(href)) return true
    return false
  }

  // Find active menu item
  const findActiveMenuItem = () => {
    for (const item of menuItems) {
      for (const subitem of item.submenu) {
        if (isLinkActive(subitem.href)) {
          return subitem.id
        }
      }
    }
    return 'dashboard'
  }

  const activeMenuItem = findActiveMenuItem()

  // Mobile sidebar overlay
  const MobileOverlay = () => (
    <div 
      className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
        isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsMobileOpen(false)}
    />
  )

  // Logo component with link to homepage
  const Logo = () => (
    <Link 
      href="/" 
      className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
    >
      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
        <span className="text-white font-bold">A</span>
      </div>
      {!isCollapsed && (
        <div>
          <h2 className="font-bold text-gray-900">AxioQuan</h2>
          <p className="text-xs text-gray-500">Learning Platform</p>
        </div>
      )}
    </Link>
  )

  // Collapsed logo component
  const CollapsedLogo = () => (
    <Link 
      href="/" 
      className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
      title="Go to homepage"
    >
      <span className="text-white font-bold">a</span>
    </Link>
  )

  // Sidebar content
  const SidebarContent = () => (
    <div className={`bg-white border-r border-gray-200 flex flex-col h-screen ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        {/* Logo and Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {isCollapsed ? <CollapsedLogo /> : <Logo />}
          
          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Section - Fixed, non-scrollable */}
      <div className="flex-1 p-4">
        {/* Main Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Main Menu Item */}
              {isCollapsed ? (
                // Collapsed view - just icon
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
                    expandedMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={item.label}
                >
                  <span className="text-lg">{item.icon}</span>
                </button>
              ) : (
                // Expanded view - full label
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
              )}

              {/* Submenu Items */}
              {expandedMenu === item.id && (
                <div className={`space-y-1 mt-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}>
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.id}
                      href={subitem.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isLinkActive(subitem.href)
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? subitem.label : undefined}
                    >
                      <span>{subitem.icon}</span>
                      {!isCollapsed && <span>{subitem.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Fixed Footer Section - User Profile */}
      {!isCollapsed && user && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <UserProfileNav
            userName={user.name || 'User'}
            userEmail={user.email || 'user@example.com'}
            userRole={user.primaryRole || 'user'}
            userImage={user.image}
          />
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Hamburger Button */}
            {/* Mobile Hamburger Button - Now Floating Bottom Left */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-4 bg-white rounded-full shadow-2xl border border-gray-200 hover:bg-gray-50 transition-colors hover:shadow-3xl"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button> */}

      {/* Mobile Overlay */}
      <MobileOverlay />

      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Only visible when open */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </div>
    </>
  )
}