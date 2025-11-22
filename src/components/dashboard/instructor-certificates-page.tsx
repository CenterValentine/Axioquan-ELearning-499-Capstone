// /components/dashboard/instructor-certificates-page.tsx

'use client'

import { useState } from "react"

const certificatesData = [
  {
    id: 1,
    studentName: "John Doe",
    courseTitle: "Introduction to Python Programming",
    issueDate: "March 15, 2024",
    score: 95,
    certificateId: "#AQ-2024-PY-001334",
    status: "issued",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    courseTitle: "JavaScript Basics",
    issueDate: "March 1, 2024",
    score: 80,
    certificateId: "#AQ-2024-JS-001223",
    status: "issued",
  },
  {
    id: 3,
    studentName: "Mike Johnson",
    courseTitle: "HTML & CSS Fundamentals",
    issueDate: "February 20, 2024",
    score: 98,
    certificateId: "#AQ-2024-WEB-001089",
    status: "issued",
  },
  {
    id: 4,
    studentName: "Sarah Wilson",
    courseTitle: "Advanced React Patterns",
    issueDate: "Pending",
    score: 92,
    certificateId: "Pending",
    status: "pending",
  },
]

const courseStats = [
  {
    courseTitle: "Introduction to Python Programming",
    totalCertificates: 45,
    averageScore: 87,
    completionRate: "92%",
  },
  {
    courseTitle: "JavaScript Basics",
    totalCertificates: 32,
    averageScore: 83,
    completionRate: "88%",
  },
  {
    courseTitle: "HTML & CSS Fundamentals",
    totalCertificates: 67,
    averageScore: 91,
    completionRate: "95%",
  },
]

export default function InstructorCertificatesPage() {
  const [filter, setFilter] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState("all")

  const filteredCertificates = certificatesData.filter(cert => {
    if (filter === "pending") return cert.status === "pending"
    if (filter === "issued") return cert.status === "issued"
    return true
  })

  const totalCertificates = certificatesData.length
  const pendingCertificates = certificatesData.filter(c => c.status === "pending").length
  const issuedCertificates = certificatesData.filter(c => c.status === "issued").length

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Certificate Management</h1>
        <p className="text-gray-600 mt-2">Manage and track certificates issued for your courses</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Issued</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">{totalCertificates}</p>
            </div>
            <div className="text-3xl md:text-4xl">📜</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-2">{pendingCertificates}</p>
            </div>
            <div className="text-3xl md:text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Successfully Issued</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">{issuedCertificates}</p>
            </div>
            <div className="text-3xl md:text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-2">92%</p>
            </div>
            <div className="text-3xl md:text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* Course Performance */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Course Performance</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courseStats.map((course, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{course.courseTitle}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Certificates Issued:</span>
                  <span className="font-medium">{course.totalCertificates}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Score:</span>
                  <span className="font-medium text-green-600">{course.averageScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion Rate:</span>
                  <span className="font-medium text-blue-600">{course.completionRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
            filter === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          All Certificates ({totalCertificates})
        </button>

        <button
          onClick={() => setFilter("issued")}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
            filter === "issued"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Issued ({issuedCertificates})
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
            filter === "pending"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Pending ({pendingCertificates})
        </button>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cert.studentName}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{cert.courseTitle}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cert.score}%</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{cert.issueDate}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      cert.status === 'issued' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cert.status === 'issued' ? 'Issued' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                      {cert.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-900">
                          Approve
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900">
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
          <p className="text-gray-600">There are no certificates matching your current filters.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Certificate Tools</h3>
            <p className="text-sm text-gray-600 mt-2">
              Manage certificate templates and settings for your courses
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
              Manage Templates
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}