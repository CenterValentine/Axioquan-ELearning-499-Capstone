"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { TestResult } from "@/lib/code/types";
import { cn } from "@/lib/utils";

interface TestCasesPanelProps {
  testResults: TestResult[] | null;
  showHidden?: boolean;
  isLoading?: boolean;
}

export function TestCasesPanel({
  testResults,
  showHidden = false,
  isLoading = false,
}: TestCasesPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Running test cases...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!testResults || testResults.length === 0) {
    return null;
  }

  // Filter hidden test cases if not showing them
  const visibleResults = showHidden
    ? testResults
    : testResults.filter((r) => !r.testCase.hidden);

  if (visibleResults.length === 0) {
    return null;
  }

  const passedCount = visibleResults.filter((r) => r.passed).length;
  const totalCount = visibleResults.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Test Cases</span>
          <Badge variant="outline" className="ml-auto">
            {passedCount} / {totalCount} passed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleResults.map((testResult, index) => (
          <div
            key={index}
            className={cn(
              "rounded-lg border p-4 space-y-2",
              testResult.passed
                ? "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                : "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testResult.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <span className="font-semibold">
                  Test Case {index + 1}
                  {testResult.testCase.hidden && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Hidden
                    </Badge>
                  )}
                </span>
              </div>
              {testResult.executionTime && (
                <span className="text-xs text-muted-foreground">
                  {testResult.executionTime}ms
                </span>
              )}
            </div>

            {testResult.testCase.description && (
              <div className="text-sm text-muted-foreground">
                {testResult.testCase.description}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-semibold mb-1">Input:</div>
                <pre className="rounded bg-muted p-2 font-mono text-xs overflow-x-auto">
                  {testResult.testCase.input}
                </pre>
              </div>
              <div>
                <div className="font-semibold mb-1">Expected:</div>
                <pre className="rounded bg-muted p-2 font-mono text-xs overflow-x-auto">
                  {testResult.testCase.expectedOutput}
                </pre>
              </div>
            </div>

            {testResult.actualOutput !== undefined && (
              <div>
                <div className="font-semibold mb-1 text-sm">Actual Output:</div>
                <pre className="rounded bg-muted p-2 font-mono text-xs overflow-x-auto">
                  {testResult.actualOutput}
                </pre>
              </div>
            )}

            {testResult.error && (
              <div className="rounded bg-red-100 dark:bg-red-900 p-2">
                <div className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                  Error:
                </div>
                <pre className="text-xs text-red-700 dark:text-red-300 font-mono whitespace-pre-wrap">
                  {testResult.error}
                </pre>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

