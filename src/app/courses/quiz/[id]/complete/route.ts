/*import { notifyQuizCompleted } from "@/lib/notifications/actions";
import { saveQuizResult, getQuizById } from "@/src/api/course/quiz";

export async function POST(req, { params }) {
  const userId = req.cookies.get("user_id")?.value;
  const quizId = params.id;

  const { score } = await req.json();
  const quiz = await getQuizById(quizId);

  await saveQuizResult(userId, quizId, score);

  await notifyQuizCompleted(userId, { title: quiz.title, id: quizId }, score);

  return Response.json({ success: true });
}*/
