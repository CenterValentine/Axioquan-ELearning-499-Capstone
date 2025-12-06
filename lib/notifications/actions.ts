'use server';

import { createNotification } from "@/lib/db/queries/notifications";

/**
 * Notify when a new user registers
 */
export async function notifyUserRegistration(user: { id: string; email: string }) {
  return createNotification({
    user_id: user.id,
    title: "Welcome!",
    message: `Welcome to Axioquan, ${user.email}!`,
    type: "user-registration",
    action_url: "/dashboard",
  });
}

/**
 * Notify instructor when a student enrolls in a course
 */
export async function notifyCourseEnrollment(
  student: { user_id: string; name?: string; email?: string },
  course: { id: string; title: string },
  instructor_user_id: string
) {
  return createNotification({
    user_id: instructor_user_id,
    title: "New Enrollment",
    message: `${student.name || student.email} enrolled in your course: ${course.title}`,
    type: "course-enrollment",
    course_id: course.id,
    action_url: `/dashboard/instructor/students`,
  });
}

/**
 * Notify instructor when curriculum is added to a course
 */
export async function notifyCurriculumAdded(
  course: { id: string; title: string; slug: string },
  instructor_user_id: string
) {
  return createNotification({
    user_id: instructor_user_id,
    title: "Curriculum Updated",
    message: `Curriculum has been added or updated for ${course.title}`,
    type: "curriculum-update",
    course_id: course.id,
    action_url: `/courses/${course.slug}`,
  });
}

/**
 * Notify student when they complete a course
 */
export async function notifyCourseCompleted(
  student_user_id: string,
  course: { id: string; title: string }
) {
  return createNotification({
    user_id: student_user_id,
    title: "Course Completed 🎉",
    message: `You finished the course: ${course.title}`,
    type: "course-completed",
    course_id: course.id,
    action_url: `/dashboard/certificates`,
  });
}

/**
 * Notify student when they start a quiz
 */
export async function notifyQuizStarted(
  student_user_id: string,
  quiz: { id: string; title: string }
) {
  return createNotification({
    user_id: student_user_id,
    title: "Quiz Started",
    message: `You started the quiz: ${quiz.title}`,
    type: "quiz-start",
    action_url: `/courses/quiz/${quiz.id}`,
  });
}

/**
 * Notify student when they complete a quiz
 */
export async function notifyQuizCompleted(
  student_user_id: string,
  quiz: { id: string; title: string },
  score: number
) {
  return createNotification({
    user_id: student_user_id,
    title: "Quiz Completed",
    message: `You completed ${quiz.title} with a score of ${score}%`,
    type: "quiz-completed",
    action_url: `/courses/quiz/${quiz.id}/results`,
  });
}
