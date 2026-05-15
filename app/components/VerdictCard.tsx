"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface VerdictCardProps {
  verdict: string;
  roleRelevancePercentage?: number;
}

export function VerdictCard({ verdict, roleRelevancePercentage }: VerdictCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900/40 backdrop-blur rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {verdict.includes("Strong") && <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full"><CheckCircle2 className="w-6 h-6" /></div>}
        {verdict.includes("Decent") && <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full"><AlertTriangle className="w-6 h-6" /></div>}
        {verdict.includes("Weak") && <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full"><XCircle className="w-6 h-6" /></div>}
        <h2 className="font-display text-xl font-semibold tracking-tight">{verdict}</h2>
      </div>
      {roleRelevancePercentage !== undefined && (
        <div className="flex flex-col items-end">
          <span className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{roleRelevancePercentage}%</span>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Match Score</span>
        </div>
      )}
    </div>
  );
}
