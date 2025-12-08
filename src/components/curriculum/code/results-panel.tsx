"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, Terminal } from "lucide-react";
import { CodeExecutionResult } from "@/lib/code/types";
import { cn } from "@/lib/utils";

interface ResultsPanelProps {
  result: CodeExecutionResult | null;
  isLoading?: boolean;
}

export function ResultsPanel({ result, isLoading = false }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Execution Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Executing code...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Execution Results
          {result.executionTime && (
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              {result.executionTime}ms
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.success ? (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Code executed successfully
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>Execution failed</AlertDescription>
          </Alert>
        )}

        {result.error && (
          <div className="rounded-md bg-red-50 dark:bg-red-950 p-4 border border-red-200 dark:border-red-800">
            <div className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
              Error:
            </div>
            <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono">
              {result.error}
            </pre>
          </div>
        )}

        {result.output && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">Output:</div>
            <pre className="rounded-md bg-muted p-4 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
              {result.output}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

