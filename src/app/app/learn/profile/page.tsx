// /src/app/dashboard/profile/page.tsx
import { withSessionRefresh } from '@/lib/auth/utils';
import { CompleteProfileForm } from '@/components/users/complete-profile-form';
import { DeleteAccountForm } from '@/components/users/delete-account-form';
import { ChangePasswordForm } from '@/components/users/change-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage() {
  // Use the existing session refresh utility for protection
  const session = await withSessionRefresh();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Replace the existing ProfileForm with CompleteProfileForm */}
      <CompleteProfileForm />

      {/* Keep the existing security sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Change Password */}
        <ChangePasswordForm />

        {/* Right Column - Danger Zone */}
        <div className="space-y-6">
          <DeleteAccountForm />
          
          {/* Additional security settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Session Management</p>
                    <p className="text-sm text-gray-600">
                      Manage your active sessions
                    </p>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                    Manage Sessions
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}