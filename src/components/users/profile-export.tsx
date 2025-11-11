
// /src/components/users/profile-export.tsx
'use client';

import { Button } from '@/components/ui/button';

interface ProfileExportProps {
  profile: any;
}

export function ProfileExport({ profile }: ProfileExportProps) {
  const exportProfile = () => {
    if (!profile) {
      alert('No profile data available to export.');
      return;
    }

    const profileData = {
      basicInfo: {
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        headline: profile.headline,
        location: profile.location,
        company: profile.company,
        website: profile.website
      },
      social: {
        twitter: profile.twitter_username,
        github: profile.github_username,
        linkedin: profile.linkedin_url,
        youtube: profile.youtube_channel
      },
      skills: profile.skills,
      learningGoals: profile.learning_goals,
      preferredTopics: profile.preferred_topics,
      exportedAt: new Date().toISOString(),
      platform: 'AxioQuan'
    };

    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axioquan-profile-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={exportProfile}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <span>📥</span>
      <span>Export Profile Data</span>
    </Button>
  );
}