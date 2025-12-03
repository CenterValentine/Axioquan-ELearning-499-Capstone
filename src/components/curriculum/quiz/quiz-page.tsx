// /components/courses/quiz-page.tsx

'use client'

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, Clock, CheckCircle2, AlertCircle, BarChart3, Home, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay" | "code"
  question: string
  description?: string
  options?: string[]
  correctAnswer?: string | string[] | number
  explanation?: string
  points: number
  timeLimit?: number
}

interface Quiz {
  id: string
  title: string
  description: string
  course: string
  totalQuestions: number
  timeLimit: number
  passingScore: number
  questions: Question[]
}

interface UserAnswer {
  questionId: string
  answer: string | string[] | number
  timeSpent: number
}

interface QuizPageProps {
  quizId: string
}

export default function QuizPage({ quizId }: QuizPageProps) {
  const router = useRouter()

  const [stage, setStage] = useState<"intro" | "quiz" | "results">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | number>("")
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [showTimer, setShowTimer] = useState(true)
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null)

  // Mock quiz data
  const quiz: Quiz = {
    id: quizId,
    title: "React Fundamentals Quiz",
    description: "Test your knowledge of React basics",
    course: "Advanced React Masterclass",
    totalQuestions: 5,
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        id: "1",
        type: "multiple-choice",
        question: "What is JSX?",
        description: "Select the correct definition",
        options: [
          "JavaScript XML syntax extension for React",
          "A new JavaScript framework",
          "A CSS preprocessor",
          "A database query language",
        ],
        correctAnswer: 0,
        explanation: "JSX is a syntax extension to JavaScript that allows you to write HTML-like code in JavaScript.",
        points: 10,
      },
      {
        id: "2",
        type: "true-false",
        question: "In React, you can directly modify component state?",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Never modify state directly. Always use setState or hook functions to update state.",
        points: 10,
      },
      {
        id: "3",
        type: "short-answer",
        question: "What hook is used for side effects in React functional components?",
        correctAnswer: "useEffect",
        explanation: "The useEffect hook is used to perform side effects in function components.",
        points: 15,
      },
      {
        id: "4",
        type: "essay",
        question: "Explain the concept of lifting state up in React and provide a practical example.",
        description: "Write a detailed explanation (minimum 100 words)",
        points: 20,
      },
      {
        id: "5",
        type: "code",
        question: "Complete the useState hook to manage a counter",
        description: "Fill in the missing code",
        correctAnswer: "const [count, setCount] = useState(0)",
        points: 15,
      },
    ],
  }

  useEffect(() => {
    if (stage === "quiz" && quizStartTime !== null) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setStage("results")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [stage, quizStartTime])

  const startQuiz = () => {
    setStage("quiz")
    setQuizStartTime(Date.now())
  }

  const handleAnswer = (answer: string | string[] | number) => {
    setCurrentAnswer(answer)
  }

  const submitAnswer = () => {
    const newAnswers = [...userAnswers]
    const existingIndex = newAnswers.findIndex((a) => a.questionId === quiz.questions[currentQuestion].id)

    if (existingIndex >= 0) {
      newAnswers[existingIndex].answer = currentAnswer
    } else {
      newAnswers.push({
        questionId: quiz.questions[currentQuestion].id,
        answer: currentAnswer,
        timeSpent: 0,
      })
    }

    setUserAnswers(newAnswers)

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer("")
    } else {
      setStage("results")
    }
  }

  const calculateScore = () => {
    let score = 0
    let totalPoints = 0

    quiz.questions.forEach((question) => {
      totalPoints += question.points
      const userAnswer = userAnswers.find((a) => a.questionId === question.id)
      if (userAnswer) {
        if (question.type === "essay" || question.type === "code") {
          score += question.points * 0.5 // default 50% for demonstration
        } else if (userAnswer.answer === question.correctAnswer) {
          score += question.points
        }
      }
    })

    return { score: Math.round(score), totalPoints, percentage: Math.round((score / totalPoints) * 100) }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const question = quiz.questions[currentQuestion]
  const { score, totalPoints, percentage } = calculateScore()
  const passed = percentage >= quiz.passingScore

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header with Logo and Navigation */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation Icons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700 hover:text-gray-900"
                title="Go to Dashboard"
              >
                <Home size={20} />
                <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => router.push(`/courses/learn/1`)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition text-red-600 hover:text-red-700"
                title="Quit Quiz"
              >
                <X size={20} />
                <span className="hidden sm:inline text-sm font-medium">Quit Quiz</span>
              </button>
            </div>

            {/* Center - AxioQuan Logo and Brand */}
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              {/* Brand Name */}
              <span className="text-xl font-bold text-gray-900 hidden sm:block">AxioQuan</span>
            </div>

            {/* Right side - Spacer for balance */}
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* --- Intro Stage --- */}
        {stage === "intro" && (
          <div className="space-y-8">
            {/* --- Redesigned Quiz Banner --- */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 shadow-lg text-white overflow-hidden">
              {/* Decorative floating circles */}
              <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-white opacity-10 rounded-full"></div>
              <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white opacity-10 rounded-full"></div>

              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                {quiz.title}
              </h1>
              <p className="text-lg md:text-xl opacity-90 drop-shadow-sm">
                {quiz.description}
              </p>

              {/* Optional: subtle underline */}
              <div className="mt-6 w-24 h-1 bg-white rounded-full opacity-70"></div>
            </div>

            {/* Stats cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Total Questions</p>
                <p className="text-3xl font-bold text-primary">{quiz.totalQuestions}</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Time Limit</p>
                <p className="text-3xl font-bold text-primary">{quiz.timeLimit / 60} min</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Passing Score</p>
                <p className="text-3xl font-bold text-primary">{quiz.passingScore}%</p>
              </div>
            </div>

            {/* Instructions and Start Button remain unchanged */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Quiz Instructions</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Answer all {quiz.totalQuestions} questions carefully</li>
                <li>• You have {formatTime(quiz.timeLimit)} to complete the quiz</li>
                <li>• You need to score at least {quiz.passingScore}% to pass</li>
                <li>• Review your answers before submitting</li>
              </ul>
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:opacity-90 transition text-lg"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* --- Quiz Stage --- */}
        {stage === "quiz" && (
          <div className="space-y-8">
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {quiz.totalQuestions}
                </p>
                <div className="mt-2 bg-muted rounded-full h-2 w-48">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${((currentQuestion + 1) / quiz.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
              {showTimer && (
                <div
                  className={`flex items-center gap-2 font-mono text-2xl font-bold ${
                    timeRemaining < 300 ? "text-destructive" : "text-primary"
                  }`}
                >
                  <Clock size={24} />
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>

            {/* Question */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{question.question}</h2>
                {question.description && <p className="text-muted-foreground">{question.description}</p>}
                <p className="text-sm text-primary font-semibold mt-4">{question.points} points</p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {(question.type === "multiple-choice" || question.type === "true-false") ? (
                  <div className="space-y-3">
                    {question.options?.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:border-primary"
                        style={{
                          borderColor: currentAnswer === index ? "var(--primary)" : "var(--border)",
                          backgroundColor: currentAnswer === index ? "rgba(var(--primary), 0.05)" : "transparent",
                        }}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={index}
                          checked={currentAnswer === index}
                          onChange={() => handleAnswer(index)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className="ml-4 font-medium text-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : question.type === "short-answer" || question.type === "code" ? (
                  <input
                    type="text"
                    value={currentAnswer as string}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full p-4 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <textarea
                    value={currentAnswer as string}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Write your answer here..."
                    rows={8}
                    className="w-full p-4 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 justify-between pt-6 border-t border-border">
              <button
                onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <button
                onClick={submitAnswer}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
              >
                {currentQuestion === quiz.questions.length - 1 ? "Submit Quiz" : "Next"}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* --- Results Stage --- */}
        {stage === "results" && (
          <div className="space-y-8">
            {/* Results Header */}
            <div
              className={`rounded-2xl p-8 text-white space-y-4 ${
                passed ? "bg-gradient-to-br from-green-600 to-green-400" : "bg-gradient-to-br from-red-600 to-red-400"
              }`}
            >
              <div className="flex items-center gap-3">
                {passed ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
                <div>
                  <h1 className="text-3xl font-bold">{passed ? "Congratulations!" : "Quiz Complete"}</h1>
                  <p className="opacity-90">
                    {passed ? "You passed the quiz!" : "Review the material and try again"}
                  </p>
                </div>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-card rounded-xl border border-border p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Your Score</p>
                <div className="text-6xl font-bold text-primary">{percentage}%</div>
                <p className="text-lg text-muted-foreground">
                  {score} out of {totalPoints} points
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Questions Answered</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userAnswers.length}/{quiz.totalQuestions}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Passing Score</p>
                  <p className="text-2xl font-bold text-foreground">{quiz.passingScore}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Result</p>
                  <p className={`text-2xl font-bold ${passed ? "text-green-600" : "text-destructive"}`}>
                    {passed ? "PASSED" : "FAILED"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}