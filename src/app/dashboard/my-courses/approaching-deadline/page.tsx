"use client"

import { useRouter } from "next/navigation"

export default function UIUXDeadlinePage() {
  const router = useRouter()
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Approaching Deadline</h1>
      <p className="mb-2">2 days left to submit your UI/UX Design project</p>
      <p className="text-sm text-blue-600 mb-4">UI/UX Design Fundamentals</p>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Back
      </button>
    </div>
  )
}
