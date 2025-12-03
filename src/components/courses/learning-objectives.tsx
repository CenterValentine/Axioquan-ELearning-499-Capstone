import { CheckCircle2 } from "lucide-react";

export function LearningObjectives() {
  return (
    <div className="bg-gray-50 rounded-lg p-4 md:p-6 w-full">
      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">
        Learning Objectives
      </h3>
      <ul className="space-y-2 md:space-y-3 text-muted-foreground">
        <li className="flex items-center gap-3">
          <CheckCircle2
            size={18}
            className="text-green-500 flex-shrink-0"
          />
          Understand JSX syntax and its relationship with JavaScript
        </li>
        <li className="flex items-center gap-3">
          <CheckCircle2
            size={18}
            className="text-green-500 flex-shrink-0"
          />
          Create and use React components effectively
        </li>
        <li className="flex items-center gap-3">
          <CheckCircle2
            size={18}
            className="text-green-500 flex-shrink-0"
          />
          Pass data between components using props
        </li>
        <li className="flex items-center gap-3">
          <CheckCircle2
            size={18}
            className="text-green-500 flex-shrink-0"
          />
          Apply React best practices in real-world scenarios
        </li>
      </ul>
    </div>
  );
}

