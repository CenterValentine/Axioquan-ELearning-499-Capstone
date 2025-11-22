
//  /components/courses/video-player.tsx

'use client'

import { useState } from "react"
import Link from "next/link"
import { Play, Pause, Volume2, Settings, Bookmark, ChevronLeft } from "lucide-react"

interface VideoPlayerPageProps {
  courseId: string
  lessonId: string
}

export default function VideoPlayerPage({ courseId, lessonId }: VideoPlayerPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [bookmarkedTimes, setBookmarkedTimes] = useState<number[]>([])

  // Mock data - replace with API call
  const lessonData = {
    id: lessonId,
    title: "Understanding JSX",
    duration: 1200,
    watched: 600,
    description: "Learn the fundamentals of JSX syntax in React"
  }

  const handleBookmark = () => {
    if (!bookmarkedTimes.includes(Math.floor(currentTime))) {
      setBookmarkedTimes([...bookmarkedTimes, Math.floor(currentTime)])
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (lessonData.watched / lessonData.duration) * 100

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link 
            href={`/courses/learn/${courseId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft size={20} />
            Back to Course
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{lessonData.title}</h1>
            <p className="text-sm text-gray-600">{lessonData.description}</p>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-6xl aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition"
              >
                {isPlaying ? (
                  <Pause size={32} className="text-white" />
                ) : (
                  <Play size={32} className="text-white fill-white" />
                )}
              </button>
              <p className="text-white text-lg font-semibold">{lessonData.title}</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:scale-110 transition">
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="fill-white" />}
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
                <Bookmark size={20} />
              </button>
              <button className="hover:scale-110 transition">
                <Volume2 size={20} />
              </button>
              <button className="hover:scale-110 transition">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="space-y-2">
              <div className="w-full bg-white/20 rounded-full h-2 cursor-pointer hover:h-2.5 transition-all">
                <div
                  className="bg-blue-500 rounded-full h-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-white text-sm">
                <span>{formatTime(lessonData.watched)}</span>
                <span>{formatTime(lessonData.duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}