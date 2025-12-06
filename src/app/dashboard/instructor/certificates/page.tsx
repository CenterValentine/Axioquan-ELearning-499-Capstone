// /app/dashboard/instructor/certificates/page.tsx

import { getSession } from "@/lib/auth/session";
import AppShellSidebar from "@/components/layout/AppSidebarNav";
import InstructorCertificatesPage from "@/components/dashboard/instructor-certificates-page";
import Unauthorized from "@/components/auth/unauthorized";

export default async function InstructorCertificates() {
  const session = await getSession();

  if (!session || !session.userId) {
    return <Unauthorized />;
  }

  const user = {
    id: session.userId,
    name: "Instructor User",
    email: "instructor@example.com",
    primaryRole: session.primaryRole || "instructor",
    image: undefined,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppShellSidebar user={user} />
      <main className="flex-1 overflow-auto">
        <InstructorCertificatesPage />
      </main>
    </div>
  );
}
