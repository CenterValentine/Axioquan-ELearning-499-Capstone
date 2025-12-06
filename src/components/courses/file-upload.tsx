// /src/components/courses/file-upload.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;

  onUploadComplete?: (meta: {
    url: string;
    duration?: number;
    bytes?: number;
    thumbnail?: string | null;
  }) => void;

  /** Callback to notify parent when upload state changes */
  onUploadStateChange?: (isUploading: boolean) => void;

  accept?: string;
  type?: "image" | "video" | "document";
  label?: string;
  description?: string;
}

// interface FileUploadProps {
//   value?: string;
//   onChange: (url: string) => void;
//   accept?: string;
//   type?: 'image' | 'video' | 'document';
//   label?: string;
//   description?: string;
// }

export function FileUpload({
  value,
  onChange,
  onUploadComplete,
  onUploadStateChange,
  accept = "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.sql",
  type = "image",
  label = "Upload File",
  description,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notify parent when upload state changes
  useEffect(() => {
    onUploadStateChange?.(isUploading);
  }, [isUploading, onUploadStateChange]);

  // Sync preview with value (important for edit mode)
  useEffect(() => {
    if (value && value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value]);

  // ----------------------------------------
  // HUMAN-READABLE FILE SIZE FORMATTER
  // ----------------------------------------
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  // ----------------------------------------
  // FILE SELECT HANDLER
  // ----------------------------------------
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate type but DO NOT block size
    if (type === "video" && !file.type.startsWith("video/")) {
      toast.error("Invalid file type", {
        description: "Please select a valid video file",
      });
      return;
    }

    // Notify file info
    toast.info("Uploading...", {
      description: `Uploading ${file.name} (${formatFileSize(
        file.size
      )}) — please wait...`,
    });

    setIsUploading(true);

    try {
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(tempPreviewUrl);

      // Upload real file (video)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setPreviewUrl(data.url);
        onChange(data.url);

        if (onUploadComplete) {
          onUploadComplete({
            url: data.url,
            duration: data.duration,
            bytes: data.bytes,
          });
        }

        // ✅ IMPROVED: Better success message for documents
        const successMessage =
          type === "document"
            ? `${file.name} (${formatFileSize(
                file.size
              )}) - Document uploaded successfully`
            : `${file.name} (${formatFileSize(
                file.size
              )}) uploaded successfully`;

        toast.success("Upload complete", {
          description: successMessage,
        });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: error.message || "Please try again",
      });
      setPreviewUrl(value || "");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ----------------------------------------
  // URL INPUT HANDLER
  // ----------------------------------------
  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);

    if (isYouTubeUrl(url)) {
      toast.success("YouTube link detected", {
        description: "Preview will show automatically",
      });
    }
  };

  // ----------------------------------------
  // HELPERS
  // ----------------------------------------
  const isYouTubeUrl = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const isFakeVideoUrl = (url: string) =>
    url.includes("video-uploaded-") && url.endsWith(".mp4");

  const getYouTubeThumbnail = (url: string): string | null => {
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    return null;
  };

  // Helper: Extract readable filename from URL
  const extractFilename = (url: string) => {
    if (!url) return "Unknown file";

    try {
      // If URL is valid, extract filename from pathname
      const parsed = new URL(url);
      const path = parsed.pathname;
      const lastPart = path.split("/").pop();
      return lastPart ? decodeURIComponent(lastPart) : url;
    } catch (e) {
      // If URL() fails (e.g., blob URL or plain string)
      if (url.includes("/")) {
        return url.split("/").pop() as string;
      }
      return url;
    }
  };

  const getFileType = (url: string) => {
    if (!url) return "unknown";

    const lower = url.toLowerCase();

    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) return "image";
    if (
      lower.match(/\.(mp4|mov|avi|webm|mkv)$/) ||
      isYouTubeUrl(url) ||
      isFakeVideoUrl(url)
    )
      return "video";
    if (lower.endsWith(".pdf")) return "pdf";
    if (lower.match(/\.(doc|docx|txt|rtf)$/)) return "document";
    if (lower.match(/\.(ppt|pptx)$/)) return "presentation";
    if (lower.match(/\.(xls|xlsx|csv)$/)) return "spreadsheet";
    if (url.startsWith("blob:")) return "video"; // local video previews show as blob
    return "unknown";
  };

  // const getFileType = (url: string) => {
  //   if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
  //   if (url.match(/\.(mp4|mov|avi|webm|mkv)$/i) || isYouTubeUrl(url) || isFakeVideoUrl(url)) return 'video';
  //   if (url.match(/\.(pdf)$/i)) return 'pdf';
  //   if (url.match(/\.(doc|docx)$/i)) return 'document';
  //   if (url.match(/\.(ppt|pptx)$/i)) return 'presentation';
  //   if (url.match(/\.(xls|xlsx|csv)$/i)) return 'spreadsheet';
  //   if (url.match(/\.(txt|sql)$/i)) return 'text';
  //   if (url.startsWith('blob:')) return 'video';
  //   return 'unknown';
  // };

  const getFileIcon = (url: string) => {
    const type = getFileType(url);
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "pdf":
        return "📄";
      case "document":
        return "📝";
      case "presentation":
        return "📊";
      case "spreadsheet":
        return "📈";
      default:
        return "📎";
    }
  };

  // ✅ NEW: Get file name from URL for better display
  const getFileNameFromUrl = (url: string) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split("/").pop() || url;
    } catch {
      return url.split("/").pop() || url;
    }
  };

  // ✅ NEW: Get document type display name
  const getDocumentTypeName = (url: string) => {
    const fileType = getFileType(url);
    switch (fileType) {
      case "pdf":
        return "PDF Document";
      case "document":
        return "Word Document";
      case "presentation":
        return "PowerPoint Presentation";
      case "spreadsheet":
        return "Excel Spreadsheet";
      default:
        return "Document";
    }
  };

  const youtubeThumbnail = getYouTubeThumbnail(previewUrl);

  // ----------------------------------------
  // COMPONENT UI
  // ----------------------------------------
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
          {isUploading
            ? "Uploading..."
            : `Upload ${type === "video" ? "Video" : "File"}`}
        </Button>

        <div className="flex-1">
          <Input
            type="url"
            placeholder={
              type === "video"
                ? "Paste video URL (YouTube, Vimeo, MP4...)"
                : "Or paste file URL"
            }
            value={previewUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={type === "video" ? "video/*" : accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* PREVIEW */}
      {previewUrl && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Preview</span>
            <Badge variant="secondary">
              {getFileIcon(previewUrl)} {getFileType(previewUrl).toUpperCase()}
            </Badge>
          </div>

          {/* Image Preview */}
          {getFileType(previewUrl) === "image" && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-32 object-cover rounded"
            />
          )}

          {/* ------------------------------------------------------ */}
          {/* REAL VIDEO PREVIEW (PLAYABLE VIDEO ELEMENT)           */}
          {/* ------------------------------------------------------ */}
          {getFileType(previewUrl) === "video" && (
            <div className="space-y-3">
              {/* YouTube Preview */}
              {isYouTubeUrl(previewUrl) ? (
                <div className="bg-black rounded flex flex-col items-center justify-center h-48 p-4">
                  <div className="text-white text-xl mb-2">YouTube Video</div>
                  <div className="text-white text-xs text-center mb-2">
                    {previewUrl}
                  </div>

                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">▶</span>
                  </div>

                  {youtubeThumbnail && (
                    <img
                      src={youtubeThumbnail}
                      alt="YouTube thumbnail"
                      className="mt-4 max-w-full h-24 object-cover rounded"
                    />
                  )}
                </div>
              ) : (
                <>
                  {/* 
                    REAL playable video preview 
                    Works for:
                    - MP4
                    - MOV
                    - AVI
                    - WEBM
                    - BLOB preview after selection
                    - Cloudinary URLs
                  */}
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-48 rounded object-cover bg-black"
                  />

                  <div className="text-xs text-gray-600 text-center break-all">
                    {previewUrl.startsWith("blob:")
                      ? "Local video preview (uploaded file)"
                      : previewUrl}
                  </div>
                </>
              )}
            </div>
          )}

          {(getFileType(previewUrl) === "pdf" ||
            getFileType(previewUrl) === "document" ||
            getFileType(previewUrl) === "presentation" ||
            getFileType(previewUrl) === "spreadsheet") && (
            <div className="bg-white border rounded p-4 flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(previewUrl)}</span>
              <div className="flex-1">
                <div className="font-medium">{extractFilename(previewUrl)}</div>
                <div className="text-sm text-gray-600">
                  Document ready — students can download this file
                </div>
                <div className="text-xs text-gray-500 mt-1 break-all">
                  {previewUrl}
                </div>
              </div>
            </div>
          )}

          {/* ✅ NEW: Show when no preview but URL exists (edit page scenario) */}
          {!previewUrl && value && type === "document" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-yellow-800">
                <span>📄</span>
                <div>
                  <div className="font-medium">
                    Document Previously Uploaded
                  </div>
                  <div className="text-sm mt-1">
                    A document was uploaded for this course
                  </div>
                  <div className="text-xs mt-2 break-all bg-yellow-100 p-2 rounded">
                    {getFileNameFromUrl(value)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ IMPROVED: Show existing document on edit pages even when previewUrl is empty */}
      {!previewUrl && value && type === "document" && (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📄</span>
            <div>
              <div className="font-medium text-green-800">
                Document Attached
              </div>
              <div className="text-sm text-green-700">
                This course has an uploaded document:{" "}
                <strong>{getFileNameFromUrl(value)}</strong>
              </div>
              <div className="text-xs text-green-600 mt-1 break-all">
                {value}
              </div>
            </div>
          </div>
        </div>
      )}

      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
