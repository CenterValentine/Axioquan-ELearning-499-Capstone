// /src/components/courses/course-editor.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "@/components/tags/tag-selector";
import { FileUpload } from "@/components/courses/file-upload";
import {
  Course,
  CourseTag,
  CreateCourseData,
  UpdateCourseData,
} from "@/types/courses";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CourseEditorProps {
  course?: Course;
  categories: Category[];
  onSave?: (courseData: Course) => void;
  onCancel?: () => void;
}

const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all-levels", label: "All Levels" },
];

const contentTypes = [
  { value: "video", label: "Video" },
  { value: "text", label: "Text" },
  { value: "mixed", label: "Mixed" },
  { value: "interactive", label: "Interactive" },
];

const accessTypes = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "invite_only", label: "Invite Only" },
];

// ADD THIS FUNCTION - Clean fake video URLs
const cleanVideoUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("video-uploaded-") && url.endsWith(".mp4")) {
    return ""; // Return empty string for fake URLs (so edit doesn't send fake filename)
  }
  return url;
};

export function CourseEditor({
  course,
  categories,
  onSave,
  onCancel,
}: CourseEditorProps) {
  const [loading, setLoading] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isPromoVideoUploading, setIsPromoVideoUploading] = useState(false);
  const [isMaterialsUploading, setIsMaterialsUploading] = useState(false);

  // Use refs to track upload state for polling (since state updates are async)
  const thumbnailUploadingRef = useRef(false);
  const promoVideoUploadingRef = useRef(false);
  const materialsUploadingRef = useRef(false);

  // Sync refs with state
  useEffect(() => {
    thumbnailUploadingRef.current = isThumbnailUploading;
  }, [isThumbnailUploading]);

  useEffect(() => {
    promoVideoUploadingRef.current = isPromoVideoUploading;
  }, [isPromoVideoUploading]);

  useEffect(() => {
    materialsUploadingRef.current = isMaterialsUploading;
  }, [isMaterialsUploading]);
  const [formData, setFormData] = useState({
    title: course?.title || "",
    subtitle: course?.subtitle || "",
    description_html: course?.description_html || "",
    short_description: course?.short_description || "",
    learning_objectives: course?.learning_objectives?.join("\n") || "",
    prerequisites: course?.prerequisites?.join("\n") || "",
    target_audience: course?.target_audience?.join("\n") || "",
    category_id: course?.category_id || "",
    difficulty_level: course?.difficulty_level || "beginner",
    language: course?.language || "English",
    content_type: course?.content_type || "video",
    thumbnail_url: course?.thumbnail_url || "",
    // USE THE CLEAN FUNCTION HERE for promo_video_url so edit form won't send fake placeholder filename
    promo_video_url: cleanVideoUrl(course?.promo_video_url || ""),
    materials_url: course?.materials_url || "",
    price_cents: course?.price_cents || 0,
    certificate_available: course?.certificate_available || false,
    has_lifetime_access: course?.has_lifetime_access || true,
    allow_downloads: course?.allow_downloads || false,
    access_type: course?.access_type || "open",
    // NEW: keep the total video duration (in minutes) in form state
    total_video_duration: course?.total_video_duration || 0,
  });

  const [selectedTags, setSelectedTags] = useState<CourseTag[]>(
    course?.tags || []
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Error", { description: "Course title is required" });
      return;
    }

    if (!formData.thumbnail_url) {
      toast.error("Error", { description: "Course thumbnail is required" });
      return;
    }

    // Option 2: Wait for any in-progress uploads before submitting
    if (isThumbnailUploading || isPromoVideoUploading || isMaterialsUploading) {
      // Wait for uploads to complete (poll every 100ms, max 60 seconds)
      const maxWaitTime = 60000; // 60 seconds
      const pollInterval = 100;
      const startTime = Date.now();

      while (
        (thumbnailUploadingRef.current ||
          promoVideoUploadingRef.current ||
          materialsUploadingRef.current) &&
        Date.now() - startTime < maxWaitTime
      ) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }

      // If still uploading after timeout, show warning but continue
      if (
        thumbnailUploadingRef.current ||
        promoVideoUploadingRef.current ||
        materialsUploadingRef.current
      ) {
        console.warn("Upload timeout - proceeding with submission");
      }
    }

    try {
      setLoading(true);

      // Prepare course data - convert empty strings to undefined for optional fields
      const courseData: any = {
        title: formData.title.trim(),
        subtitle: formData.subtitle?.trim() || undefined,
        description_html: formData.description_html?.trim() || undefined,
        short_description: formData.short_description?.trim() || undefined,
        learning_objectives: formData.learning_objectives
          ? formData.learning_objectives.split("\n").filter((obj) => obj.trim())
          : [],
        prerequisites: formData.prerequisites
          ? formData.prerequisites.split("\n").filter((pre) => pre.trim())
          : [],
        target_audience: formData.target_audience
          ? formData.target_audience.split("\n").filter((aud) => aud.trim())
          : [],
        category_id: formData.category_id || undefined,
        difficulty_level: formData.difficulty_level,
        language: formData.language,
        content_type: formData.content_type,
        thumbnail_url: formData.thumbnail_url,
        promo_video_url: formData.promo_video_url?.trim() || undefined, // Convert empty string to undefined
        materials_url: formData.materials_url?.trim() || undefined, // Convert empty string to undefined
        price_cents: Math.round(Number(formData.price_cents) * 100),
        certificate_available: formData.certificate_available,
        has_lifetime_access: formData.has_lifetime_access,
        allow_downloads: formData.allow_downloads,
        access_type: formData.access_type,
        tag_ids: selectedTags.map((tag) => tag.id),
        // NEW: include total_video_duration (in minutes)
        total_video_duration: Number(formData.total_video_duration) || 0,
      };

      const url = course ? `/api/courses/${course.id}` : "/api/courses";
      const method = course ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Success", {
          description:
            data.message ||
            `Course ${course ? "updated" : "created"} successfully`,
        });

        if (onSave) {
          onSave(data.course);
        } else {
          router.push("/dashboard/instructor/courses");
          router.refresh();
        }
      } else {
        // Show detailed error message from API
        const errorMessage =
          data.error || data.details?.[0]?.message || "Failed to save course";
        toast.error("Error", { description: errorMessage });
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Error", { description: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  // The JSX form remains mostly the same; we add a tiny onUploadComplete handler for promo video
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{course ? "Edit Course" : "Create New Course"}</CardTitle>
          <CardDescription>
            {course
              ? "Update your course information"
              : "Create a new course to share your knowledge"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-1"
                  >
                    Course Title *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subtitle"
                    className="block text-sm font-medium mb-1"
                  >
                    Subtitle
                  </label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      handleInputChange("subtitle", e.target.value)
                    }
                    placeholder="Brief description that appears under the title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="short_description"
                    className="block text-sm font-medium mb-1"
                  >
                    Short Description
                  </label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) =>
                      handleInputChange("short_description", e.target.value)
                    }
                    placeholder="A brief overview of your course (appears in course cards)"
                    rows={3}
                  />
                </div>

                <div>
                  <label
                    htmlFor="description_html"
                    className="block text-sm font-medium mb-1"
                  >
                    Full Description
                  </label>
                  <Textarea
                    id="description_html"
                    value={formData.description_html}
                    onChange={(e) =>
                      handleInputChange("description_html", e.target.value)
                    }
                    placeholder="Detailed description of your course. You can use basic HTML formatting."
                    rows={6}
                  />
                </div>
              </div>
            </div>

            {/* Course Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Course Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category_id"
                    value={formData.category_id}
                    onChange={(e) =>
                      handleInputChange("category_id", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="difficulty_level"
                    className="block text-sm font-medium mb-1"
                  >
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty_level"
                    value={formData.difficulty_level}
                    onChange={(e) =>
                      handleInputChange("difficulty_level", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    {difficultyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium mb-1"
                  >
                    Language
                  </label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) =>
                      handleInputChange("language", e.target.value)
                    }
                    placeholder="e.g., English"
                  />
                </div>

                <div>
                  <label
                    htmlFor="content_type"
                    className="block text-sm font-medium mb-1"
                  >
                    Content Type
                  </label>
                  <select
                    id="content_type"
                    value={formData.content_type}
                    onChange={(e) =>
                      handleInputChange("content_type", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    {contentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tags</h3>
              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                maxTags={10}
                placeholder="Search and add relevant tags..."
              />
            </div>

            {/* Learning Content Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Learning Content</h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="learning_objectives"
                    className="block text-sm font-medium mb-1"
                  >
                    Learning Objectives
                  </label>
                  <Textarea
                    id="learning_objectives"
                    value={formData.learning_objectives}
                    onChange={(e) =>
                      handleInputChange("learning_objectives", e.target.value)
                    }
                    placeholder="Enter each learning objective on a new line"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    One objective per line. Students will see these as key
                    takeaways.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="prerequisites"
                    className="block text-sm font-medium mb-1"
                  >
                    Prerequisites
                  </label>
                  <Textarea
                    id="prerequisites"
                    value={formData.prerequisites}
                    onChange={(e) =>
                      handleInputChange("prerequisites", e.target.value)
                    }
                    placeholder="What should students know before taking this course?"
                    rows={3}
                  />
                </div>

                <div>
                  <label
                    htmlFor="target_audience"
                    className="block text-sm font-medium mb-1"
                  >
                    Target Audience
                  </label>
                  <Textarea
                    id="target_audience"
                    value={formData.target_audience}
                    onChange={(e) =>
                      handleInputChange("target_audience", e.target.value)
                    }
                    placeholder="Who is this course for? (e.g., Beginners, Professionals, etc.)"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Media & Content Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Media & Content</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course Thumbnail *
                  </label>
                  <FileUpload
                    value={formData.thumbnail_url}
                    onChange={(url) => handleInputChange("thumbnail_url", url)}
                    onUploadStateChange={(uploading) =>
                      setIsThumbnailUploading(uploading)
                    }
                    type="image"
                    description="This image will be displayed on course cards and the course page. Recommended: 1280x720px"
                  />
                  {!formData.thumbnail_url && (
                    <p className="text-sm text-red-600 mt-1">
                      Thumbnail is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Promo Video (Optional but recommended)
                  </label>
                  <FileUpload
                    value={formData.promo_video_url}
                    onChange={(url) =>
                      handleInputChange("promo_video_url", url)
                    }
                    onUploadStateChange={(uploading) =>
                      setIsPromoVideoUploading(uploading)
                    }
                    // NEW: capture duration via onUploadComplete
                    onUploadComplete={(meta) => {
                      // meta.duration is seconds from Cloudinary; convert to minutes (rounded)
                      if (meta?.duration) {
                        const minutes = Math.round(Number(meta.duration) / 60);
                        handleInputChange("total_video_duration", minutes);
                      }
                      // ensure promo_video_url saved if upload returns url
                      if (meta?.url) {
                        handleInputChange("promo_video_url", meta.url);
                      }
                      // if bytes provided you could show a toast (optional)
                      if (meta?.bytes) {
                        const kb = Math.round(Number(meta.bytes) / 1024);
                        toast.info("Video details", {
                          description: `Uploaded ${kb} KB`,
                        });
                      }
                    }}
                    type="video"
                    accept="video/*"
                    description="Upload a video file (max 500MB) or paste a YouTube/Vimeo URL. This video will be shown to potential students."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: MP4, MOV, AVI, WebM • YouTube & Vimeo URLs
                    accepted
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course Materials (Optional)
                  </label>
                  <FileUpload
                    value={formData.materials_url} // <-- ensure value is passed
                    onChange={(url) => handleInputChange("materials_url", url)} // <-- ensure onChange updates formData
                    onUploadStateChange={(uploading) =>
                      setIsMaterialsUploading(uploading)
                    }
                    type="document"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.sql,.csv,.rtf"
                    description="Upload course materials like PDFs, presentations, or code files (max 50MB)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 50MB
                  </p>
                </div>
              </div>

              {/* Pricing fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="price_cents"
                    className="block text-sm font-medium mb-1"
                  >
                    Price (USD)
                  </label>
                  <Input
                    id="price_cents"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_cents / 100}
                    onChange={(e) =>
                      handleInputChange(
                        "price_cents",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label
                    htmlFor="access_type"
                    className="block text-sm font-medium mb-1"
                  >
                    Access Type
                  </label>
                  <select
                    id="access_type"
                    value={formData.access_type}
                    onChange={(e) =>
                      handleInputChange("access_type", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    {accessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Course Settings Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Course Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="certificate_available"
                    checked={formData.certificate_available}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "certificate_available",
                        e.target.checked
                      )
                    }
                    className="rounded"
                  />
                  <label
                    htmlFor="certificate_available"
                    className="text-sm font-medium"
                  >
                    Certificate Available
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="has_lifetime_access"
                    checked={formData.has_lifetime_access}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "has_lifetime_access",
                        e.target.checked
                      )
                    }
                    className="rounded"
                  />
                  <label
                    htmlFor="has_lifetime_access"
                    className="text-sm font-medium"
                  >
                    Lifetime Access
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allow_downloads"
                    checked={formData.allow_downloads}
                    onChange={(e) =>
                      handleCheckboxChange("allow_downloads", e.target.checked)
                    }
                    className="rounded"
                  />
                  <label
                    htmlFor="allow_downloads"
                    className="text-sm font-medium"
                  >
                    Allow Downloads
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              {/* Option 1: Disable save button during upload */}
              {(isThumbnailUploading ||
                isPromoVideoUploading ||
                isMaterialsUploading) && (
                <div className="w-full mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  ⏳ Please wait for upload to complete before saving...
                </div>
              )}
              <Button
                type="submit"
                disabled={
                  loading ||
                  isThumbnailUploading ||
                  isPromoVideoUploading ||
                  isMaterialsUploading
                }
                className="flex-1"
              >
                {loading
                  ? "Saving..."
                  : isThumbnailUploading ||
                    isPromoVideoUploading ||
                    isMaterialsUploading
                  ? "Uploading..."
                  : course
                  ? "Update Course"
                  : "Create Course"}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
