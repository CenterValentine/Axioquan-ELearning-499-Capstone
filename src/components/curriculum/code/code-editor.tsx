"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface CodeEditorProps {
  language: string;
  starterCode?: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({
  language,
  starterCode = "",
  value,
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  const [editorValue, setEditorValue] = useState(value || starterCode);

  useEffect(() => {
    if (value !== undefined) {
      setEditorValue(value);
    } else if (starterCode) {
      setEditorValue(starterCode);
    }
  }, [value, starterCode]);

  const handleEditorChange = (newValue: string | undefined) => {
    const code = newValue || "";
    setEditorValue(code);
    onChange(code);
  };

  const handleReset = () => {
    setEditorValue(starterCode);
    onChange(starterCode);
  };

  // Map language to Monaco language ID
  const getMonacoLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "csharp",
      go: "go",
      rust: "rust",
      php: "php",
      ruby: "ruby",
      swift: "swift",
      kotlin: "kotlin",
      html: "html",
      css: "css",
      json: "json",
      sql: "sql",
    };
    return langMap[lang.toLowerCase()] || "plaintext";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Code Editor
            <span className="text-sm font-normal text-muted-foreground">
              ({language})
            </span>
          </CardTitle>
          {starterCode && !readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t">
          <Editor
            height="400px"
            language={getMonacoLanguage(language)}
            value={editorValue}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              readOnly,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

