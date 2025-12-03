import { CheckCircle2 } from "lucide-react";

interface MarkCompleteButtonProps {
  isCompleted: boolean;
  onComplete: () => void;
}

export function MarkCompleteButton({
  isCompleted,
  onComplete,
}: MarkCompleteButtonProps) {
  return (
    <button
      onClick={onComplete}
      disabled={isCompleted}
      className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap w-full md:w-auto flex items-center gap-2 justify-center ${
        isCompleted
          ? "bg-green-100 text-green-800 cursor-not-allowed"
          : "bg-black text-white hover:opacity-90"
      }`}
    >
      {isCompleted ? (
        <>
          <CheckCircle2 size={20} className="text-green-600" />
          <span>Completed</span>
        </>
      ) : (
        "Mark Complete"
      )}
    </button>
  );
}

