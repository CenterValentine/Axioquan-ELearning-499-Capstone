// Only for debugging purposes.  Do not activate a debug panel in production.
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CourseData } from "@/types/lesson";

interface LessonDebugPanelProps {
  data: any; // Lesson data
  courseData?: CourseData; // Optional full course data
  title?: string;
}

export function LessonDebugPanel({
  data,
  courseData,
  title = "Debug Data",
}: LessonDebugPanelProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  // Combine lesson data and course data, updating reactively when either changes
  const combinedData = useMemo(() => {
    const result: any = {
      lesson: data,
    };

    if (courseData) {
      result.courseData = courseData;
    }

    return result;
  }, [data, courseData]);

  // Update debug data when combined data changes
  useEffect(() => {
    setDebugData(combinedData);
  }, [combinedData]);

  // Format data as JSON string for debugging
  const dataString = useMemo(() => {
    return JSON.stringify(debugData || combinedData, null, 2);
  }, [debugData, combinedData]);

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
          <p className="text-xs font-semibold text-gray-700 mb-2">{title}:</p>
          <pre className="text-xs font-mono text-gray-800 overflow-auto max-h-96 whitespace-pre-wrap break-words">
            {dataString}
          </pre>
        </div>
      )}
    </div>
  );
}
