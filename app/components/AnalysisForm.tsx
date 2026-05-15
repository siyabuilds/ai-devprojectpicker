"use client";

import { useState } from "react";
import { User, Briefcase, Search, Loader2, AlertCircle } from "lucide-react";

interface AnalysisFormProps {
  onAnalyze: (username: string, jobDescription: string) => void;
  loading: boolean;
  error: string | null;
}

export function AnalysisForm({ onAnalyze, loading, error }: AnalysisFormProps) {
  const [username, setUsername] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !jobDescription) return;
    onAnalyze(username, jobDescription);
  };

  return (
    <div className="p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium mb-2 text-zinc-600 dark:text-zinc-300">
            <User className="w-4 h-4" />
            GitHub Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all shadow-sm"
            placeholder="e.g. torvalds"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className="flex items-center gap-2 text-sm font-medium mb-2 text-zinc-600 dark:text-zinc-300">
            <Briefcase className="w-4 h-4" />
            Job Description
          </label>
          <textarea
            id="jobDescription"
            className="w-full h-48 resize-y bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all shadow-sm"
            placeholder="Paste the job requirements and description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !username || !jobDescription}
          className="w-full group relative flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 py-3.5 px-4 rounded-xl font-medium tracking-tight hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing repository...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Find Best Projects
            </>
          )}
        </button>
        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-4 rounded-xl text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
