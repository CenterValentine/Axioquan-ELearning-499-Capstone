
// // /src/app/(auth)/reset-password/page.tsx

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Header } from '@/components/shell/header';
import { Footer } from '@/components/shell/footer';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                {token ? 'Set new password' : 'Check your email'}
              </CardTitle>
              <CardDescription>
                {token 
                  ? "Enter your new password below" 
                  : "Check your email for the reset link"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm token={token} />
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