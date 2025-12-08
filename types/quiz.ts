/**
 * Quiz Types
 * Defines the structure for quiz lesson data stored in the interactive_content field
 */

export interface QuizData {
  timeLimit: number; // in seconds
  passingScore: number; // percentage (0-100)
  questions: QuizQuestion[];
  allowRetake?: boolean;
  showResultsImmediately?: boolean;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  instructions?: string; // Additional quiz instructions
}

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay" | "code";
  question: string;
  description?: string;
  options?: string[]; // For multiple-choice and true/false
  correctAnswer?: string | string[] | number; // Index for multiple-choice, string for others
  explanation?: string; // Shown after quiz completion
  points: number;
  timeLimit?: number; // Optional per-question time limit in seconds
  order: number;
}

export interface QuizAttempt {
  id?: string;
  userId: string;
  lessonId: string;
  answers: UserAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeTaken: number; // in seconds
  submittedAt: Date | string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[] | number;
  timeSpent: number; // in seconds
}

export interface QuizSubmissionResult {
  success: boolean;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  attempt?: QuizAttempt;
  feedback?: string;
}
