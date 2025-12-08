"use client";

import { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import { Lesson as DbLesson } from "@/lib/db/queries/curriculum";
import { Lesson as UILesson } from "@/types/lesson";
import { LearningObjectives } from "./learning-objectives";
import { BookmarksSection } from "./bookmarks-section";

type AnyLesson = DbLesson | UILesson;

interface LessonContentTabsProps {
  lesson: AnyLesson;
  currentModule: number;
  currentLesson: number;
  onBookmarkClick: (time: number) => void;
}

export function LessonContentTabs({
  lesson,
  currentModule,
  currentLesson,
  onBookmarkClick,
}: LessonContentTabsProps) {
  // Manage bookmarked times per lesson
  const [bookmarkedTimes, setBookmarkedTimes] = useState<number[]>([]);

  // Manage notes per lesson
  const [notes, setNotes] = useState("");

  // Reset bookmarks and notes when lesson changes
  useEffect(() => {
    setBookmarkedTimes([]);
    setNotes("");
  }, [lesson.id]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "resources"
  >("overview");

  return (
    <>
      {/* Lesson Content Tabs - Full Width but content constrained */}
      <div className="border-b border-border w-full">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
          <div className="flex gap-2 md:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-2 md:px-4 md:py-3 font-semibold transition whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-3 py-2 md:px-4 md:py-3 font-semibold transition whitespace-nowrap ${
                activeTab === "notes"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-3 py-2 md:px-4 md:py-3 font-semibold transition whitespace-nowrap ${
                activeTab === "resources"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Resources
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content - ONLY this section is constrained to max-w-4xl */}
      <div className="w-full">
        <div className="max-w-4xl mx-auto mt-6 md:mt-8 px-4 md:px-6">
          {activeTab === "overview" && (
            <div className="w-full py-4 md:py-6">
              <div className="space-y-6 md:space-y-8 w-full">
                {/* About this lesson */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">
                    About this lesson
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {lesson.description}
                  </p>
                </div>

                {/* Learning Objectives */}
                <LearningObjectives />

                {/* Bookmarks */}
                <BookmarksSection
                  bookmarkedTimes={bookmarkedTimes}
                  onBookmarkClick={onBookmarkClick}
                />
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="w-full py-4 md:py-6">
              <div className="space-y-4 md:space-y-6 w-full">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  Your Notes
                </h3>

                {/* Text Formatting Toolbar */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 md:p-3 flex flex-wrap gap-1 md:gap-2 w-full">
                  <button
                    className="p-1 md:p-2 hover:bg-gray-200 rounded transition"
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    className="p-1 md:p-2 hover:bg-gray-200 rounded transition"
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    className="p-1 md:p-2 hover:bg-gray-200 rounded transition"
                    title="Underline"
                  >
                    <Underline size={16} />
                  </button>
                  <div className="w-px bg-gray-300 h-4 md:h-6"></div>
                  <button
                    className="p-1 md:p-2 hover:bg-gray-200 rounded transition"
                    title="Bullet List"
                  >
                    <List size={16} />
                  </button>
                  <button
                    className="p-1 md:p-2 hover:bg-gray-200 rounded transition"
                    title="Numbered List"
                  >
                    <ListOrdered size={16} />
                  </button>
                  <button
                    className="p-1 md:p-2 hover:bg-gray-200 rounded transition"
                    title="Insert Link"
                  >
                    <LinkIcon size={16} />
                  </button>
                </div>

                {/* Large Text Area - Full Width */}
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Start typing your notes here... You can format your text using the toolbar above. Write down key concepts, questions, code snippets, or insights from this lesson."
                  className="w-full min-h-[300px] md:min-h-[400px] p-4 md:p-6 rounded-lg border border-gray-300 bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base md:text-lg leading-relaxed resize-y"
                />

                <div className="flex justify-between items-center text-xs md:text-sm text-muted-foreground w-full flex-col md:flex-row gap-2 md:gap-0">
                  <span>Your notes are automatically saved as you type</span>
                  <span>
                    {notes.length} characters •{" "}
                    {
                      notes.split(/\s+/).filter((word) => word.length > 0)
                        .length
                    }{" "}
                    words
                  </span>
                </div>

                {/* Quick Formatting Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 w-full">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Formatting Tips
                  </h4>
                  <ul className="text-blue-800 text-xs md:text-sm space-y-1">
                    <li>
                      • Use <strong>**bold**</strong> for important concepts
                    </li>
                    <li>
                      • Use <em>*italic*</em> for emphasis
                    </li>
                    <li>
                      • Start lines with <code>-</code> for bullet points
                    </li>
                    <li>
                      • Start lines with <code>1.</code> for numbered lists
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="w-full py-4 md:py-6">
              <div className="space-y-6 md:space-y-8 w-full">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  Lesson Resources
                </h3>

                <div className="grid gap-4 md:gap-6 w-full">
                  {/* Downloadable Materials */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-4 md:p-6 w-full">
                    <h4 className="font-bold text-blue-900 text-lg md:text-xl mb-3 md:mb-4">
                      📚 Downloadable Materials
                    </h4>
                    <div className="space-y-3 md:space-y-4 w-full">
                      <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-100 hover:border-blue-300 transition cursor-pointer w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm md:text-base">
                              PDF
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-blue-900 text-sm md:text-base">
                              Lesson Slides
                            </p>
                            <p className="text-blue-700 text-xs md:text-sm">
                              Complete presentation slides
                            </p>
                          </div>
                        </div>
                        <button className="w-full mt-2 md:mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm md:text-base">
                          Download (2.4 MB)
                        </button>
                      </div>

                      <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-100 hover:border-blue-300 transition cursor-pointer w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm md:text-base">
                              ZIP
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-blue-900 text-sm md:text-base">
                              Starter Code
                            </p>
                            <p className="text-blue-700 text-xs md:text-sm">
                              Project files and examples
                            </p>
                          </div>
                        </div>
                        <button className="w-full mt-2 md:mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm md:text-base">
                          Download (5.1 MB)
                        </button>
                      </div>

                      <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-100 hover:border-blue-300 transition cursor-pointer w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-sm md:text-base">
                              DOC
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-blue-900 text-sm md:text-base">
                              Exercise Files
                            </p>
                            <p className="text-blue-700 text-xs md:text-sm">
                              Practice exercises and solutions
                            </p>
                          </div>
                        </div>
                        <button className="w-full mt-2 md:mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium text-sm md:text-base">
                          Download (1.2 MB)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Useful Links */}
                  <div className="bg-green-50 border border-green-200 rounded-lg md:rounded-xl p-4 md:p-6 w-full">
                    <h4 className="font-bold text-green-900 text-lg md:text-xl mb-3 md:mb-4">
                      🔗 Useful Links & References
                    </h4>
                    <div className="space-y-3 md:space-y-4 w-full">
                      <a
                        href="#"
                        className="block bg-white rounded-lg p-3 md:p-4 border border-green-100 hover:border-green-300 transition cursor-pointer hover:shadow-md w-full"
                      >
                        <p className="font-semibold text-green-900 text-sm md:text-base">
                          React Official Documentation
                        </p>
                        <p className="text-green-700 text-xs md:text-sm">
                          Complete React API reference and guides
                        </p>
                        <span className="text-green-600 text-xs mt-1 md:mt-2 block">
                          reactjs.org
                        </span>
                      </a>

                      <a
                        href="#"
                        className="block bg-white rounded-lg p-3 md:p-4 border border-green-100 hover:border-green-300 transition cursor-pointer hover:shadow-md w-full"
                      >
                        <p className="font-semibold text-green-900 text-sm md:text-base">
                          JSX Syntax Guide
                        </p>
                        <p className="text-green-700 text-xs md:text-sm">
                          Deep dive into JSX syntax and features
                        </p>
                        <span className="text-green-600 text-xs mt-1 md:mt-2 block">
                          react.dev
                        </span>
                      </a>

                      <a
                        href="#"
                        className="block bg-white rounded-lg p-3 md:p-4 border border-green-100 hover:border-green-300 transition cursor-pointer hover:shadow-md w-full"
                      >
                        <p className="font-semibold text-green-900 text-sm md:text-base">
                          Component Best Practices
                        </p>
                        <p className="text-green-700 text-xs md:text-sm">
                          Industry standards and patterns
                        </p>
                        <span className="text-green-600 text-xs mt-1 md:mt-2 block">
                          patterns.react.dev
                        </span>
                      </a>

                      <a
                        href="#"
                        className="block bg-white rounded-lg p-3 md:p-4 border border-green-100 hover:border-green-300 transition cursor-pointer hover:shadow-md w-full"
                      >
                        <p className="font-semibold text-green-900 text-sm md:text-base">
                          Interactive Examples
                        </p>
                        <p className="text-green-700 text-xs md:text-sm">
                          Live code examples and playground
                        </p>
                        <span className="text-green-600 text-xs mt-1 md:mt-2 block">
                          codesandbox.io
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
