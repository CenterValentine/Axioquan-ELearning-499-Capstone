"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText } from "lucide-react";

interface InstructionsPanelProps {
  instructions: string;
  title?: string;
}

export function InstructionsPanel({
  instructions,
  title = "Instructions",
}: InstructionsPanelProps) {
  if (!instructions) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {instructions}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}

