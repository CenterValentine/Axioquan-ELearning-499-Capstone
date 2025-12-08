// src/app/dashboard/announcement/page.tsx
import React from "react";

export default function AnnouncementsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        📢 Platform Announcement
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 leading-relaxed">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          🚀 We Are Launching New Mobile App Features Next Week
        </h2>

        {/* Intro Paragraph */}
        <p className="text-gray-700 mb-4">
          We are excited to announce that our updated mobile app experience will be released next week.
          This new version includes a redesigned interface, faster performance, expanded profile management
          options, and improved notification controls. Our goal is to provide a more intuitive and efficient
          experience for all users. Stay tuned for the official rollout date and update instructions!
        </p>

        {/* Section Header */}
        <h3 className="text-xl font-bold mt-8 mb-4">
          🚀 What’s Coming in This Update?
        </h3>

        {/* 1. Real-Time Notifications */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-2">1. Real-Time Notifications</h4>
          <p className="text-gray-700 mb-2">Stay informed instantly. You will receive alerts for:</p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>New assignments</li>
            <li>Upcoming deadlines</li>
            <li>Instructor messages</li>
            <li>Course announcements</li>
            <li>Certificate availability</li>
          </ul>
          <p className="text-gray-700 mt-2">No more missing out on important updates!</p>
        </div>

        {/* 2. Offline Learning Mode */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-2">2. Offline Learning Mode</h4>
          <p className="text-gray-700 mb-2">
            Download course videos, PDFs, and notes so you can continue learning without Wi-Fi or data.
            Perfect for:
          </p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Traveling</li>
            <li>Low-connectivity areas</li>
            <li>Studying on the go</li>
          </ul>
        </div>

        {/* 3. Improved Chat System */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-2">3. Improved Chat & Messaging System</h4>
          <p className="text-gray-700 mb-2">We are upgrading the in-app chat to include:</p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Faster real-time messaging</li>
            <li>Read receipts</li>
            <li>File and image sharing</li>
            <li>Message reactions</li>
            <li>Organized conversation threads</li>
          </ul>
          <p className="text-gray-700 mt-2">
            This makes communication with instructors and classmates smoother and more intuitive.
          </p>
        </div>

        {/* 4. Personalized Dashboard */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-2">4. Personalized Dashboard</h4>
          <p className="text-gray-700">
            Your mobile dashboard will now adapt to your active courses, your progress, recent activities,
            and suggested next steps. It’s like having a smart learning assistant in your pocket!
          </p>
        </div>

        {/* 5. Redesigned UI */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-2">5. Redesigned UI for Better Accessibility</h4>
          <p className="text-gray-700 mb-2">We revamped the interface with:</p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Larger touch targets</li>
            <li>Better contrast</li>
            <li>Enhanced readability</li>
            <li>Faster navigation</li>
          </ul>
          <p className="text-gray-700 mt-2">
            This ensures a cleaner, more modern, and more accessible experience for everyone.
          </p>
        </div>

        {/* Release Timeline */}
        <h3 className="text-xl font-bold mt-8 mb-4">📅 Release Timeline</h3>
        <p className="text-gray-700">
          <span className="font-semibold">🔹 Scheduled Release:</span><br />
          Next Week — <span className="font-semibold">Wednesday at 10:00 AM EST</span>
        </p>
        <p className="text-gray-700 mt-2">
          During this time, the mobile app will remain fully usable. Some features may roll out gradually
          depending on your region.
        </p>

        {/* Thank You */}
        <h3 className="text-xl font-bold mt-8 mb-2">🙌 Thank You for Being With Us</h3>
        <p className="text-gray-700 mb-6">
          Your feedback continues to shape the platform in meaningful ways. These features were built
          because you asked for a more fluid, capable, and accessible learning experience. We're excited
          to share more improvements throughout the coming months.
        </p>

        {/* Footer */}
        <p className="text-right text-gray-400 text-sm italic">
          Posted: Dec 2025
        </p>

      </div>
    </div>
  );
}
