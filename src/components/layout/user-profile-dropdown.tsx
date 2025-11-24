// /src/components/layout/user-profile-dropdown.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from "lucide-react";

interface UserProfileDropdownProps {
  user: {
    name: string;
    email: string;
    primaryRole: string;
  };
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user image from the session
  useEffect(() => {
    const getUserImage = async () => {
      try {
        // Get the current session to access user image
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            // The image might be in the session data, but we need to get it from the user profile
            // Let's try to get the user profile directly
            const profileResponse = await fetch('/api/user/profile');
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.user?.image) {
                setUserImage(profileData.user.image);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to get user image:', error);
      }
    };

    getUserImage();
  }, []);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      console.log('Starting logout process...');
      
      // Use the logout action from our auth actions
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Logout response status:', response.status);
      
      if (response.ok) {
        console.log('Logout successful, redirecting...');
        // Force a hard redirect to ensure complete logout
        window.location.href = '/login';
      } else {
        console.error('Logout failed with status:', response.status);
        const errorData = await response.json();
        console.error('Logout error details:', errorData);
        
        // Fallback: try the dashboard logout endpoint
        try {
          const fallbackResponse = await fetch('/dashboard/api/logout', { 
            method: 'POST' 
          });
          if (fallbackResponse.ok) {
            window.location.href = '/login';
          } else {
            throw new Error('Fallback logout also failed');
          }
        } catch (fallbackError) {
          console.error('Fallback logout failed:', fallbackError);
          // Last resort: redirect to login anyway
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Last resort: redirect to login anyway
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Profile Trigger */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
        disabled={isLoggingOut}
      >
        {/* Profile Avatar with Image or Initials */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          {userImage ? (
            <img 
              src={userImage} 
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, fall back to initials
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-white text-sm font-bold">
              {getInitials(user.name)}
            </span>
          )}
        </div>

        {/* User Info - Hidden on small screens */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 truncate max-w-32">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user.primaryRole}
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
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                {userImage ? (
                  <img 
                    src={userImage} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, fall back to initials
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">
                  {user.primaryRole}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsDropdownOpen(false)}
            >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
            </Link>
            
            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Profile</span>
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
              disabled={isLoggingOut}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}