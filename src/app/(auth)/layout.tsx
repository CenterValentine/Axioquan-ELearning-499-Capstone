
// /src/app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: Add a small admin link in the corner */}
      <div className="absolute top-4 right-4">
        <a 
          href="/admin-signup" 
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Admin Access
        </a>
      </div>
      {children}
    </div>
  );
}
