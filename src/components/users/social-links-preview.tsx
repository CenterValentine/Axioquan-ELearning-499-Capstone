
// /src/components/users/social-links-preview.tsx
'use client';

interface SocialLinksPreviewProps {
  twitter_username?: string;
  github_username?: string;
  linkedin_url?: string;
  youtube_channel?: string;
  website?: string;
}

export function SocialLinksPreview({
  twitter_username,
  github_username,
  linkedin_url,
  youtube_channel,
  website
}: SocialLinksPreviewProps) {
  const hasSocialLinks = twitter_username || github_username || linkedin_url || youtube_channel || website;

  if (!hasSocialLinks) return null;

  const SocialIcon = ({ platform, url, username }: { platform: string; url: string; username?: string }) => (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
    >
      <span className="text-lg">
        {platform === 'twitter' && '🐦'}
        {platform === 'github' && '💻'}
        {platform === 'linkedin' && '💼'}
        {platform === 'youtube' && '📺'}
        {platform === 'website' && '🌐'}
      </span>
      <span className="text-sm">
        {username || 'Profile'}
      </span>
    </a>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Connect</h3>
      <div className="space-y-1">
        {twitter_username && (
          <SocialIcon 
            platform="twitter" 
            url={`https://twitter.com/${twitter_username}`}
            username={`@${twitter_username}`}
          />
        )}
        {github_username && (
          <SocialIcon 
            platform="github" 
            url={`https://github.com/${github_username}`}
            username={github_username}
          />
        )}
        {linkedin_url && (
          <SocialIcon 
            platform="linkedin" 
            url={linkedin_url}
            username="LinkedIn"
          />
        )}
        {youtube_channel && (
          <SocialIcon 
            platform="youtube" 
            url={`https://youtube.com/${youtube_channel}`}
            username="YouTube"
          />
        )}
        {website && (
          <SocialIcon 
            platform="website" 
            url={website}
            username="Website"
          />
        )}
      </div>
    </div>
  );
}

// Add default export for compatibility
export default SocialLinksPreview;