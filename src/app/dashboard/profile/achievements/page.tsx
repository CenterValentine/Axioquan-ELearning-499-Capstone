export default function AchievementPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-10 border border-gray-200">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-yellow-600 mb-2">
          🏆 Achievement Unlocked!
        </h1>

        {/* Badge */}
        <h2 className="text-xl font-semibold text-center text-indigo-700 mb-8">
          You Earned the "React Master" Badge
        </h2>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-4">
          Congratulations! You’ve officially unlocked the{" "}
          <span className="font-bold">React Master</span> achievement by
          successfully completing <span className="font-semibold">5 advanced React courses</span>.
          This is a major accomplishment and a strong confirmation of your skills and dedication.
        </p>

        {/* What This Badge Means */}
        <h3 className="font-bold text-gray-900 text-lg mt-6 mb-2">
          🎯 What This Badge Represents
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          This badge highlights your ability to:
        </p>
        <ul className="list-disc ml-6 text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>Build scalable, professional React applications</li>
          <li>Use advanced hooks efficiently</li>
          <li>Work with complex component architectures</li>
          <li>Optimize performance and handle UI state effectively</li>
          <li>Understand best practices used in real-world production apps</li>
        </ul>

        {/* Completed Courses */}
        <h3 className="font-bold text-gray-900 text-lg mt-6 mb-2">
          📘 Courses You Completed
        </h3>
        <ul className="list-disc ml-6 text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>React Fundamentals</li>
          <li>Advanced React Patterns</li>
          <li>React Hooks Mastery</li>
          <li>React & State Management</li>
          <li>React Performance Optimization</li>
        </ul>

        {/* Special Recognition Box */}
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-xl p-4 mt-6 mb-8">
          <p className="font-semibold">
            🌟 Special Recognition
          </p>
          <p>
            Students who earn this badge are among the top React learners on the
            platform. Keep pushing forward — you’re on track to becoming a full React expert!
          </p>
        </div>

        {/* Next Steps */}
        <h3 className="font-bold text-gray-900 text-lg mt-6 mb-2">
          🚀 What’s Next?
        </h3>
        <p className="text-gray-700 leading-relaxed mb-6">
          Continue mastering React by exploring advanced ecosystems such as:
        </p>
        <ul className="list-disc ml-6 text-gray-700 leading-relaxed mb-8 space-y-1">
          <li>Next.js Framework</li>
          <li>React Native for Mobile Development</li>
          <li>State Machines with XState</li>
          <li>Server Components & App Router</li>
        </ul>

        {/* Button */}
        <div className="text-center">
          <a
            href="#"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            🎉 View All Achievements
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
