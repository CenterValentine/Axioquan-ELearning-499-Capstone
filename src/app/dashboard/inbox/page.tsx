
// /src/app/dashboard/inbox/page.tsx

"use client"

import { useState } from "react"
import { Search, Bell, MessageSquare, X, AlertCircle, Gift, Clock, Award, Megaphone } from "lucide-react"
import AppShellSidebar from "@/components/layout/AppSidebarNav"
import { getSession } from "@/lib/auth/session"

interface Notification {
  id: string
  type: "assignment" | "achievement" | "message" | "deadline" | "certificate" | "announcement"
  title: string
  message: string
  course?: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface DirectMessage {
  id: string
  sender: string
  senderAvatar: string
  preview: string
  timestamp: Date
  unread: boolean
  messages: { sender: string; content: string; timestamp: Date }[]
}

export default function InboxPage() {
  const [view, setView] = useState<"notifications" | "messages">("notifications")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "unread" | "read">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
const [messageInput, setMessageInput] = useState("")

  // New conversations and messages
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([
    {
      id: "1",
      sender: "Sarah Anderson",
      senderAvatar: "👩‍🏫",
      preview: "Great work on the recent assignment!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unread: true,
      messages: [
        { sender: "Sarah Anderson", content: "Hi! I wanted to review your assignment", timestamp: new Date(Date.now() - 60 * 60 * 1000) },
        { sender: "You", content: "When would be a good time?", timestamp: new Date(Date.now() - 45 * 60 * 1000) },
        { sender: "Sarah Anderson", content: "Great work on the recent assignment!", timestamp: new Date(Date.now() - 30 * 60 * 1000) },
      ],
    },
    {
      id: "2",
      sender: "Study Group - React Enthusiasts",
      senderAvatar: "👥",
      preview: "Anyone free for a study session tomorrow?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: false,
      messages: [],
    },
    {
      id: "3",
      sender: "John Smith",
      senderAvatar: "👨‍🏫",
      preview: "Check out the new course materials",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      unread: false,
      messages: [],
    },
  ])

  const handleSendMessage = async () => {
  if (!messageInput.trim() || !selectedConversation) return;

  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: selectedConversation, // user id or conversation
        message: messageInput,
        courseId: null // if it has associated courses
      })
    });

    if (!res.ok) throw new Error("Failed to send message");

    const data = await res.json();

    // Insert the new message into the conversation
    setDirectMessages((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? { ...conv, messages: [...conv.messages, { sender: "You", content: messageInput, timestamp: new Date() }] }
          : conv
      )
    );

    setMessageInput(""); // clear input
  } catch (err) {
    console.error(err);
  }
};

  const notifications: Notification[] = [
  {
    id: "1",
    type: "assignment",
    title: "New Assignment Posted",
    message: "React Hooks Assignment has been posted for Advanced React Masterclass",
    course: "Advanced React Masterclass",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/dashboard/my-courses/react-hooks-assignment",
  },
  {
    id: "2",
    type: "achievement",
    title: "Achievement Unlocked",
    message: 'You earned the "React Master" badge by completing 5 React courses',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/dashboard/profile/achievements",
  },
  {
    id: "3",
    type: "message",
    title: "Message from Instructor",
    message: "Great work on your recent quiz! Keep it up!",
    course: "Python for Data Science",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/dashboard/messages/[id]",
  },
  {
    id: "4",
    type: "deadline",
    title: "Approaching Deadline",
    message: "2 days left to submit your UI/UX Design project",
    course: "UI/UX Design Fundamentals",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/dashboard/my-courses/approaching-deadline",
  },
  {
    id: "5",
    type: "certificate",
    title: "Certificate Ready",
    message: "Your certificate for JavaScript Basics is ready to download",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/dashboard/certificates",
  },
  {
    id: "6",
    type: "announcement",
    title: "Platform Announcement",
    message: "We are launching new mobile app features next week",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/dashboard/announcements",
  },
]


  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || (filterType === "unread" ? !notif.read : notif.read)
    const matchesCategory = filterCategory === "all" || notif.type === filterCategory
    return matchesSearch && matchesFilter && matchesCategory
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <AlertCircle className="text-blue-500" />
      case "achievement":
        return <Gift className="text-yellow-500" />
      case "message":
        return <MessageSquare className="text-green-500" />
      case "deadline":
        return <Clock className="text-red-500" />
      case "certificate":
        return <Award className="text-purple-500" />
      case "announcement":
        return <Megaphone className="text-orange-500" />
      default:
        return <Bell className="text-gray-500" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppShellSidebar user={{
        id: '1',
        name: 'User',
        email: 'user@example.com',
        primaryRole: 'student',
        image: undefined
      }} />
      
      <div className="flex-1 overflow-hidden flex flex-col lg:ml-5">

        {/* Header */}
        <div className="border-b border-gray-200 bg-white p-6">
          <div className="max-w-7xl mx-auto w-full px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
            <p className="text-gray-600">Stay updated with notifications and messages</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Notifications/Messages List */}
          <div
            className={`border-r border-gray-200 flex flex-col ${
              selectedConversation && view === "messages" ? "hidden md:flex md:w-80" : "w-full md:w-80"
            }`}
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
              <button
                onClick={() => {
                  setView("notifications")
                  setSelectedConversation(null)
                }}
                className={`flex-1 px-4 py-3 font-semibold border-b-2 transition ${
                  view === "notifications"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                <Bell size={18} className="inline mr-2" />
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => {
                  setView("messages")
                  setSelectedConversation(null)
                }}
                className={`flex-1 px-4 py-3 font-semibold border-b-2 transition ${
                  view === "messages"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                <MessageSquare size={18} className="inline mr-2" />
                Messages
              </button>
            </div>

            {/* Search & Filter */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {view === "notifications" && (
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="assignment">Assignments</option>
                    <option value="achievement">Achievements</option>
                    <option value="message">Messages</option>
                    <option value="deadline">Deadlines</option>
                    <option value="certificate">Certificates</option>
                    <option value="announcement">Announcements</option>
                  </select>
                </div>
              )}
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto">
              {view === "notifications" ? (
                filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredNotifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => { if (notif.actionUrl) window.location.href = notif.actionUrl; notif.read = true }}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition border-l-4 ${notif.read ? "border-transparent" : "border-blue-500"}`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold truncate ${notif.read ? "text-gray-500" : "text-gray-900"}`}>{notif.title}</p>
                            <p className="text-sm text-gray-600 truncate">{notif.message}</p>
                            {notif.course && <p className="text-xs text-blue-600 mt-1">{notif.course}</p>}
                            <p className="text-xs text-gray-500 mt-1">{formatTime(notif.timestamp)}</p>
                          </div>
                          {!notif.read && <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500"><p>No notifications yet</p></div>
                )
              ) : (
                directMessages.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {directMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => setSelectedConversation(msg.id)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition border-l-4 ${msg.unread ? "border-blue-500 bg-blue-50" : "border-transparent"}`}
                      >
                        <div className="flex gap-3">
                          <div className="text-2xl flex-shrink-0">{msg.senderAvatar}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold ${msg.unread ? "text-gray-900" : "text-gray-500"}`}>{msg.sender}</p>
                            <p className="text-sm text-gray-600 truncate">{msg.preview}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</p>
                          </div>
                          {msg.unread && <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : <div className="flex items-center justify-center h-full text-gray-500"><p>No messages yet</p></div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          {selectedConversation && view === "messages" && (
            <div className="flex-1 flex flex-col">
              {(() => {
                const conversation = directMessages.find((m) => m.id === selectedConversation)
                return conversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedConversation(null)}
                          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <X size={20} />
                        </button>
                        <div className="text-2xl">{conversation.senderAvatar}</div>
                        <div>
                          <p className="font-semibold text-gray-900">{conversation.sender}</p>
                          <p className="text-xs text-gray-500">Active now</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {conversation.messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.sender === "You" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-75 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4 flex gap-2">
                      <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />

                      <button
                      onClick={handleSendMessage}
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
                      >
                     Send
                    </ button>
                    </div>
                  </>
                ) : null
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}