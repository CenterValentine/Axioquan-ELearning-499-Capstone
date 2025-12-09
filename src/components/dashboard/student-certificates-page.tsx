// /components/dashboard/student-certificates-page.tsx

'use client'

import { useState } from "react"

const certificatesData = [
  {
    id: 1,
    title: "Introduction to Python Programming",
    instructor: "Dr. Sarah Johnson",
    issueDate: "March 15, 2024",
    category: "Programming",
    score: 95,
    certificateId: "#AQ-2024-PY-001334",
  },
  {
    id: 2,
    title: "JavaScript Basics",
    instructor: "John Smith",
    issueDate: "March 1, 2024",
    category: "Programming",
    score: 80,
    certificateId: "#AQ-2024-JS-001223",
  },
  {
    id: 3,
    title: "HTML & CSS Fundamentals",
    instructor: "Emma Wilson",
    issueDate: "February 20, 2024",
    category: "Programming",
    score: 98,
    certificateId: "#AQ-2024-WEB-001089",
  },
]

const specialAwardsData = [
  {
    id: 1,
    title: "Outstanding Participation",
    description: "Awarded for exceptional engagement and contribution in class discussions",
  },
  {
    id: 2,
    title: "Quick Learner",
    description: "Completed course 2 weeks ahead of schedule",
  },
  {
    id: 3,
    title: "Perfect Score",
    description: "Achieved 100% on final assessment",
  },
]

export default function StudentCertificatesPage() {
  const [filter, setFilter] = useState("certificates")

  const handleDownload = (certTitle: string) => {
    // Simulate download PDF
    alert(`Downloading certificate for "${certTitle}"...`);
  }

  const handleShare = (certTitle: string) => {
    // Simulate share
    alert(`Sharing certificate "${certTitle}"...`);
  }

  const handleVerify = (certId: string) => {
    // Simulate verify
    alert(`Certificate ${certId} is valid!`);
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600 mt-2">Your earned certificates and achievements</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Certificates</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">{certificatesData.length}</p>
            </div>
            <div className="text-3xl md:text-4xl">📜</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Course Completions</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">3</p>
            </div>
            <div className="text-3xl md:text-4xl">✓</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Specializations</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-2">1</p>
            </div>
            <div className="text-3xl md:text-4xl">🎯</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Achievements</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-2">{specialAwardsData.length}</p>
            </div>
            <div className="text-3xl md:text-4xl">⭐</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 mb-8 border-b border-gray-200">
        <button
          onClick={() => setFilter("certificates")}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
            filter === "certificates"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Course Certificates ({certificatesData.length})
        </button>

        <button
          onClick={() => setFilter("awards")}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
            filter === "awards"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Special Awards ({specialAwardsData.length})
        </button>
      </div>

      {filter === "certificates" ? (
        <div className="space-y-4 md:space-y-6">
          {certificatesData.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow p-4 md:p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-4 pb-4 border-b border-gray-200">
                {/* Badge */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl md:text-4xl">
                    🎖
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{cert.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600">Instructor: {cert.instructor}</p>
                  <p className="text-xs md:text-sm text-gray-600">Issued {cert.issueDate}</p>
                </div>

                {/* Score Badge */}
                <div className="flex-shrink-0 bg-green-50 rounded-lg px-4 py-2 text-center">
                  <p className="text-xs text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-green-600">{cert.score}%</p>
                </div>
              </div>

              {/* Category and Certificate ID */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {cert.category}
                  </span>
                  <span className="text-xs text-gray-600">{cert.certificateId}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDownload(cert.title)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                >
                  📥 Download PDF
                </button>
                <button
                  onClick={() => handleShare(cert.title)}
                  className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Share
                </button>
                 <button
                  onClick={() => handleVerify(cert.certificateId)}
                  className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {specialAwardsData.map((award) => (
            <div
              key={award.id}
              className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl flex-shrink-0">🏆</div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">{award.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mt-1">{award.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Achievement CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Share Your Achievements</h3>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Add certificates to your LinkedIn profile or download them as PDFs
            </p>
          </div>
          <button
        className="flex-shrink-0 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm md:text-base whitespace-nowrap"
        onClick={() => {
          const url = encodeURIComponent("https://your-platform.com/dashboard/certificates");
          const title = encodeURIComponent("Check out my achievements!");
          const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`;
          window.open(linkedInShare, "_blank");
        }}
      >
        Share on LinkedIn
      </button>
        </div>
      </div>
    </div>
  )
}