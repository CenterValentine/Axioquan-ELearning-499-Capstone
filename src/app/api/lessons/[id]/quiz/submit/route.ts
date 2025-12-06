// /app/api/lessons/[id]/quiz/submit/route.ts

import { NextRequest } from "next/server";
import { getLessonById } from "@/lib/db/queries/curriculum";
import { getSession } from "@/lib/auth/session";
import { getEnrollmentByUserAndCourse } from "@/lib/db/queries/enrollments";
import {
  QuizData,
  QuizSubmissionResult,
  UserAnswer,
  QuizAttempt,
} from "@/types/quiz";
import { sql } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { answers, timeTaken } = body as {
      answers: UserAnswer[];
      timeTaken: number;
    };

    const lesson = await getLessonById(id);

    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.lesson_type !== "quiz") {
      return Response.json(
        { error: "This lesson is not a quiz" },
        { status: 400 }
      );
    }

    // Verify user is enrolled
    const enrollment = await getEnrollmentByUserAndCourse(
      session.userId,
      lesson.course_id
    );
    if (!enrollment) {
      return Response.json(
        { error: "You must be enrolled in this course to submit the quiz" },
        { status: 403 }
      );
    }

    // Parse quiz data
    let quizData: QuizData | null = null;
    if (lesson.interactive_content) {
      quizData =
        typeof lesson.interactive_content === "string"
          ? JSON.parse(lesson.interactive_content)
          : lesson.interactive_content;
    }

    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
      return Response.json(
        { error: "Quiz has no questions configured" },
        { status: 400 }
      );
    }

    // Calculate score
    let score = 0;
    let totalPoints = 0;

    quizData.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers.find((a) => a.questionId === question.id);

      if (userAnswer) {
        if (question.type === "essay" || question.type === "code") {
          // For essay and code, give partial credit (50% by default)
          // In a real system, these would be manually graded
          score += question.points * 0.5;
        } else if (question.type === "short-answer") {
          // Case-insensitive comparison for short answer
          const userAns = String(userAnswer.answer).trim().toLowerCase();
          const correctAns = String(question.correctAnswer || "")
            .trim()
            .toLowerCase();
          if (userAns === correctAns) {
            score += question.points;
          }
        } else {
          // Multiple choice or true/false
          // Convert both to numbers for comparison (answers are stored as indices)
          const userAns =
            typeof userAnswer.answer === "string"
              ? parseInt(userAnswer.answer, 10)
              : Number(userAnswer.answer);
          const correctAns =
            typeof question.correctAnswer === "string"
              ? parseInt(String(question.correctAnswer), 10)
              : Number(question.correctAnswer);

          // Debug logging (remove in production)
          console.log("Question:", question.id, {
            userAnswer: userAnswer.answer,
            userAns,
            correctAnswer: question.correctAnswer,
            correctAns,
            match: userAns === correctAns,
            types: {
              userType: typeof userAnswer.answer,
              correctType: typeof question.correctAnswer,
            },
          });

          if (userAns === correctAns && !isNaN(userAns) && !isNaN(correctAns)) {
            score += question.points;
          }
        }
      } else {
        // Debug: answer not found
        console.log(
          "No answer found for question:",
          question.id,
          "Available answers:",
          answers.map((a) => a.questionId)
        );
      }
    });

    const percentage = Math.round((score / totalPoints) * 100);
    const passingScore = lesson.passing_score || 70;
    const passed = percentage >= passingScore;

    // Store quiz attempt
    const attempt: QuizAttempt = {
      userId: session.userId,
      lessonId: lesson.id,
      answers,
      score: Math.round(score),
      totalPoints,
      percentage,
      passed,
      timeTaken: timeTaken || 0,
      submittedAt: new Date(),
    };

    // Save attempt to database (using a simple JSON storage approach)
    // In production, you might want a dedicated quiz_attempts table
    try {
      await sql`
        INSERT INTO quiz_attempts (
          user_id,
          lesson_id,
          answers,
          score,
          total_points,
          percentage,
          passed,
          time_taken,
          submitted_at
        ) VALUES (
          ${attempt.userId},
          ${attempt.lessonId},
          ${JSON.stringify(attempt.answers)}::jsonb,
          ${attempt.score},
          ${attempt.totalPoints},
          ${attempt.percentage},
          ${attempt.passed},
          ${attempt.timeTaken},
          ${attempt.submittedAt}
        )
      `;
    } catch (dbError: any) {
      // If quiz_attempts table doesn't exist, log but don't fail
      console.warn(
        "⚠️ Could not save quiz attempt to database:",
        dbError.message
      );
      // You might want to store attempts in enrollments.completed_lessons JSON instead
    }

    // Mark lesson as complete in user_progress (no progress percentage updates)
    try {
      const existing = await sql`
        SELECT id FROM user_progress
        WHERE user_id = ${session.userId}::uuid AND lesson_id = ${lesson.id}::uuid
        LIMIT 1
      `;

      if (existing.length > 0) {
        await sql`
          UPDATE user_progress
          SET is_completed = true, completed_at = COALESCE(completed_at, NOW())
          WHERE user_id = ${session.userId}::uuid AND lesson_id = ${lesson.id}::uuid
        `;
      } else {
        await sql`
          INSERT INTO user_progress (
            user_id, lesson_id, course_id, enrollment_id, is_completed, completed_at
          ) VALUES (
            ${session.userId}::uuid, ${lesson.id}::uuid, ${lesson.course_id}::uuid,
            ${enrollment.id}::uuid, true, NOW()
          )
        `;
      }
    } catch (error: any) {
      // Silently fail if table doesn't exist - don't break quiz submission
      console.warn("⚠️ Could not mark lesson complete:", error.message);
    }

    // Return results with correct answers and explanations
    const result: QuizSubmissionResult = {
      success: true,
      score: attempt.score,
      totalPoints: attempt.totalPoints,
      percentage: attempt.percentage,
      passed: attempt.passed,
      attempt,
      feedback: passed
        ? "Congratulations! You passed the quiz."
        : `You scored ${percentage}%. You need ${passingScore}% to pass.`,
    };

    // Include question results with correct answers for review
    const questionResults = quizData.questions.map((question) => {
      const userAnswer = answers.find((a) => a.questionId === question.id);
      let isCorrect = false;

      if (userAnswer) {
        if (question.type === "essay" || question.type === "code") {
          isCorrect = false; // Manual grading needed
        } else if (question.type === "short-answer") {
          const userAns = String(userAnswer.answer).trim().toLowerCase();
          const correctAns = String(question.correctAnswer || "")
            .trim()
            .toLowerCase();
          isCorrect = userAns === correctAns;
        } else {
          isCorrect = userAnswer.answer === question.correctAnswer;
        }
      }

      return {
        questionId: question.id,
        isCorrect,
        userAnswer: userAnswer?.answer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

    return Response.json({
      ...result,
      questionResults,
    });
  } catch (error: any) {
    console.error("❌ API Error submitting quiz:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
