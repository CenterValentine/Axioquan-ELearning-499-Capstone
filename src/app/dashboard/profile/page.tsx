// /src/app/dashboard/profile/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { ProfileForm } from '@/components/users/profile-form';
import { DeleteAccountForm } from '@/components/users/delete-account-form';
import { ChangePasswordForm } from '@/components/users/change-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>

          {/* Change Password */}
          <ChangePasswordForm />
        </div>

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
                  <Button variant="outline" size="sm">
                    Manage Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

