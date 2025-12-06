// /app/dashboard/progress/page.tsx

import { getSession } from "@/lib/auth/session";
import AppShellSidebar from "@/components/layout/AppSidebarNav";
import ProgressPage from "@/components/dashboard/progress-page";
import Unauthorized from "@/components/auth/unauthorized";

export default async function Progress() {
  const session = await getSession();

  if (!session || !session.userId) {
    return <Unauthorized />;
  }

  // Create user object with placeholder data
  const user = {
    id: session.userId,
    name: "Student User",
    email: "student@example.com",
    primaryRole: session.primaryRole || "student",
    image: undefined,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppShellSidebar user={user} />
      <main className="flex-1 overflow-auto">
        <ProgressPage />
      </main>
    </div>
  );
}
