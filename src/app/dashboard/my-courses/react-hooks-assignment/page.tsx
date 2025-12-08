"use client"

import { useRouter } from "next/navigation"

export default function ReactHooksAssignmentPage() {
  const router = useRouter()
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">New Assignment Posted</h1>
      <p className="mb-2">React Hooks Assignment has been posted for Advanced React Masterclass</p>
      <p className="text-sm text-blue-600 mb-4">Advanced React Masterclass</p>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Back
      </button>
    </div>
  )
}
