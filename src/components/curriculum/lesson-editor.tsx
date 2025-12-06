// /components/curriculum/lesson-editor.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/courses/file-upload";
import { Lesson } from "@/lib/db/queries/curriculum";
import { CodeEnvironment, TestCase } from "@/lib/code/types";
import { Plus, Trash2 } from "lucide-react";

interface LessonEditorProps {
  lesson: Lesson;
  onSave: (updates: any) => void;
  onCancel: () => void;
}

const lessonTypes = [
  { value: "video", label: "Video", icon: "🎥" },
  { value: "text", label: "Text", icon: "📝" },
  { value: "document", label: "Document", icon: "📄" },
  { value: "quiz", label: "Quiz", icon: "❓" },
  { value: "assignment", label: "Assignment", icon: "📋" },
  { value: "live_session", label: "Live Session", icon: "🔴" },
  { value: "audio", label: "Audio", icon: "🎧" },
  { value: "interactive", label: "Interactive", icon: "⚡" },
  { value: "code", label: "Code", icon: "💻" },
  { value: "discussion", label: "Discussion", icon: "💬" },
];

const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
  // Parse code_environment if it exists
  const initialCodeEnv: CodeEnvironment | null = lesson.code_environment
    ? (typeof lesson.code_environment === 'string'
        ? JSON.parse(lesson.code_environment)
        : lesson.code_environment)
    : null;

  const [formData, setFormData] = useState({
    title: lesson.title,
    description: lesson.description || "",
    lesson_type: lesson.lesson_type,
    difficulty: lesson.difficulty,
    video_url: lesson.video_url || "",
    video_duration: lesson.video_duration || 0,
    video_thumbnail: lesson.video_thumbnail || "",
    document_url: lesson.document_url || "",
    document_type: lesson.document_type || "",
    content_html: lesson.content_html || "",
    code_environment: initialCodeEnv,
    is_published: lesson.is_published,
    is_preview: lesson.is_preview,
  });
  const [loading, setLoading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);

  // Use refs to track upload state for polling (since state updates are async)
  const videoUploadingRef = useRef(false);
  const documentUploadingRef = useRef(false);

  // Sync refs with state
  useEffect(() => {
    videoUploadingRef.current = isVideoUploading;
  }, [isVideoUploading]);

  useEffect(() => {
    documentUploadingRef.current = isDocumentUploading;
  }, [isDocumentUploading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    // Option 2: Wait for any in-progress uploads before submitting
    if (isVideoUploading || isDocumentUploading) {
      // Wait for uploads to complete (poll every 100ms, max 60 seconds)
      const maxWaitTime = 60000; // 60 seconds
      const pollInterval = 100;
      const startTime = Date.now();

      while (
        (videoUploadingRef.current || documentUploadingRef.current) &&
        Date.now() - startTime < maxWaitTime
      ) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }

      // If still uploading after timeout, show warning but continue
      if (videoUploadingRef.current || documentUploadingRef.current) {
        console.warn("Upload timeout - proceeding with submission");
      }
    }

    setLoading(true);
    try {
      // Prepare data for saving - stringify code_environment if it exists
      const saveData = {
        ...formData,
        code_environment: formData.code_environment
          ? JSON.stringify(formData.code_environment)
          : null,
      };
      await onSave(saveData);
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

  const getCurrentLessonType = () => {
    return (
      lessonTypes.find((type) => type.value === formData.lesson_type) ||
      lessonTypes[0]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Lesson</CardTitle>
        <CardDescription>
          Update your lesson content and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-1"
                >
                  Lesson Title *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Introduction to React Components"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of what students will learn in this lesson"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Lesson Type & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lesson Type & Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lesson_type"
                  className="block text-sm font-medium mb-1"
                >
                  Lesson Type
                </label>
                <select
                  id="lesson_type"
                  value={formData.lesson_type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    handleInputChange("lesson_type", newType);
                    // Initialize code_environment when switching to code type
                    if (newType === "code" && !formData.code_environment) {
                      handleInputChange("code_environment", {
                        language: "javascript",
                        instructions: "",
                        starterCode: "",
                        testCases: [],
                        allowRun: true,
                        allowSubmit: true,
                      });
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  {lessonTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium mb-1"
                >
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleInputChange("difficulty", e.target.value)
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
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) =>
                    handleInputChange("is_published", e.target.checked)
                  }
                  className="rounded"
                />
                <label htmlFor="is_published" className="text-sm font-medium">
                  Published
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_preview"
                  checked={formData.is_preview}
                  onChange={(e) =>
                    handleInputChange("is_preview", e.target.checked)
                  }
                  className="rounded"
                />
                <label htmlFor="is_preview" className="text-sm font-medium">
                  Available as Preview
                </label>
              </div>
            </div>
          </div>

          {/* Content Based on Lesson Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lesson Content</h3>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  {getCurrentLessonType().icon} {getCurrentLessonType().label}
                </Badge>
                <span className="text-sm text-blue-700">
                  Configure {getCurrentLessonType().label.toLowerCase()} content
                  below
                </span>
              </div>
            </div>

            {formData.lesson_type === "video" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Video Content
                </label>
                <FileUpload
                  value={formData.video_url}
                  onChange={(url) => handleInputChange("video_url", url)}
                  onUploadStateChange={(uploading) =>
                    setIsVideoUploading(uploading)
                  }
                  onUploadComplete={(meta) => {
                    if (meta.duration) {
                      handleInputChange(
                        "video_duration",
                        Math.round(meta.duration)
                      );
                    }
                    if (meta.thumbnail) {
                      handleInputChange("video_thumbnail", meta.thumbnail);
                    }
                  }}
                  type="video"
                  description="Upload a video file or paste a video URL"
                />

                {formData.video_duration > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Video duration: {Math.round(formData.video_duration / 60)}{" "}
                    minutes
                  </div>
                )}
              </div>
            )}

            {formData.lesson_type === "document" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Document File
                </label>
                <FileUpload
                  value={formData.document_url}
                  onChange={(url) => handleInputChange("document_url", url)}
                  onUploadStateChange={(uploading) =>
                    setIsDocumentUploading(uploading)
                  }
                  onUploadComplete={(meta) => {
                    // Save document_type from MIME type when document is uploaded
                    if (meta.mimeType) {
                      handleInputChange("document_type", meta.mimeType);
                    }
                  }}
                  type="document"
                  description="Upload PDF, Word, PowerPoint, or other document files"
                />
              </div>
            )}

            {(formData.lesson_type === "text" ||
              formData.lesson_type === "discussion") && (
              <div>
                <label
                  htmlFor="content_html"
                  className="block text-sm font-medium mb-1"
                >
                  Content
                </label>
                <Textarea
                  id="content_html"
                  value={formData.content_html}
                  onChange={(e) =>
                    handleInputChange("content_html", e.target.value)
                  }
                  placeholder="Write your lesson content here. You can use basic HTML formatting."
                  rows={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports basic HTML tags: &lt;p&gt;, &lt;strong&gt;,
                  &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;br&gt;
                </p>
              </div>
            )}

            {formData.lesson_type === "quiz" && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                  Quiz functionality coming soon! For now, you can describe the
                  quiz in the description field.
                </p>
              </div>
            )}

            {formData.lesson_type === "assignment" && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-orange-800">
                  Assignment functionality coming soon! For now, you can
                  describe the assignment in the description field.
                </p>
              </div>
            )}

            {formData.lesson_type === "code" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Programming Language *
                    </label>
                    <select
                      value={formData.code_environment?.language || "javascript"}
                      onChange={(e) =>
                        handleInputChange("code_environment", {
                          ...formData.code_environment,
                          language: e.target.value,
                          instructions: formData.code_environment?.instructions || "",
                          starterCode: formData.code_environment?.starterCode || "",
                          testCases: formData.code_environment?.testCases || [],
                          allowRun: formData.code_environment?.allowRun ?? true,
                          allowSubmit: formData.code_environment?.allowSubmit ?? true,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="c">C</option>
                      <option value="csharp">C#</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.code_environment?.allowRun ?? true}
                        onChange={(e) =>
                          handleInputChange("code_environment", {
                            ...formData.code_environment,
                            allowRun: e.target.checked,
                            language: formData.code_environment?.language || "javascript",
                            instructions: formData.code_environment?.instructions || "",
                            starterCode: formData.code_environment?.starterCode || "",
                            testCases: formData.code_environment?.testCases || [],
                            allowSubmit: formData.code_environment?.allowSubmit ?? true,
                          })
                        }
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Allow Code Execution</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.code_environment?.allowSubmit ?? true}
                        onChange={(e) =>
                          handleInputChange("code_environment", {
                            ...formData.code_environment,
                            allowSubmit: e.target.checked,
                            language: formData.code_environment?.language || "javascript",
                            instructions: formData.code_environment?.instructions || "",
                            starterCode: formData.code_environment?.starterCode || "",
                            testCases: formData.code_environment?.testCases || [],
                            allowRun: formData.code_environment?.allowRun ?? true,
                          })
                        }
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Allow Submission</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Instructions (Markdown) *
                  </label>
                  <Textarea
                    value={formData.code_environment?.instructions || ""}
                    onChange={(e) =>
                      handleInputChange("code_environment", {
                        ...formData.code_environment,
                        instructions: e.target.value,
                        language: formData.code_environment?.language || "javascript",
                        starterCode: formData.code_environment?.starterCode || "",
                        testCases: formData.code_environment?.testCases || [],
                        allowRun: formData.code_environment?.allowRun ?? true,
                        allowSubmit: formData.code_environment?.allowSubmit ?? true,
                      })
                    }
                    placeholder="## Task&#10;&#10;Write a function that...&#10;&#10;### Requirements:&#10;- Requirement 1&#10;- Requirement 2"
                    rows={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use Markdown formatting for instructions
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Starter Code
                  </label>
                  <Textarea
                    value={formData.code_environment?.starterCode || ""}
                    onChange={(e) =>
                      handleInputChange("code_environment", {
                        ...formData.code_environment,
                        starterCode: e.target.value,
                        language: formData.code_environment?.language || "javascript",
                        instructions: formData.code_environment?.instructions || "",
                        testCases: formData.code_environment?.testCases || [],
                        allowRun: formData.code_environment?.allowRun ?? true,
                        allowSubmit: formData.code_environment?.allowSubmit ?? true,
                      })
                    }
                    placeholder="function add(a, b) {&#10;  // Your code here&#10;  return 0;&#10;}"
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Initial code provided to students (optional)
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      Test Cases
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTestCase: TestCase = {
                          input: "",
                          expectedOutput: "",
                          hidden: false,
                        };
                        handleInputChange("code_environment", {
                          ...formData.code_environment,
                          testCases: [
                            ...(formData.code_environment?.testCases || []),
                            newTestCase,
                          ],
                          language: formData.code_environment?.language || "javascript",
                          instructions: formData.code_environment?.instructions || "",
                          starterCode: formData.code_environment?.starterCode || "",
                          allowRun: formData.code_environment?.allowRun ?? true,
                          allowSubmit: formData.code_environment?.allowSubmit ?? true,
                        });
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Test Case
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(formData.code_environment?.testCases || []).map(
                      (testCase, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg space-y-3 bg-gray-50 dark:bg-gray-900"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">
                              Test Case {index + 1}
                            </span>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center space-x-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={testCase.hidden || false}
                                  onChange={(e) => {
                                    const updated = [...(formData.code_environment?.testCases || [])];
                                    updated[index] = {
                                      ...updated[index],
                                      hidden: e.target.checked,
                                    };
                                    handleInputChange("code_environment", {
                                      ...formData.code_environment,
                                      testCases: updated,
                                      language: formData.code_environment?.language || "javascript",
                                      instructions: formData.code_environment?.instructions || "",
                                      starterCode: formData.code_environment?.starterCode || "",
                                      allowRun: formData.code_environment?.allowRun ?? true,
                                      allowSubmit: formData.code_environment?.allowSubmit ?? true,
                                    });
                                  }}
                                  className="rounded"
                                />
                                <span>Hidden</span>
                              </label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = formData.code_environment?.testCases?.filter(
                                    (_, i) => i !== index
                                  ) || [];
                                  handleInputChange("code_environment", {
                                    ...formData.code_environment,
                                    testCases: updated,
                                    language: formData.code_environment?.language || "javascript",
                                    instructions: formData.code_environment?.instructions || "",
                                    starterCode: formData.code_environment?.starterCode || "",
                                    allowRun: formData.code_environment?.allowRun ?? true,
                                    allowSubmit: formData.code_environment?.allowSubmit ?? true,
                                  });
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Input
                              </label>
                              <Input
                                value={testCase.input}
                                onChange={(e) => {
                                  const updated = [...(formData.code_environment?.testCases || [])];
                                  updated[index] = {
                                    ...updated[index],
                                    input: e.target.value,
                                  };
                                  handleInputChange("code_environment", {
                                    ...formData.code_environment,
                                    testCases: updated,
                                    language: formData.code_environment?.language || "javascript",
                                    instructions: formData.code_environment?.instructions || "",
                                    starterCode: formData.code_environment?.starterCode || "",
                                    allowRun: formData.code_environment?.allowRun ?? true,
                                    allowSubmit: formData.code_environment?.allowSubmit ?? true,
                                  });
                                }}
                                placeholder="add(2, 3)"
                                className="font-mono text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Expected Output
                              </label>
                              <Input
                                value={testCase.expectedOutput}
                                onChange={(e) => {
                                  const updated = [...(formData.code_environment?.testCases || [])];
                                  updated[index] = {
                                    ...updated[index],
                                    expectedOutput: e.target.value,
                                  };
                                  handleInputChange("code_environment", {
                                    ...formData.code_environment,
                                    testCases: updated,
                                    language: formData.code_environment?.language || "javascript",
                                    instructions: formData.code_environment?.instructions || "",
                                    starterCode: formData.code_environment?.starterCode || "",
                                    allowRun: formData.code_environment?.allowRun ?? true,
                                    allowSubmit: formData.code_environment?.allowSubmit ?? true,
                                  });
                                }}
                                placeholder="5"
                                className="font-mono text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Description (optional)
                            </label>
                            <Input
                              value={testCase.description || ""}
                              onChange={(e) => {
                                const updated = [...(formData.code_environment?.testCases || [])];
                                updated[index] = {
                                  ...updated[index],
                                  description: e.target.value,
                                };
                                handleInputChange("code_environment", {
                                  ...formData.code_environment,
                                  testCases: updated,
                                  language: formData.code_environment?.language || "javascript",
                                  instructions: formData.code_environment?.instructions || "",
                                  starterCode: formData.code_environment?.starterCode || "",
                                  allowRun: formData.code_environment?.allowRun ?? true,
                                  allowSubmit: formData.code_environment?.allowSubmit ?? true,
                                });
                              }}
                              placeholder="Tests basic addition"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      )
                    )}

                    {(!formData.code_environment?.testCases ||
                      formData.code_environment.testCases.length === 0) && (
                      <div className="text-center py-4 text-sm text-gray-500 border border-dashed rounded-lg">
                        No test cases added yet. Click "Add Test Case" to create one.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            {/* Option 1: Disable save button during upload */}
            {(isVideoUploading || isDocumentUploading) && (
              <div className="w-full mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                ⏳ Please wait for upload to complete before saving...
              </div>
            )}
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.title.trim() ||
                isVideoUploading ||
                isDocumentUploading
              }
              className="flex-1"
            >
              {loading
                ? "Saving..."
                : isVideoUploading || isDocumentUploading
                ? "Uploading..."
                : "Save Lesson"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
