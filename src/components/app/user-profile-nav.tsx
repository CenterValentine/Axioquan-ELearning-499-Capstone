
// /src/components/dashboard/user-profile-nav.tsx
'use client';

import { useState, ReactElement } from 'react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';

interface UserProfileNavProps {
  userName: string;
  userEmail: string;
  userRole: string;
  userImage?: string;
}

export function UserProfileNav({ 
  userName, 
  userEmail, 
  userRole, 
  userImage 
}: UserProfileNavProps): ReactElement {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDropdownToggle = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = (): void => {
    setIsDropdownOpen(false);
  };

  const handleImageError = (): void => {
    setImageError(true);
  };

  const shouldShowImage = userImage && !imageError;

  return (
    <div className="mt-4 relative">
      {/* User Profile Card */}
      <div 
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={handleDropdownToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDropdownToggle();
          }
        }}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        {/* Profile Image - Show image if available and no error */}
        <div className="flex-shrink-0">
          {shouldShowImage ? (
            <img
              src={userImage}
              alt={`${userName}'s profile`}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              onError={handleImageError}
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
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2 space-y-1">
            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              onClick={handleLinkClick}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Edit Profile</span>
            </Link>
            
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              onClick={handleLinkClick}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <LogoutButton 
              variant="dropdown"
              onLogout={handleLinkClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}