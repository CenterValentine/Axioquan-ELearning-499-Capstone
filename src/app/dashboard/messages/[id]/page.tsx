export default function MessageFromInstructor() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-6 py-16">
      <div className="max-w-2xl w-full bg-white border border-gray-200 shadow-xl rounded-2xl p-10">
        
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
          📩 Message From Your Instructor
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Python for Data Science • Course Feedback
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Hello! I wanted to take a moment to congratulate you on the excellent
          performance you demonstrated in your recent quiz. Your understanding
          of Python fundamentals, data structures, and analysis concepts is very
          impressive.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Your progress shows strong analytical thinking and attention to detail.
          Keep studying regularly and keep applying the concepts as you go—
          you're on a great path.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          If you ever need clarification or want additional resources on machine
          learning, data wrangling, or visualization, don’t hesitate to reach
          out. I'm here to help you succeed.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="font-semibold text-blue-900">📘 Next Suggestions:</p>
          <ul className="list-disc ml-6 text-blue-900">
            <li>Practice more Pandas and NumPy exercises</li>
            <li>Try building a small data analysis project</li>
            <li>Review quiz mistakes and retry similar problems</li>
          </ul>
        </div>

        <div className="text-center">
          <a
            href="/dashboard/messages"
            className="inline-block bg-blue-600 px-6 py-3 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            View All Messages
          </a>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">Sent: Dec 2025</p>
      </div>
    </div>
  );
}
