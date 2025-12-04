"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LessonDebugPanelProps {
  data: any;
  title?: string;
}

export function LessonDebugPanel({ 
  data, 
  title = "Debug Data" 
}: LessonDebugPanelProps) {
  const [showDebug, setShowDebug] = useState(false);

  // Format data as JSON string for debugging
  const dataString = JSON.stringify(data, null, 2);

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDebug(!showDebug)}
        className="w-full flex items-center justify-between mb-2"
      >
        <span className="text-xs font-mono">
          {showDebug ? "Hide" : "Show"} {title}
        </span>
        {showDebug ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      {showDebug && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            {title}:
          </p>
          <pre className="text-xs font-mono text-gray-800 overflow-auto max-h-96 whitespace-pre-wrap break-words">
            {dataString}
          </pre>
        </div>
      )}
    </div>
  );
}

