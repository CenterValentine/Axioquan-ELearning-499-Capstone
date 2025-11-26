'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { ActiveLink } from '@/components/ui/active-link';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-xl hidden sm:inline">AxioQuan</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <ActiveLink href="/">
              Home
            </ActiveLink>

            <ActiveLink href="/courses">
              Courses
            </ActiveLink>

            <ActiveLink href="/categories">
              Categories
            </ActiveLink>

            <ActiveLink href="#">
              About
            </ActiveLink>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Input - Commented out for future use */}
            {/*
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition w-48"
              />
            </div>
            */}

            <ActiveLink 
              href="/login"
              className="px-4 py-2 font-semibold rounded-lg transition border border-transparent"
              activeClassName="bg-primary/20 text-primary"
              inactiveClassName="text-primary hover:bg-primary/10"
            >
              Login
            </ActiveLink>

            <ActiveLink 
              href="/signup"
              className="px-6 py-2 font-semibold rounded-lg transition border border-transparent"
              activeClassName="bg-primary text-primary-foreground"
              inactiveClassName="text-primary border hover:bg-primary/10"
            >
              Sign Up
            </ActiveLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Search Icon - Commented out for future use */}
            {/*
            <Button variant="ghost" size="icon" className="text-foreground">
              <Search className="h-5 w-5" />
            </Button>
            */}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <ActiveLink 
                href="/" 
                className="block"
                activeClassName="bg-primary/20 text-primary"
                inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
                onClick={closeMenu}
              >
                Home
              </ActiveLink>

              <ActiveLink 
                href="/courses" 
                className="block"
                activeClassName="bg-primary/20 text-primary"
                inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
                onClick={closeMenu}
              >
                Courses
              </ActiveLink>

              <ActiveLink 
                href="/categories" 
                className="block"
                activeClassName="bg-primary/20 text-primary"
                inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
                onClick={closeMenu}
              >
                Categories
              </ActiveLink>

              <ActiveLink 
                href="#" 
                className="block"
                activeClassName="bg-primary/20 text-primary"
                inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
                onClick={closeMenu}
              >
                About
              </ActiveLink>

              {/* Mobile Search - Commented out for future use */}
              {/*
              <div className="pt-2 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition"
                  />
                </div>
              </div>
              */}

              {/* Mobile Auth Buttons */}
              <div className="pt-2 flex flex-col gap-3">
                <ActiveLink 
                  href="/login"
                  className="block text-center px-4 py-2 font-semibold rounded-lg transition border"
                  activeClassName="bg-primary/20 text-primary"
                  inactiveClassName="text-primary hover:bg-primary/10"
                  onClick={closeMenu}
                >
                  Login
                </ActiveLink>

                <ActiveLink 
                  href="/signup"
                  className="block text-center px-4 py-2 font-semibold rounded-lg transition border"
                  activeClassName="bg-primary text-primary-foreground"
                  inactiveClassName="text-primary border hover:bg-primary/10"
                  onClick={closeMenu}
                >
                  Sign Up
                </ActiveLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}