export default function AnnouncementPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">
          📢 New Assignment Posted
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl font-semibold text-center text-indigo-600 mb-6">
          Advanced React Masterclass
        </h2>

         {/* Main Message */}
        <p className="text-gray-700 leading-relaxed mb-4">
          A new assignment titled <span className="font-bold">“React Hooks Assignment”</span> 
          has been officially posted for the Advanced React Masterclass. This task focuses on 
          helping you build a deeper, real-world understanding of how React Hooks work and how 
          they can be applied to build dynamic components and responsive user experiences.
        </p>

        {/* What You Will Do */}
        <h3 className="font-bold text-gray-900 text-lg mt-6 mb-2">🧩 What You Are Expected to Build</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          In this assignment, you will create a functional React application that uses multiple 
          hooks including <span className="font-semibold">useState, useEffect, useRef,</span> and 
          optionally <span className="font-semibold">useReducer</span>. You'll apply real data 
          handling, user interactions, and component optimization techniques.
        </p>

        {/* Learning Expectations */}
        <h3 className="font-bold text-gray-900 text-lg mt-6 mb-2">🎯 Learning Objectives</h3>
        <ul className="list-disc ml-6 text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>Understand how hooks manage state in functional components</li>
          <li>Learn how to handle side effects efficiently with <span className="font-semibold">useEffect</span></li>
          <li>Use <span className="font-semibold">useRef</span> for DOM access and persistent values</li>
          <li>Handle complex UI logic using <span className="font-semibold">useReducer</span> (optional)</li>
          <li>Work with real API data and asynchronous operations</li>
        </ul>

        {/* Requirements */}
        <h3 className="font-bold text-gray-900 text-lg mt-6 mb-2">📋 Assignment Requirements</h3>
        <ul className="list-disc ml-6 text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>A clean and structured component layout</li>
          <li>Use at least 3 different React Hooks</li>
          <li>Include loading and error states</li>
          <li>Submit your project link (GitHub or deployment)</li>
          <li>Follow the design and functionality guidelines provided</li>
        </ul>

        {/* Deadline */}
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl p-4 mt-6 mb-8">
          <p className="font-semibold">⏳ Deadline:</p>
          <p>Saturday — 11:59 PM EST</p>
          <p className="text-sm mt-1 text-gray-600">
            Please ensure your work is submitted on time to avoid penalties.
          </p>
        </div>

        {/* Button */}
        <div className="text-center">
          <a
            href="#"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            📂 View Assignment Details
          </a>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-10">
          Posted: Dec 2025
        </p>

      </div>
    </div>
  );
}