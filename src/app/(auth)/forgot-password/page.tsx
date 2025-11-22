
// // /src/app/(auth)/forgot-password/page.tsx

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Admin Access Button - Positioned absolutely to avoid header overlap */}
        <div className="absolute top-4 right-4">
          <Link 
            href="/admin-signup" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Admin Access
          </Link>
        </div>
        
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Reset your password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm />
              <div className="mt-4 text-center text-sm">
                <Link href="/login" className="text-blue-600 hover:underline">
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}