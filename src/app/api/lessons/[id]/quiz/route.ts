// /app/api/lessons/[id]/quiz/route.ts

import { NextRequest } from 'next/server';
import { getLessonById } from '@/lib/db/queries/curriculum';
import { getSession } from '@/lib/auth/session';
import { getEnrollmentByUserAndCourse } from '@/lib/db/queries/enrollments';
import { QuizData } from '@/types/quiz';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const lesson = await getLessonById(id);

    if (!lesson) {
      return Response.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    if (lesson.lesson_type !== 'quiz') {
      return Response.json(
        { error: 'This lesson is not a quiz' },
        { status: 400 }
      );
    }

    // Verify user is enrolled in the course
    const enrollment = await getEnrollmentByUserAndCourse(session.userId, lesson.course_id);
    if (!enrollment) {
      return Response.json(
        { error: 'You must be enrolled in this course to take the quiz' },
        { status: 403 }
      );
    }

    // Parse quiz data from interactive_content
    let quizData: QuizData | null = null;
    if (lesson.interactive_content) {
      quizData = typeof lesson.interactive_content === 'string'
        ? JSON.parse(lesson.interactive_content)
        : lesson.interactive_content;
    }

    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
      return Response.json(
        { error: 'Quiz has no questions configured' },
        { status: 400 }
      );
    }

    // Return quiz data (without correct answers for security)
    const quizForStudent = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      course: lesson.course_id,
      totalQuestions: quizData.questions.length,
      timeLimit: quizData.timeLimit || 1800,
      passingScore: lesson.passing_score || 70,
      instructions: quizData.instructions,
      questions: quizData.questions.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        description: q.description,
        options: q.options,
        points: q.points,
        timeLimit: q.timeLimit,
        // Don't send correctAnswer to client
      })),
    };

    return Response.json({ quiz: quizForStudent });
  } catch (error: any) {
    console.error('❌ API Error fetching quiz:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

