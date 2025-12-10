
// src/components/courses/file-upload.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, AlertCircle, Video, FileText, Image as ImageIcon, Youtube, File } from 'lucide-react';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUploadComplete?: (meta: { 
    url: string; 
    duration?: number; 
    bytes?: number;
    publicId?: string;
  }) => void;
  accept?: string;
  type?: 'image' | 'video' | 'document';
  label?: string;
  description?: string;
  folder?: string;
  maxSizeMB?: number;
}

function FileUploadComponent({
  value,
  onChange,
  onUploadComplete,
  accept,
  type = 'image',
  label = 'Upload File',
  description,
  folder,
  maxSizeMB = type === 'video' ? 500 : type === 'image' ? 10 : 50,
}: FileUploadProps) {
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default accept based on type
  const defaultAccept = {
    image: 'image/*',
    video: 'video/*',
    document: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.sql,.zip,.rar'
  }[type];

  const finalAccept = accept || defaultAccept;
  
  // Set default folder based on type
  const defaultFolder = {
    image: 'axioquan/images',
    video: 'axioquan/videos',
    document: 'axioquan/documents'
  }[type];

  const finalFolder = folder || defaultFolder;

  // Sync preview with value
  useEffect(() => {
    if (value && value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  // ============================================
  // METHOD 1: For VIDEOS (Large files) - Direct Cloudinary Upload
  // ============================================
  const uploadVideoDirectToCloudinary = async (file: File) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        // Get signature for video
        const signatureResponse = await fetch(
          `/api/upload/signature?folder=${encodeURIComponent(finalFolder)}&resource_type=video`
        );
        const signatureData = await signatureResponse.json();
        
        if (!signatureResponse.ok) {
          throw new Error('Failed to get upload signature');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signatureData.api_key);
        formData.append('timestamp', signatureData.timestamp.toString());
        formData.append('signature', signatureData.signature);
        
        if (signatureData.folder && signatureData.folder.trim() !== '') {
          formData.append('folder', signatureData.folder);
        }

        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch {
              reject(new Error('Invalid Cloudinary response'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/video/upload`;
        xhr.open('POST', cloudinaryUrl);
        xhr.send(formData);

      } catch (error: any) {
        reject(error);
      }
    });
  };

  // ============================================
  // METHOD 2: For IMAGES & DOCUMENTS - Use your existing API route
  // ============================================
  const uploadViaAPI = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return await response.json();
  };

  // ============================================
  // MAIN UPLOAD HANDLER
  // ============================================
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    // Create temporary preview for images/videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(tempPreviewUrl);
    }

    try {
      let result;
      
      // Choose upload method based on file type and size
      if (type === 'video' && file.size > 4.5 * 1024 * 1024) {
        // Large video: Direct Cloudinary upload
        toast({
          title: '📤 Uploading Video...',
          description: `${file.name} (${formatFileSize(file.size)})`,
        });
        result = await uploadVideoDirectToCloudinary(file);
      } else {
        // Images, documents, and small videos: Use your existing API
        toast({
          title: '📤 Uploading...',
          description: `${file.name} (${formatFileSize(file.size)})`,
        });
        result = await uploadViaAPI(file);
      }

      // Handle success
      setPreviewUrl(result.url || result.secure_url);
      setUploadedFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        url: result.url || result.secure_url,
        publicId: result.public_id,
        duration: result.duration,
        bytes: result.bytes || file.size,
      });

      onChange(result.url || result.secure_url);
      
      if (onUploadComplete) {
        onUploadComplete({
          url: result.url || result.secure_url,
          duration: result.duration,
          bytes: result.bytes || file.size,
          publicId: result.public_id,
        });
      }

      toast({
        title: '✅ Upload Complete',
        description: `${file.name} (${formatFileSize(file.size)}) uploaded successfully`,
      });

    } catch (error: any) {
      console.error('❌ Upload error:', error);
      setError(error.message);
      setPreviewUrl(value || '');
      
      toast({
        title: '❌ Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum: ${maxSizeMB}MB`);
      toast({
        title: 'File too large',
        description: `Maximum size is ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (type === 'video' && !file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    // Start upload
    await handleFileUpload(file);
  };

  // Handle URL input
  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);
    
    if (isYouTubeUrl(url)) {
      toast({
        title: 'YouTube link detected',
        description: 'Preview will show automatically',
      });
    }
  };

  // Helper functions from your old version
  const isYouTubeUrl = (url: string) =>
    url.includes('youtube.com') || url.includes('youtu.be');

  const isFakeVideoUrl = (url: string) =>
    url.includes('video-uploaded-') && url.endsWith('.mp4');

  const getYouTubeThumbnail = (url: string): string | null => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    return null;
  };

  const extractFilename = (url: string) => {
    if (!url) return 'Unknown file';
    try {
      const parsed = new URL(url);
      const path = parsed.pathname;
      const lastPart = path.split('/').pop();
      return lastPart ? decodeURIComponent(lastPart) : url;
    } catch (e) {
      if (url.includes('/')) {
        return url.split('/').pop() as string;
      }
      return url;
    }
  };

  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const lower = url.toLowerCase();
    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) return 'image';
    if (lower.match(/\.(mp4|mov|avi|webm|mkv)$/) || isYouTubeUrl(url) || isFakeVideoUrl(url)) return 'video';
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.match(/\.(doc|docx|txt|rtf)$/)) return 'document';
    if (lower.match(/\.(ppt|pptx)$/)) return 'presentation';
    if (lower.match(/\.(xls|xlsx|csv)$/)) return 'spreadsheet';
    if (url.startsWith('blob:')) return url.includes('video') ? 'video' : 'image';
    return 'unknown';
  };

  const getFileIcon = () => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'image': return 'Image';
      case 'video': return 'Video';
      case 'document': return 'Document';
      default: return 'File';
    }
  };

  const youtubeThumbnail = getYouTubeThumbnail(previewUrl);

  // Clear uploaded file
  const handleClearFile = () => {
    setPreviewUrl('');
    setUploadedFileInfo(null);
    setError(null);
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Render component
  return (
    <div className="space-y-4">
      {/* Upload and URL input */}
      <div className="flex space-x-4">
        <Button
          type="button"
          variant={previewUrl ? "outline" : "default"}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading... {progress}%
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {getFileIcon()}
              Upload {getTypeLabel()}
            </span>
          )}
        </Button>

        <div className="flex-1">
          <Input
            type="url"
            placeholder={`Or paste ${getTypeLabel().toLowerCase()} URL...`}
            value={previewUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full"
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={finalAccept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload progress */}
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Uploading... {progress}% • Max: {maxSizeMB}MB
          </p>
        </div>
      )}

      {/* Error message */}
      {error && !isUploading && (
        <div className="rounded-lg bg-destructive/10 p-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* PREVIEW SECTION */}
      {previewUrl && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">Preview</span>
              <Badge variant="secondary">
                {getTypeLabel()}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Preview */}
          {type === 'image' && (
            <div className="space-y-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-48 object-contain rounded-lg bg-muted"
              />
              <p className="text-xs text-muted-foreground break-all">
                {previewUrl}
              </p>
            </div>
          )}

          {/* Video Preview - FIXED: FULL WIDTH, NO BLACK BARS */}
      
            {/* Video Preview - SHORTER HEIGHT */}
            {type === 'video' && (
              <div className="space-y-1.5">
                {isYouTubeUrl(previewUrl) ? (
                  <div className="bg-black rounded p-2 flex flex-col items-center">
                    <div className="text-white text-xs mb-1">YouTube Video</div>
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <Youtube className="h-4 w-4 text-white" />
                    </div>
                    {youtubeThumbnail && (
                      <img
                        src={youtubeThumbnail}
                        alt="YouTube thumbnail"
                        className="mt-1.5 max-w-full h-14 object-cover rounded"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {/* SHORTER VIDEO PREVIEW */}
                    <div className="w-full" style={{ height: '160px' }}>
                      <video
                        src={previewUrl}
                        controls
                        className="w-full h-full rounded bg-black"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground break-all line-clamp-1">
                      {previewUrl}
                    </p>
                  </>
                )}
              </div>
            )}


          {/* Document Preview */}
          {type === 'document' && (
            <div className="bg-background border rounded-lg p-4 flex items-center space-x-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium">{extractFilename(previewUrl)}</div>
                <div className="text-sm text-muted-foreground">
                  Document • Ready for download
                </div>
                <div className="text-xs text-muted-foreground mt-1 break-all">
                  {previewUrl}
                </div>
              </div>
            </div>
          )}

          {/* Uploaded file info */}
          {uploadedFileInfo && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Upload Successful</span>
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400 mt-1">
                    {uploadedFileInfo.name} • {formatFileSize(uploadedFileInfo.bytes)}
                    {uploadedFileInfo.duration && ` • ${Math.round(uploadedFileInfo.duration)}s`}
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  ✓ Uploaded
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info message - SIMPLIFIED */}
      <div className="rounded-lg bg-muted p-3">
        <p className="text-sm text-muted-foreground">
          Maximum file size: {maxSizeMB}MB • {getTypeLabel()} upload
        </p>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

// ✅ Provide BOTH default and named exports
export default FileUploadComponent;
export { FileUploadComponent as FileUpload };



























// // /src/components/courses/file-upload.tsx

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// interface FileUploadProps {
//   value?: string;
//   onChange: (url: string) => void;

//   onUploadComplete?: (meta: {
//     url: string;
//     duration?: number;
//     bytes?: number;
//     thumbnail?: string | null;
//     mimeType?: string;
//     format?: string;
//   }) => void;

//   /** Callback to notify parent when upload state changes */
//   onUploadStateChange?: (isUploading: boolean) => void;

//   accept?: string;
//   type?: "image" | "video" | "document";
//   label?: string;
//   description?: string;
// }

// // interface FileUploadProps {
// //   value?: string;
// //   onChange: (url: string) => void;
// //   accept?: string;
// //   type?: 'image' | 'video' | 'document';
// //   label?: string;
// //   description?: string;
// // }

// export function FileUpload({
//   value,
//   onChange,
//   onUploadComplete,
//   onUploadStateChange,
//   accept = "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.sql",
//   type = "image",
//   label = "Upload File",
//   description,
// }: FileUploadProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(value || "");
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Notify parent when upload state changes
//   useEffect(() => {
//     onUploadStateChange?.(isUploading);
//   }, [isUploading, onUploadStateChange]);

//   // Sync preview with value (important for edit mode)
//   useEffect(() => {
//     if (value && value !== previewUrl) {
//       setPreviewUrl(value);
//     }
//   }, [value]);

//   // ----------------------------------------
//   // HUMAN-READABLE FILE SIZE FORMATTER
//   // ----------------------------------------
//   const formatFileSize = (bytes: number) => {
//     if (bytes < 1024) return `${bytes} B`;
//     const kb = bytes / 1024;
//     if (kb < 1024) return `${kb.toFixed(1)} KB`;
//     const mb = kb / 1024;
//     if (mb < 1024) return `${mb.toFixed(1)} MB`;
//     const gb = mb / 1024;
//     return `${gb.toFixed(2)} GB`;
//   };

//   // ----------------------------------------
//   // FILE SELECT HANDLER
//   // ----------------------------------------
//   const handleFileSelect = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate type but DO NOT block size
//     if (type === "video" && !file.type.startsWith("video/")) {
//       toast.error("Invalid file type", {
//         description: "Please select a valid video file",
//       });
//       return;
//     }

//     // Notify file info
//     toast.info("Uploading...", {
//       description: `Uploading ${file.name} (${formatFileSize(
//         file.size
//       )}) — please wait...`,
//     });

//     setIsUploading(true);

//     try {
//       const tempPreviewUrl = URL.createObjectURL(file);
//       setPreviewUrl(tempPreviewUrl);

//       // Upload real file (video)
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("type", type);

//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok && data.url) {
//         setPreviewUrl(data.url);
//         onChange(data.url);

//         if (onUploadComplete) {
//           onUploadComplete({
//             url: data.url,
//             duration: data.duration,
//             bytes: data.bytes,
//             mimeType: data.mimeType,
//             format: data.format,
//           });
//         }

//         // ✅ IMPROVED: Better success message for documents
//         const successMessage =
//           type === "document"
//             ? `${file.name} (${formatFileSize(
//                 file.size
//               )}) - Document uploaded successfully`
//             : `${file.name} (${formatFileSize(
//                 file.size
//               )}) uploaded successfully`;

//         toast.success("Upload complete", {
//           description: successMessage,
//         });
//       } else {
//         throw new Error(data.error || "Upload failed");
//       }
//     } catch (error: any) {
//       console.error("Upload error:", error);
//       toast.error("Upload failed", {
//         description: error.message || "Please try again",
//       });
//       setPreviewUrl(value || "");
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   // ----------------------------------------
//   // URL INPUT HANDLER
//   // ----------------------------------------
//   const handleUrlChange = (url: string) => {
//     setPreviewUrl(url);
//     onChange(url);

//     if (isYouTubeUrl(url)) {
//       toast.success("YouTube link detected", {
//         description: "Preview will show automatically",
//       });
//     }
//   };

//   // ----------------------------------------
//   // HELPERS
//   // ----------------------------------------
//   const isYouTubeUrl = (url: string) =>
//     url.includes("youtube.com") || url.includes("youtu.be");

//   const isFakeVideoUrl = (url: string) =>
//     url.includes("video-uploaded-") && url.endsWith(".mp4");

//   const getYouTubeThumbnail = (url: string): string | null => {
//     if (url.includes("youtube.com/watch?v=")) {
//       const id = url.split("v=")[1]?.split("&")[0];
//       return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
//     }
//     if (url.includes("youtu.be/")) {
//       const id = url.split("youtu.be/")[1]?.split("?")[0];
//       return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
//     }
//     return null;
//   };

//   // Helper: Extract readable filename from URL
//   const extractFilename = (url: string) => {
//     if (!url) return "Unknown file";

//     try {
//       // If URL is valid, extract filename from pathname
//       const parsed = new URL(url);
//       const path = parsed.pathname;
//       const lastPart = path.split("/").pop();
//       return lastPart ? decodeURIComponent(lastPart) : url;
//     } catch (e) {
//       // If URL() fails (e.g., blob URL or plain string)
//       if (url.includes("/")) {
//         return url.split("/").pop() as string;
//       }
//       return url;
//     }
//   };

//   const getFileType = (url: string) => {
//     if (!url) return "unknown";

//     const lower = url.toLowerCase();

//     if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) return "image";
//     if (
//       lower.match(/\.(mp4|mov|avi|webm|mkv)$/) ||
//       isYouTubeUrl(url) ||
//       isFakeVideoUrl(url)
//     )
//       return "video";
//     if (lower.endsWith(".pdf")) return "pdf";
//     if (lower.match(/\.(doc|docx|txt|rtf)$/)) return "document";
//     if (lower.match(/\.(ppt|pptx)$/)) return "presentation";
//     if (lower.match(/\.(xls|xlsx|csv)$/)) return "spreadsheet";
//     if (url.startsWith("blob:")) return "video"; // local video previews show as blob
//     return "unknown";
//   };

//   // const getFileType = (url: string) => {
//   //   if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
//   //   if (url.match(/\.(mp4|mov|avi|webm|mkv)$/i) || isYouTubeUrl(url) || isFakeVideoUrl(url)) return 'video';
//   //   if (url.match(/\.(pdf)$/i)) return 'pdf';
//   //   if (url.match(/\.(doc|docx)$/i)) return 'document';
//   //   if (url.match(/\.(ppt|pptx)$/i)) return 'presentation';
//   //   if (url.match(/\.(xls|xlsx|csv)$/i)) return 'spreadsheet';
//   //   if (url.match(/\.(txt|sql)$/i)) return 'text';
//   //   if (url.startsWith('blob:')) return 'video';
//   //   return 'unknown';
//   // };

//   const getFileIcon = (url: string) => {
//     const type = getFileType(url);
//     switch (type) {
//       case "image":
//         return "🖼️";
//       case "video":
//         return "🎥";
//       case "pdf":
//         return "📄";
//       case "document":
//         return "📝";
//       case "presentation":
//         return "📊";
//       case "spreadsheet":
//         return "📈";
//       default:
//         return "📎";
//     }
//   };

//   // ✅ NEW: Get file name from URL for better display
//   const getFileNameFromUrl = (url: string) => {
//     if (!url) return "";
//     try {
//       const urlObj = new URL(url);
//       const pathname = urlObj.pathname;
//       return pathname.split("/").pop() || url;
//     } catch {
//       return url.split("/").pop() || url;
//     }
//   };

//   // ✅ NEW: Get document type display name
//   const getDocumentTypeName = (url: string) => {
//     const fileType = getFileType(url);
//     switch (fileType) {
//       case "pdf":
//         return "PDF Document";
//       case "document":
//         return "Word Document";
//       case "presentation":
//         return "PowerPoint Presentation";
//       case "spreadsheet":
//         return "Excel Spreadsheet";
//       default:
//         return "Document";
//     }
//   };

//   const youtubeThumbnail = getYouTubeThumbnail(previewUrl);

//   // ----------------------------------------
//   // COMPONENT UI
//   // ----------------------------------------
//   return (
//     <div className="space-y-4">
//       {/* Upload and URL input */}
//       <div className="flex space-x-4">
//         <Button
//           type="button"
//           variant={previewUrl ? "outline" : "default"}
//           onClick={() => fileInputRef.current?.click()}
//           disabled={isUploading}
//           className="flex-1"
//         >
//           {isUploading
//             ? "Uploading..."
//             : `Upload ${type === "video" ? "Video" : "File"}`}
//         </Button>

//         <div className="flex-1">
//           <Input
//             type="url"
//             placeholder={
//               type === "video"
//                 ? "Paste video URL (YouTube, Vimeo, MP4...)"
//                 : "Or paste file URL"
//             }
//             value={previewUrl}
//             onChange={(e) => handleUrlChange(e.target.value)}
//             className="w-full"
//           />
//         </div>
//       </div>

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept={type === "video" ? "video/*" : accept}
//         onChange={handleFileSelect}
//         className="hidden"
//       />

//       {/* PREVIEW */}
//       {previewUrl && (
//         <div className="border rounded-lg p-4 bg-gray-50">
//           <div className="flex items-center justify-between mb-2">
//             <span className="font-medium">Preview</span>
//             <Badge variant="secondary">
//               {getFileIcon(previewUrl)} {getFileType(previewUrl).toUpperCase()}
//             </Badge>
//           </div>

//           {/* Image Preview */}
//           {getFileType(previewUrl) === "image" && (
//             <img
//               src={previewUrl}
//               alt="Preview"
//               className="max-w-full h-32 object-cover rounded"
//             />
//           )}

//           {/* ------------------------------------------------------ */}
//           {/* REAL VIDEO PREVIEW (PLAYABLE VIDEO ELEMENT)           */}
//           {/* ------------------------------------------------------ */}
//           {getFileType(previewUrl) === "video" && (
//             <div className="space-y-3">
//               {/* YouTube Preview */}
//               {isYouTubeUrl(previewUrl) ? (
//                 <div className="bg-black rounded flex flex-col items-center justify-center h-48 p-4">
//                   <div className="text-white text-xl mb-2">YouTube Video</div>
//                   <div className="text-white text-xs text-center mb-2">
//                     {previewUrl}
//                   </div>

//                   <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
//                     <span className="text-white text-xl">▶</span>
//                   </div>

//                   {youtubeThumbnail && (
//                     <img
//                       src={youtubeThumbnail}
//                       alt="YouTube thumbnail"
//                       className="mt-4 max-w-full h-24 object-cover rounded"
//                     />
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   {/* 
//                     REAL playable video preview 
//                     Works for:
//                     - MP4
//                     - MOV
//                     - AVI
//                     - WEBM
//                     - BLOB preview after selection
//                     - Cloudinary URLs
//                   */}
//                   <video
//                     src={previewUrl}
//                     controls
//                     className="w-full h-48 rounded object-cover bg-black"
//                   />

//                   <div className="text-xs text-gray-600 text-center break-all">
//                     {previewUrl.startsWith("blob:")
//                       ? "Local video preview (uploaded file)"
//                       : previewUrl}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {(getFileType(previewUrl) === "pdf" ||
//             getFileType(previewUrl) === "document" ||
//             getFileType(previewUrl) === "presentation" ||
//             getFileType(previewUrl) === "spreadsheet") && (
//             <div className="bg-white border rounded p-4 flex items-center space-x-3">
//               <span className="text-2xl">{getFileIcon(previewUrl)}</span>
//               <div className="flex-1">
//                 <div className="font-medium">{extractFilename(previewUrl)}</div>
//                 <div className="text-sm text-gray-600">
//                   Document ready — students can download this file
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1 break-all">
//                   {previewUrl}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ✅ NEW: Show when no preview but URL exists (edit page scenario) */}
//           {!previewUrl && value && type === "document" && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//               <div className="flex items-center space-x-2 text-yellow-800">
//                 <span>📄</span>
//                 <div>
//                   <div className="font-medium">
//                     Document Previously Uploaded
//                   </div>
//                   <div className="text-sm mt-1">
//                     A document was uploaded for this course
//                   </div>
//                   <div className="text-xs mt-2 break-all bg-yellow-100 p-2 rounded">
//                     {getFileNameFromUrl(value)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ✅ IMPROVED: Show existing document on edit pages even when previewUrl is empty */}
//       {!previewUrl && value && type === "document" && (
//         <div className="border border-green-200 rounded-lg p-4 bg-green-50">
//           <div className="flex items-center space-x-3">
//             <span className="text-2xl">📄</span>
//             <div>
//               <div className="font-medium text-green-800">
//                 Document Attached
//               </div>
//               <div className="text-sm text-green-700">
//                 This course has an uploaded document:{" "}
//                 <strong>{getFileNameFromUrl(value)}</strong>
//               </div>
//               <div className="text-xs text-green-600 mt-1 break-all">
//                 {value}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {description && <p className="text-sm text-gray-500">{description}</p>}
//     </div>
//   );
// }











