"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Send, Loader2, CheckCircle2 } from "lucide-react";
import { CourseData } from "@/types/lesson";
import { CodeEnvironment, CodeExecutionResult, TestResult, CodeSubmissionResult } from "@/lib/code/types";
import { mockExecuteCode, mockSubmitCode } from "@/lib/code/mock-runner";
import { InstructionsPanel } from "./instructions-panel";
import { CodeEditor } from "./code-editor";
import { ResultsPanel } from "./results-panel";
import { TestCasesPanel } from "./test-cases-panel";
import { LessonDebugPanel } from "../debug/lesson-debug-panel";

interface CodeLessonPlayerProps {
  courseData: CourseData;
  currentModule: number;
  currentLesson: number;
}

export function CodeLessonPlayer({
  courseData,
  currentModule,
  currentLesson,
}: CodeLessonPlayerProps) {
  const lesson = courseData.modules[currentModule].lessons[currentLesson];
  
  // Parse code environment from lesson
  const codeEnv: CodeEnvironment | null = lesson.code_environment
    ? (typeof lesson.code_environment === 'string'
        ? JSON.parse(lesson.code_environment)
        : lesson.code_environment)
    : null;

  // State management
  const [code, setCode] = useState<string>(codeEnv?.starterCode || "");
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [submissionResult, setSubmissionResult] = useState<CodeSubmissionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Initialize code from starter code
  useEffect(() => {
    if (codeEnv?.starterCode && !code) {
      setCode(codeEnv.starterCode);
    }
  }, [codeEnv?.starterCode, code]);

  // Handle code execution
  const handleRun = async () => {
    if (!codeEnv || !codeEnv.allowRun) return;

    setIsExecuting(true);
    setExecutionResult(null);
    setTestResults(null);
    setSubmissionResult(null);

    try {
      const result = await mockExecuteCode(code, codeEnv.language);
      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({
        success: false,
        output: "",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle code submission
  const handleSubmit = async () => {
    if (!codeEnv || !codeEnv.allowSubmit) return;

    setIsSubmitting(true);
    setExecutionResult(null);
    setTestResults(null);
    setSubmissionResult(null);

    try {
      const result = await mockSubmitCode(
        code,
        codeEnv.testCases || [],
        codeEnv.language
      );
      
      setSubmissionResult(result);
      setTestResults(result.testResults);
      setHasSubmitted(true);
    } catch (error) {
      setSubmissionResult({
        success: false,
        score: 0,
        totalTests: codeEnv.testCases?.length || 0,
        passedTests: 0,
        testResults: [],
        feedback: error instanceof Error ? error.message : "Submission failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show placeholder if no code environment
  if (!codeEnv) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>
              This code lesson has not been configured yet. Please add code environment settings.
            </AlertDescription>
          </Alert>
          <LessonDebugPanel
            data={lesson}
            courseData={courseData}
            title="Lesson Data"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      {codeEnv.instructions && (
        <InstructionsPanel instructions={codeEnv.instructions} />
      )}

      {/* Code Editor */}
      <CodeEditor
        language={codeEnv.language}
        starterCode={codeEnv.starterCode}
        value={code}
        onChange={setCode}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        {codeEnv.allowRun && (
          <Button
            onClick={handleRun}
            disabled={isExecuting || isSubmitting || !code.trim()}
            className="gap-2"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Code
              </>
            )}
          </Button>
        )}

        {codeEnv.allowSubmit && (
          <Button
            onClick={handleSubmit}
            disabled={isExecuting || isSubmitting || !code.trim()}
            variant={hasSubmitted ? "outline" : "default"}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : hasSubmitted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Submitted
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit for Grading
              </>
            )}
          </Button>
        )}
      </div>

      {/* Submission Feedback */}
      {submissionResult && (
        <Alert
          className={
            submissionResult.score === 100
              ? "border-green-200 bg-green-50 dark:bg-green-950"
              : submissionResult.score >= 70
              ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
              : "border-red-200 bg-red-50 dark:bg-red-950"
          }
        >
          <CheckCircle2
            className={`h-4 w-4 ${
              submissionResult.score === 100
                ? "text-green-600 dark:text-green-400"
                : submissionResult.score >= 70
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-red-600 dark:text-red-400"
            }`}
          />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-semibold">
                Score: {submissionResult.score}% ({submissionResult.passedTests}/
                {submissionResult.totalTests} tests passed)
              </div>
              {submissionResult.feedback && (
                <div className="text-sm">{submissionResult.feedback}</div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Execution Results */}
      {executionResult && (
        <ResultsPanel result={executionResult} isLoading={isExecuting} />
      )}

      {/* Test Cases */}
      {testResults && (
        <TestCasesPanel
          testResults={testResults}
          showHidden={hasSubmitted}
          isLoading={isSubmitting}
        />
      )}

      {/* Debug Panel (development only) */}
      <LessonDebugPanel
        data={lesson}
        courseData={courseData}
        title="Lesson Data from Database"
      />
    </div>
  );
}
