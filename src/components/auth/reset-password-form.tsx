// // /src/components/auth/reset-password-form.tsx

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validateResetToken, resetPasswordWithToken } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(!!token);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<{
    isValid: boolean;
    message: string;
    user?: { email: string; name: string };
  } | null>(null);
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    setIsValidating(true);
    try {
      const result = await validateResetToken(token!);
      setTokenStatus(result);
    } catch (error) {
      setTokenStatus({
        isValid: false,
        message: 'Failed to validate token',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !tokenStatus?.isValid) return;

    setIsLoading(true);
    try {
      // Use undefined instead of null for optional fields
      const result = await resetPasswordWithToken({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        ipAddress: undefined, // Use undefined instead of null
        userAgent: navigator.userAgent,
      });

      if (result.success) {
        // Show success message and redirect
        setTokenStatus(prev => prev ? {
          ...prev,
          message: result.message,
          isValid: true,
        } : null);
        
        // Reset form
        reset();
        
        // Redirect to login page after successful reset
        setTimeout(() => {
          router.push('/login?message=password-reset-success');
        }, 3000);
      } else {
        // Show error message
        setTokenStatus(prev => prev ? {
          ...prev,
          message: result.message,
          isValid: false,
        } : null);
      }
    } catch (error) {
      setTokenStatus(prev => prev ? {
        ...prev,
        message: 'An unexpected error occurred',
        isValid: false,
      } : null);
    } finally {
      setIsLoading(false);
    }
  };

  // No token provided
  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            Please check your email for the password reset link, or request a new one.
          </p>
        </div>
        <div className="text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  // Validating token
  if (isValidating) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Validating reset token...</p>
      </div>
    );
  }

  // Invalid token
  if (!tokenStatus?.isValid) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{tokenStatus?.message || 'Invalid reset token'}</p>
        </div>
        <p className="text-sm text-gray-600">
          The reset link may have expired. Please request a new password reset.
        </p>
        <div className="text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  // Success case after reset
  if (tokenStatus.isValid && tokenStatus.message.includes('successfully')) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium">{tokenStatus.message}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Redirecting to login page...
        </p>
      </div>
    );
  }

  // Valid token - show password form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {tokenStatus.user && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800 text-sm">
            Resetting password for: <strong>{tokenStatus.user.email}</strong>
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter your new password"
            {...register('newPassword')}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-600">{errors.newPassword.message}</p>
        )}
        <p className="text-xs text-gray-600">
          Password must be at least 8 characters with uppercase, lowercase, number, and special character.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            {...register('confirmPassword')}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resetting password...
          </>
        ) : (
          'Reset password'
        )}
      </button>
    </form>
  );
}