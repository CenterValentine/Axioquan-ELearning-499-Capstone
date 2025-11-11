
// /src/components/users/profile-completion-progress.tsx
'use client';

import { useEffect, useState } from 'react';

interface ProfileCompletionProgressProps {
  profile: any;
}

export function ProfileCompletionProgress({ profile }: ProfileCompletionProgressProps) {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    calculateCompletion();
  }, [profile]);

  const calculateCompletion = () => {
    let completedFields = 0;
    const totalFields = 8; // Important profile fields

    if (profile?.name) completedFields++;
    if (profile?.bio) completedFields++;
    if (profile?.headline) completedFields++;
    if (profile?.image) completedFields++;
    if (profile?.skills?.length > 0) completedFields++;
    if (profile?.learning_goals?.length > 0) completedFields++;
    if (profile?.location) completedFields++;
    if (profile?.company) completedFields++;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  };

  if (completionPercentage === 100) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-blue-800">Profile Completion</h3>
        <span className="text-sm text-blue-600">{completionPercentage}%</span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-blue-600 mt-2">
        Complete your profile to unlock all features
      </p>
    </div>
  );
}