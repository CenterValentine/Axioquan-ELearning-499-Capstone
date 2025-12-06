import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
        <p className="text-gray-600">
          Please <Link href="/login">log in</Link> to access this page.
        </p>
      </div>
    </div>
  );
}
