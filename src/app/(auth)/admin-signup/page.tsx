

// // /src/app/(auth)/admin-signup/page.tsx

import { AdminSignUpForm } from '@/components/auth/admin-signup-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';

export default function AdminSignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Registration
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Create an administrator account with full platform access
            </p>
          </div>
          <AdminSignUpForm />
          
          {/* Single Regular Signup Link - No duplicate */}
          <div className="text-center">
            <Link 
              href="/signup" 
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Need a regular user account?
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}