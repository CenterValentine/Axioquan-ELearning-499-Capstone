export default function DeadlinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-6 py-16">
      <div className="max-w-2xl w-full bg-white border border-gray-200 shadow-xl rounded-2xl p-10">

        <h1 className="text-3xl font-bold text-red-600 text-center mb-2">
          ⏳ Approaching Deadline
        </h1>

        <h2 className="text-lg text-center text-gray-600 mb-8">
          UI/UX Design Fundamentals • Project Submission
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          This is a reminder that your final UI/UX Design project is due in{" "}
          <span className="font-bold">2 days</span>. Please make sure to prepare
          your layout, design components, and interaction flow clearly so you can
          submit a well-organized final project.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Your submission should demonstrate a solid understanding of design
          systems, color theory, spacing rules, and accessibility standards. The
          more polished and consistent your UI is, the higher your score will be.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <p className="font-semibold text-red-900">📌 Final Submission Checklist:</p>
          <ul className="list-disc ml-6 text-red-900">
            <li>High-fidelity screens created</li>
            <li>Prototype flow included</li>
            <li>Color palette + typography guide</li>
            <li>Accessibility contrast verified</li>
            <li>All screens exported correctly</li>
          </ul>
        </div>

        <div className="text-center">
          <a
            href="/dashboard/courses/ui-ux-design"
            className="inline-block bg-red-600 px-6 py-3 text-white font-semibold rounded-xl hover:bg-red-700 transition"
          >
            Review Course
          </a>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          Last Reminder: Dec 2025
        </p>
      </div>
    </div>
  );
}
