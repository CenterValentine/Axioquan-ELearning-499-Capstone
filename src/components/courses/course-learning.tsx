// /components/courses/course-learning.tsx

'use client'

import { useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  Settings,
  Maximize,
  Bookmark,
  CheckCircle2,
  BookOpen,
  Expand,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react"

interface Lesson {
  id: string
  title: string
  duration: number
  watched: number
  type: "video" | "pdf" | "document"
  completed: boolean
  bookmarks?: number[]
}

interface Module {
  id: string
  title: string
  progress: number
  lessons: Lesson[]
}

interface CourseData {
  id: string
  title: string
  description: string
  instructor: string
  modules: Module[]
}

interface CourseLearningProps {
  courseId: string
}

export default function CourseLearningPage({ courseId }: CourseLearningProps) {
  const [currentModule, setCurrentModule] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [expandedModules, setExpandedModules] = useState<number[]>([0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [bookmarkedTimes, setBookmarkedTimes] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "resources">("overview")
  const [notes, setNotes] = useState("")
  const [isVideoExpanded, setIsVideoExpanded] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Mock course data - you'll replace this with API data later
  const courseData: CourseData = {
    id: courseId,
    title: "Advanced React Masterclass",
    description: "Master React with modern patterns and best practices",
    instructor: "Sarah Anderson",
    modules: [
      {
        id: "1",
        title: "Module 1: React Fundamentals",
        progress: 100,
        lessons: [
          { id: "1-1", title: "Understanding JSX", duration: 1200, watched: 1200, type: "video", completed: true },
          { id: "1-2", title: "Components and Props", duration: 1500, watched: 800, type: "video", completed: false },
          { id: "1-3", title: "State Management Basics", duration: 1800, watched: 0, type: "video", completed: false },
        ],
      },
      {
        id: "2",
        title: "Module 2: Hooks Deep Dive",
        progress: 45,
        lessons: [
          { id: "2-1", title: "useState Hook", duration: 1400, watched: 0, type: "video", completed: false },
          { id: "2-2", title: "useEffect Hook", duration: 1600, watched: 0, type: "video", completed: false },
          { id: "2-3", title: "Custom Hooks", duration: 1900, watched: 0, type: "video", completed: false },
        ],
      },
      {
        id: "3",
        title: "Module 3: Context API & Redux",
        progress: 0,
        lessons: [
          { id: "3-1", title: "Context API Introduction", duration: 1300, watched: 0, type: "video", completed: false },
          { id: "3-2", title: "Redux Fundamentals", duration: 2000, watched: 0, type: "video", completed: false },
        ],
      },
    ],
  }

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex)
    setCurrentLesson(lessonIndex)
    setCurrentTime(0)
    setIsPlaying(false)
    setIsMobileSidebarOpen(false) // Close mobile sidebar when lesson is selected
  }

  const handleBookmark = () => {
    if (!bookmarkedTimes.includes(Math.floor(currentTime))) {
      setBookmarkedTimes([...bookmarkedTimes, Math.floor(currentTime)])
    }
  }

  const completeLesson = () => {
    courseData.modules[currentModule].lessons[currentLesson].completed = true
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const currentLessonData = courseData.modules[currentModule].lessons[currentLesson]
  const progressPercentage = (currentLessonData.watched / currentLessonData.duration) * 100
  const overallProgress = Math.round(courseData.modules.reduce((sum, m) => sum + m.progress, 0) / courseData.modules.length)

  // AxioQuan Logo Component
// AxioQuan Logo Component - Larger version
const AxioQuanLogo = ({ size = "default" }: { size?: "default" | "small" }) => (
  <div className={`flex items-center gap-3 ${size === "small" ? 'px-2' : 'px-4'}`}>
    <div className="flex items-center justify-center bg-black rounded-lg p-3 w-8 h-8">
      <span className="text-white font-bold text-xl">A</span>
    </div>
    {size === "default" && (
      <span className="font-bold text-xl text-foreground">AxioQuan</span>
    )}
  </div>
)
  // If video is expanded, show full screen video page
  if (isVideoExpanded) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center gap-4">
            <AxioQuanLogo size="small" />
            <h2 className="text-lg font-semibold">{currentLessonData.title}</h2>
          </div>
          <button
            onClick={() => setIsVideoExpanded(false)}
            className="text-white hover:bg-gray-800 p-2 rounded"
          >
            ✕
          </button>
        </div>

        {/* Full Screen Video */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <div className="w-full max-w-4xl aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur">
                  <Play size={48} className="text-white fill-white" />
                </div>
                <p className="text-white text-lg font-semibold">{currentLessonData.title}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-3">
                <div className="w-full bg-white/20 rounded-full h-1.5 cursor-pointer hover:h-2 transition-all">
                  <div
                    className="bg-accent rounded-full h-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-white text-sm">
                  <span>{formatTime(currentLessonData.watched)}</span>
                  <span>{formatTime(currentLessonData.duration)}</span>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-20 left-0 right-0 flex items-center justify-between px-4 text-white">
              <button onClick={() => setIsPlaying(!isPlaying)} className="hover:scale-110 transition">
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="fill-white" />}
              </button>
              <div className="flex items-center gap-4">
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-white/20 px-3 py-1 rounded text-sm backdrop-blur hover:bg-white/30 transition text-white"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
                <button onClick={handleBookmark} className="hover:scale-110 transition" title="Bookmark">
                  <Bookmark size={24} />
                </button>
                <button className="hover:scale-110 transition">
                  <Volume2 size={24} />
                </button>
                <button className="hover:scale-110 transition">
                  <Settings size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile Sidebar Overlay
  const MobileSidebar = () => (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-4 border-b border-border bg-white">
          <div className="flex items-center justify-between mb-4">
            <AxioQuanLogo />
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition group w-full"
          >
            <LayoutDashboard size={20} className="text-primary" />
            <span className="font-semibold text-foreground">Back to Dashboard</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 h-[calc(100vh-140px)]">
          {courseData.modules.map((module, moduleIndex) => (
            <div key={module.id} className="space-y-1">
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <BookOpen size={18} className="text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">{module.title}</p>
                    <p className="text-xs text-muted-foreground">{module.progress}% complete</p>
                  </div>
                </div>
                {expandedModules.includes(moduleIndex) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {expandedModules.includes(moduleIndex) && (
                <div className="space-y-1 ml-4">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(moduleIndex, lessonIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                        currentModule === moduleIndex && currentLesson === lessonIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 text-foreground"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                      ) : (
                        <Play size={16} className="flex-shrink-0" />
                      )}
                      <span className="flex-1 text-left truncate">{lesson.title}</span>
                      <span className="text-xs opacity-75">{formatTime(lesson.duration)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Desktop Sidebar Navigation - Fixed Position with Dashboard Link */}
      <div className="hidden md:flex w-80 bg-white/90 backdrop-blur-md border-r border-border flex-col overflow-hidden fixed left-0 top-0 bottom-0 z-30">
        {/* Logo and Dashboard Header */}
        <div className="p-4 border-b border-border bg-white/95">
          <div className="mb-4">
            <AxioQuanLogo />
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition group"
          >
            <LayoutDashboard size={20} className="text-primary" />
            <span className="font-semibold text-foreground">Back to Dashboard</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {courseData.modules.map((module, moduleIndex) => (
            <div key={module.id} className="space-y-1">
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <BookOpen size={18} className="text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">{module.title}</p>
                    <p className="text-xs text-muted-foreground">{module.progress}% complete</p>
                  </div>
                </div>
                {expandedModules.includes(moduleIndex) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {expandedModules.includes(moduleIndex) && (
                <div className="space-y-1 ml-4">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(moduleIndex, lessonIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                        currentModule === moduleIndex && currentLesson === lessonIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 text-foreground"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                      ) : (
                        <Play size={16} className="flex-shrink-0" />
                      )}
                      <span className="flex-1 text-left truncate">{lesson.title}</span>
                      <span className="text-xs opacity-75">{formatTime(lesson.duration)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area - Normal Page Scroll with Sidebar Offset */}
      <div className="flex-1 overflow-y-auto md:ml-80 w-full">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-border p-4 sticky top-0 z-30 w-full">
          <div className="flex items-center justify-between w-full">
            <AxioQuanLogo size="small" />
            <div className="flex-1 ml-3 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {courseData.title}
              </h1>
              
              {/* Current Lesson Info for Mobile */}
              <div className="mt-1">
                <p className="text-xs text-muted-foreground truncate">{courseData.modules[currentModule].title}</p>
                <p className="font-semibold text-foreground text-sm truncate">{currentLessonData.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Course Menu Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 active:scale-95 z-40 animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <Menu size={24} />
          <span className="sr-only">Open Course Menu</span>
        </button>

        <div className="w-full max-w-none">
          {/* Course Title Header - Full Width (Hidden on mobile) */}
          <div className="bg-white p-6 md:p-8 border-b border-border w-full hidden md:block">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
              <p className="text-gray-600 text-lg">{courseData.description}</p>
              <p className="text-gray-500 mt-1">Instructor: {courseData.instructor}</p>
            </div>
          </div>

          {/* Video Player Section - Full Width */}
          <div className="bg-white p-4 md:p-8 border-b border-border w-full">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
              <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-video max-w-4xl mx-auto shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 cursor-pointer"
                     onClick={() => setIsVideoExpanded(true)}>
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur">
                      <Play size={32} className="text-white fill-white" />
                    </div>
                    <p className="text-white text-sm font-semibold">Click to expand video</p>
                  </div>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => setIsVideoExpanded(true)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition"
                  title="Expand to full screen"
                >
                  <Expand size={20} />
                </button>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="space-y-2">
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div
                        className="bg-accent rounded-full h-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-white text-xs">
                      <span>{formatTime(currentLessonData.watched)}</span>
                      <span>{formatTime(currentLessonData.duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Watch on Separate Page Link */}
              <div className="mt-4 text-center">
                <Link 
                  href={`/courses/watch/${courseId}/${currentLessonData.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                >
                  <Play size={16} />
                  Watch on separate page
                </Link>
              </div>
            </div>
          </div>

          {/* Overall Progress Bar - Full Width */}
          <div className="bg-white p-4 md:p-6 border-b border-border w-full">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Course Progress</span>
                <span className="text-primary font-bold">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary rounded-full h-3 transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                You've completed {overallProgress}% of the course. Keep going!
              </p>
            </div>
          </div>

          {/* Lesson Content Section - Full Width */}
          <div className="bg-white px-4 md:px-8 py-6 md:py-8 w-full">
            {/* Lesson Header - Full Width but content constrained */}
            <div className="border-b border-border pb-6 md:pb-8 w-full">
              <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
                <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                  <div className="hidden md:block">
                    <p className="text-sm text-muted-foreground mb-2">{courseData.modules[currentModule].title}</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{currentLessonData.title}</h1>
                    <p className="text-muted-foreground">{currentLessonData.duration / 60} minute video lesson</p>
                  </div>
                  <button
                    onClick={completeLesson}
                    className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap w-full md:w-auto ${
                      currentLessonData.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {currentLessonData.completed ? "Completed" : "Mark Complete"}
                  </button>
                </div>
              </div>
            </div>

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
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">About this lesson</h3>
                        <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                          In this lesson, we'll explore the fundamentals of React including JSX syntax, component structure, and
                          how to work with props. You'll learn practical patterns that are used in production applications and
                          understand the philosophy behind React's design decisions.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 md:p-6 w-full">
                        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">Learning Objectives</h3>
                        <ul className="space-y-2 md:space-y-3 text-muted-foreground">
                          <li className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            Understand JSX syntax and its relationship with JavaScript
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            Create and use React components effectively
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            Pass data between components using props
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            Apply React best practices in real-world scenarios
                          </li>
                        </ul>
                      </div>

                      <div className="w-full">
                        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">Bookmarks</h3>
                        <div className="space-y-2 md:space-y-3 w-full">
                          {bookmarkedTimes.length > 0 ? (
                            bookmarkedTimes.map((time, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentTime(time)}
                                className="w-full text-left px-3 py-2 md:px-4 md:py-3 rounded-lg bg-muted hover:bg-muted/80 transition flex items-center gap-3"
                              >
                                <Bookmark size={14} className="text-blue-500 flex-shrink-0" />
                                <div>
                                  <span className="font-semibold text-foreground text-sm md:text-base">{formatTime(time)}</span>
                                  <span className="text-xs text-muted-foreground ml-2">Bookmark {index + 1}</span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg w-full">
                              <Bookmark size={36} className="text-gray-400 mx-auto mb-2 md:mb-3" />
                              <p className="text-muted-foreground">No bookmarks yet</p>
                              <p className="text-sm text-muted-foreground mt-1">Add bookmarks while watching the video!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="w-full py-4 md:py-6">
                    <div className="space-y-4 md:space-y-6 w-full">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">Your Notes</h3>
                      
                      {/* Text Formatting Toolbar */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 md:p-3 flex flex-wrap gap-1 md:gap-2 w-full">
                        <button className="p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Bold">
                          <Bold size={16} />
                        </button>
                        <button className="p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Italic">
                          <Italic size={16} />
                        </button>
                        <button className="p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Underline">
                          <Underline size={16} />
                        </button>
                        <div className="w-px bg-gray-300 h-4 md:h-6"></div>
                        <button className="p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Bullet List">
                          <List size={16} />
                        </button>
                        <button className="p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Numbered List">
                          <ListOrdered size={16} />
                        </button>
                        <button className="p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Insert Link">
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
                        <span>{notes.length} characters • {notes.split(/\s+/).filter(word => word.length > 0).length} words</span>
                      </div>

                      {/* Quick Formatting Tips */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 w-full">
                        <h4 className="font-semibold text-blue-900 mb-2">Formatting Tips</h4>
                        <ul className="text-blue-800 text-xs md:text-sm space-y-1">
                          <li>• Use <strong>**bold**</strong> for important concepts</li>
                          <li>• Use <em>*italic*</em> for emphasis</li>
                          <li>• Start lines with <code>-</code> for bullet points</li>
                          <li>• Start lines with <code>1.</code> for numbered lists</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="w-full py-4 md:py-6">
                    <div className="space-y-6 md:space-y-8 w-full">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">Lesson Resources</h3>
                      
                      <div className="grid gap-4 md:gap-6 w-full">
                        {/* Downloadable Materials */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-4 md:p-6 w-full">
                          <h4 className="font-bold text-blue-900 text-lg md:text-xl mb-3 md:mb-4">📚 Downloadable Materials</h4>
                          <div className="space-y-3 md:space-y-4 w-full">
                            <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-100 hover:border-blue-300 transition cursor-pointer w-full">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600 font-bold text-sm md:text-base">PDF</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-blue-900 text-sm md:text-base">Lesson Slides</p>
                                  <p className="text-blue-700 text-xs md:text-sm">Complete presentation slides</p>
                                </div>
                              </div>
                              <button className="w-full mt-2 md:mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm md:text-base">
                                Download (2.4 MB)
                              </button>
                            </div>

                            <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-100 hover:border-blue-300 transition cursor-pointer w-full">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <span className="text-green-600 font-bold text-sm md:text-base">ZIP</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-blue-900 text-sm md:text-base">Starter Code</p>
                                  <p className="text-blue-700 text-xs md:text-sm">Project files and examples</p>
                                </div>
                              </div>
                              <button className="w-full mt-2 md:mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm md:text-base">
                                Download (5.1 MB)
                              </button>
                            </div>

                            <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-100 hover:border-blue-300 transition cursor-pointer w-full">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <span className="text-purple-600 font-bold text-sm md:text-base">DOC</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-blue-900 text-sm md:text-base">Exercise Files</p>
                                  <p className="text-blue-700 text-xs md:text-sm">Practice exercises and solutions</p>
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
                          <h4 className="font-bold text-green-900 text-lg md:text-xl mb-3 md:mb-4">🔗 Useful Links & References</h4>
                          <div className="space-y-3 md:space-y-4 w-full">
                            <a href="#" className="block bg-white rounded-lg p-3 md:p-4 border border-green-100 hover:border-green-300 transition cursor-pointer hover:shadow-md w-full">
                              <p className="font-semibold text-green-900 text-sm md:text-base">React Official Documentation</p>
                              <p className="text-green-700 text-xs md:text-sm">Complete React API reference and guides</p>
                              <span className="text-green-600 text-xs mt-1 md:mt-2 block">reactjs.org</span>
                            </a>

                            <a href="#" className="block bg-white rounded-lg p-3 md:p-4 border border-green-100 hover:border-green-300 transition cursor-pointer hover:shadow-md w-full">
                              <p className="font-semibold text-green-900 text-sm md:text-base">JSX Syntax Guide</p>
                              <p className="text-green-700 text-xs md:text-sm">Deep dive into JSX syntax and features</p>
                              <span className="text-green-600 text-xs mt-1 md:mt-2 block">react.dev</span>
                            </a>

                            <a href="#" className="block bg-white rounded-lg p-3 md:p-4 border border-green-100 hover:border-green-300 transition cursor-pointer hover:shadow-md w-full">
                              <p className="font-semibold text-green-900 text-sm md:text-base">Component Best Practices</p>
                              <p className="text-green-700 text-xs md:text-sm">Industry standards and patterns</p>
                              <span className="text-green-600 text-xs mt-1 md:mt-2 block">patterns.react.dev</span>
                            </a>

                            <a href="#" className="block bg-white rounded-lg p-3 md:p-4 border border-green-100 hover:border-green-300 transition cursor-pointer hover:shadow-md w-full">
                              <p className="font-semibold text-green-900 text-sm md:text-base">Interactive Examples</p>
                              <p className="text-green-700 text-xs md:text-sm">Live code examples and playground</p>
                              <span className="text-green-600 text-xs mt-1 md:mt-2 block">codesandbox.io</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons - Full Width but content constrained */}
            <div className="border-t border-border w-full mt-6 md:mt-8">
              <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
                <div className="flex gap-3 md:gap-4 py-6 md:py-8 flex-col md:flex-row">
                  <button
                    onClick={() => {
                      if (currentLesson > 0) selectLesson(currentModule, currentLesson - 1)
                      else if (currentModule > 0)
                        selectLesson(currentModule - 1, courseData.modules[currentModule - 1].lessons.length - 1)
                    }}
                    disabled={currentModule === 0 && currentLesson === 0}
                    className="px-6 py-3 md:px-8 md:py-3 rounded-lg border border-border hover:bg-muted transition disabled:opacity-50 font-semibold text-sm md:text-base"
                  >
                    Previous Lesson
                  </button>
                  <button
                    onClick={() => {
                      if (currentLesson < courseData.modules[currentModule].lessons.length - 1) {
                        selectLesson(currentModule, currentLesson + 1)
                      } else if (currentModule < courseData.modules.length - 1) {
                        selectLesson(currentModule + 1, 0)
                      }
                    }}
                    disabled={
                      currentModule === courseData.modules.length - 1 &&
                      currentLesson === courseData.modules[currentModule].lessons.length - 1
                    }
                    className="px-6 py-3 md:px-8 md:py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 font-semibold text-sm md:text-base"
                  >
                    Next Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}