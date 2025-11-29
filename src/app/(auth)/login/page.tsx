
// // /src/app/(auth)/login/page.tsx

import LoginForm from '@/components/auth/login-form';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Admin Access Button - Positioned absolutely */}
        <div className="absolute top-4 right-4">
          <Link 
            href="/admin-signup" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Admin Access
          </Link>
        </div>
        
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <a
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
              </a>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}