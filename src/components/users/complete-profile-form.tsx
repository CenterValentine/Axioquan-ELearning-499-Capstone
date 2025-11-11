// /src/components/users/complete-profile-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileImageUpload } from './profile-image-upload';
import { updateUserProfile, getUserProfile } from '@/lib/auth/profile-actions';
import { toast } from 'sonner';

// Enhanced profile validation schema
const profileSchema = z.object({
  // Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  bio: z.string().max(500).optional(),
  headline: z.string().max(200).optional(),
  
  // Location & Company
  location: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  website: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  
  // Social Media
  twitter_username: z.string().max(50).optional(),
  github_username: z.string().max(50).optional(),
  linkedin_url: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  youtube_channel: z.string().max(255).optional(),
  
  // Preferences
  timezone: z.string().optional(),
  locale: z.string().optional(),
  
  // Arrays (will be handled separately)
  skills: z.string().optional(),
  learning_goals: z.string().optional(),
  preferred_topics: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function CompleteProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileImage, setProfileImage] = useState('');
  const [userName, setUserName] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Watch bio for character count
  const bioValue = watch('bio') || '';

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const result = await getUserProfile();
      
      if (result.success && result.profile) {
        setProfileData(result.profile);
        setProfileImage(result.profile.image || '');
        setUserName(result.profile.name || result.profile.username);
        
        // Set form values
        reset({
          name: result.profile.name || '',
          bio: result.profile.bio || '',
          headline: result.profile.headline || '',
          location: result.profile.location || '',
          company: result.profile.company || '',
          website: result.profile.website || '',
          twitter_username: result.profile.twitter_username || '',
          github_username: result.profile.github_username || '',
          linkedin_url: result.profile.linkedin_url || '',
          youtube_channel: result.profile.youtube_channel || '',
          timezone: result.profile.timezone || 'UTC',
          locale: result.profile.locale || 'en-US',
          skills: Array.isArray(result.profile.skills) ? result.profile.skills.join(', ') : '',
          learning_goals: Array.isArray(result.profile.learning_goals) ? result.profile.learning_goals.join(', ') : '',
          preferred_topics: Array.isArray(result.profile.preferred_topics) ? result.profile.preferred_topics.join(', ') : '',
        });
      }
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      // Convert comma-separated strings to arrays
      const profileData = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        learning_goals: data.learning_goals ? data.learning_goals.split(',').map(s => s.trim()).filter(s => s) : [],
        preferred_topics: data.preferred_topics ? data.preferred_topics.split(',').map(s => s.trim()).filter(s => s) : [],
      };

      const result = await updateUserProfile(profileData);

      if (result.success) {
        toast.success('Profile updated successfully!');
        setUserName(data.name);
      } else {
        toast.error('Update failed', {
          description: result.errors?.[0] || result.message,
        });
      }
    } catch (error) {
      toast.error('Update failed', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your personal information and how you appear on AxioQuan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Photo</CardTitle>
              <CardDescription>
                This will be displayed on your profile and across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileImageUpload
                currentImage={profileImage}
                userName={userName}
                onImageUpdate={setProfileImage}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and professional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Your full name"
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Headline */}
                  <div className="space-y-2">
                    <label htmlFor="headline" className="text-sm font-medium">
                      Professional Headline
                    </label>
                    <Input
                      id="headline"
                      {...register('headline')}
                      placeholder="e.g., Senior Developer, Instructor"
                      disabled={isLoading}
                    />
                    {errors.headline && (
                      <p className="text-sm text-red-600">{errors.headline.message}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    {...register('bio')}
                    placeholder="Tell us about yourself, your experience, and interests..."
                    rows={4}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500">
                    {bioValue.length}/500 characters
                  </p>
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location
                    </label>
                    <Input
                      id="location"
                      {...register('location')}
                      placeholder="City, Country"
                      disabled={isLoading}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-600">{errors.location.message}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company
                    </label>
                    <Input
                      id="company"
                      {...register('company')}
                      placeholder="Your company or organization"
                      disabled={isLoading}
                    />
                    {errors.company && (
                      <p className="text-sm text-red-600">{errors.company.message}</p>
                    )}
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium">
                    Website
                  </label>
                  <Input
                    id="website"
                    {...register('website')}
                    placeholder="https://yourwebsite.com"
                    disabled={isLoading}
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>

                {/* Social Media Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Social Profiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Twitter */}
                    <div className="space-y-2">
                      <label htmlFor="twitter_username" className="text-sm font-medium">
                        Twitter Username
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          @
                        </span>
                        <Input
                          id="twitter_username"
                          {...register('twitter_username')}
                          placeholder="username"
                          className="rounded-l-none"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.twitter_username && (
                        <p className="text-sm text-red-600">{errors.twitter_username.message}</p>
                      )}
                    </div>

                    {/* GitHub */}
                    <div className="space-y-2">
                      <label htmlFor="github_username" className="text-sm font-medium">
                        GitHub Username
                      </label>
                      <Input
                        id="github_username"
                        {...register('github_username')}
                        placeholder="username"
                        disabled={isLoading}
                      />
                      {errors.github_username && (
                        <p className="text-sm text-red-600">{errors.github_username.message}</p>
                      )}
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-2">
                      <label htmlFor="linkedin_url" className="text-sm font-medium">
                        LinkedIn Profile URL
                      </label>
                      <Input
                        id="linkedin_url"
                        {...register('linkedin_url')}
                        placeholder="https://linkedin.com/in/username"
                        disabled={isLoading}
                      />
                      {errors.linkedin_url && (
                        <p className="text-sm text-red-600">{errors.linkedin_url.message}</p>
                      )}
                    </div>

                    {/* YouTube */}
                    <div className="space-y-2">
                      <label htmlFor="youtube_channel" className="text-sm font-medium">
                        YouTube Channel
                      </label>
                      <Input
                        id="youtube_channel"
                        {...register('youtube_channel')}
                        placeholder="Channel name or URL"
                        disabled={isLoading}
                      />
                      {errors.youtube_channel && (
                        <p className="text-sm text-red-600">{errors.youtube_channel.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills & Interests Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Skills & Interests</h3>
                  
                  {/* Skills */}
                  <div className="space-y-2 mb-4">
                    <label htmlFor="skills" className="text-sm font-medium">
                      Skills
                    </label>
                    <Input
                      id="skills"
                      {...register('skills')}
                      placeholder="JavaScript, React, Node.js, Python (comma separated)"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500">
                      Separate multiple skills with commas
                    </p>
                  </div>

                  {/* Learning Goals */}
                  <div className="space-y-2 mb-4">
                    <label htmlFor="learning_goals" className="text-sm font-medium">
                      Learning Goals
                    </label>
                    <Input
                      id="learning_goals"
                      {...register('learning_goals')}
                      placeholder="Machine Learning, Web3, Cloud Architecture (comma separated)"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Preferred Topics */}
                  <div className="space-y-2">
                    <label htmlFor="preferred_topics" className="text-sm font-medium">
                      Preferred Topics
                    </label>
                    <Input
                      id="preferred_topics"
                      {...register('preferred_topics')}
                      placeholder="Frontend Development, DevOps, UI/UX (comma separated)"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-32"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}