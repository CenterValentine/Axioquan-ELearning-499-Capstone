
// /src/components/users/skills-display.tsx
'use client';

interface SkillsDisplayProps {
  skills: string[];
  onSkillClick?: (skill: string) => void;
}

export function SkillsDisplay({ skills, onSkillClick }: SkillsDisplayProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          onClick={() => onSkillClick?.(skill)}
          className={`px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200 ${
            onSkillClick ? 'cursor-pointer hover:bg-blue-200 transition-colors' : ''
          }`}
        >
          {skill.trim()}
        </span>
      ))}
    </div>
  );
}

// Add default export for compatibility
export default SkillsDisplay;