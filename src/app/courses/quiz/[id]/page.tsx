// /app/courses/quiz/[id]/page.tsx

import { getSession } from "@/lib/auth/session";
// import Sidebar from '@/components/dashboard/sidebar'
import QuizPage from "@/components/curriculum/quiz/quiz-page";
import Unauthorized from "@/components/auth/unauthorized";

interface QuizCoursePageProps {
  params: {
    id: string;
  };
}

export default async function QuizCoursePage({ params }: QuizCoursePageProps) {
  const session = await getSession();

  if (!session || !session.userId) {
    return <Unauthorized />;
  }

  const user = {
    id: session.userId,
    name: "Student User",
    email: "student@example.com",
    primaryRole: session.primaryRole || "student",
    image: undefined,
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* <Sidebar user={user} /> */}
      <QuizPage quizId={params.id} />
    </div>
  );
}
