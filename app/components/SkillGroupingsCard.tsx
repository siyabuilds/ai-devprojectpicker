"use client";

interface SkillGroupingsCardProps {
  skillGroupings: { category: string; skills: string[] }[];
}

export function SkillGroupingsCard({ skillGroupings }: SkillGroupingsCardProps) {
  if (!skillGroupings || skillGroupings.length === 0) return null;

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-none p-6 md:p-8 border border-white/20 dark:border-zinc-700/50 shadow-lg">
      <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
        Demonstrated Skills (Matched to Role)
      </h3>
      <div className="flex flex-col gap-4">
        {skillGroupings.map((group, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 min-w-[100px]">
              {group.category}:
            </span>
            <div className="flex-1 text-zinc-700 dark:text-zinc-300">
              {group.skills.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}