// /src/components/users/profile-image-upload.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadProfileImage, removeProfileImage } from '@/lib/auth/profile-actions';

interface ProfileImageUploadProps {
  currentImage?: string;
  userName: string;
  onImageUpdate: (imageUrl: string) => void;
}

// Custom hook for image preview
function useImagePreview() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createPreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return url;
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return { previewUrl, createPreview, clearPreview };
}

export function ProfileImageUpload({ 
  currentImage, 
  userName, 
  onImageUpdate 
}: ProfileImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { previewUrl, createPreview, clearPreview } = useImagePreview();

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      clearPreview();
    };
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select a valid image file (JPEG, PNG, WebP, etc.)',
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please select an image smaller than 5MB',
      });
      return;
    }

    // Create preview immediately
    createPreview(file);

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await uploadProfileImage(formData);

      if (result.success && result.imageUrl) {
        toast.success('Profile image updated!');
        onImageUpdate(result.imageUrl);
        clearPreview(); // Clear preview after successful upload
      } else {
        toast.error('Upload failed', {
          description: result.errors?.[0] || result.message,
        });
        clearPreview(); // Clear preview on failure
      }
    } catch (error) {
      toast.error('Upload failed', {
        description: 'An unexpected error occurred',
      });
      clearPreview(); // Clear preview on error
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImage) return;

    setIsRemoving(true);

    try {
      const result = await removeProfileImage();

      if (result.success) {
        toast.success('Profile image removed');
        onImageUpdate('');
        clearPreview();
      } else {
        toast.error('Removal failed', {
          description: result.errors?.[0] || result.message,
        });
      }
    } catch (error) {
      toast.error('Removal failed', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine which image to display
  const displayImage = previewUrl || currentImage;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Image Display */}
      <div className="relative">
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={`${userName}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {/* Preview Indicator */}
            {previewUrl && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                Preview
              </div>
            )}
          </>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-white text-2xl font-bold">
              {getInitials(userName)}
            </span>
          </div>
        )}
        
        {/* Loading Overlay */}
        {(isLoading || isRemoving) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 w-full max-w-xs">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading || isRemoving}
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isRemoving}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Change Photo'
          )}
        </Button>

        {(currentImage || previewUrl) && (
          <Button
            onClick={handleRemoveImage}
            disabled={isLoading || isRemoving}
            variant="outline"
            className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            {isRemoving ? 'Removing...' : 'Remove Photo'}
          </Button>
        )}

        {/* Cancel Preview Button */}
        {previewUrl && !isLoading && (
          <Button
            onClick={clearPreview}
            variant="outline"
            className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Cancel Preview
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center space-y-1">
        <p className="text-xs text-gray-500">
          Recommended: Square image, 400x400px or larger
        </p>
        <p className="text-xs text-gray-400">
          Max file size: 5MB
        </p>
      </div>
    </div>
  );
}