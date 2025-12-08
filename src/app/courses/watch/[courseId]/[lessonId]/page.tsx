// Redirect from old watch path to new path
import { redirect } from "next/navigation";

interface WatchVideoPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function WatchVideoPageRedirect({
  params,
}: WatchVideoPageProps) {
  const { courseId, lessonId } = await params;
  // Redirect to new path structure
  redirect(`/courses/learn/${courseId}/watch?lessonId=${lessonId}`);
}
