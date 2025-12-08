"use client"

import { useRouter } from "next/navigation"

export default function AchievementsPage() {
  const router = useRouter()
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Achievement Unlocked</h1>
      <p className="mb-4">You earned the "React Master" badge by completing 5 React courses</p>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Back
      </button>
    </div>
  )
}
