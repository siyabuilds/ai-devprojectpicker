"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ThemeToggle } from "./components/ThemeToggle";
import { AnalysisForm } from "./components/AnalysisForm";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import { VerdictCard } from "./components/VerdictCard";
import { SummaryCard } from "./components/SummaryCard";
import { ProjectCard } from "./components/ProjectCard";
import { AnalysisResult } from "./types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (username: string, jobDescription: string) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, jobDescription }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze projects");
      }

      const data = await response.json();
      setResults({ 
        verdict: data.verdict || "", 
        roleRelevancePercentage: data.roleRelevancePercentage || 0, 
        summary: data.summary || "", 
        projects: data.projects 
      });
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center z-0">
        <div className="absolute -top-40 -z-10 h-[300px] w-[500px] rounded-full bg-blue-500/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
        <div className="absolute top-40 right-20 -z-10 h-[300px] w-[400px] rounded-full bg-purple-500/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 mx-auto max-w-6xl">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          <span className="font-display font-semibold tracking-tight">AI Project Picker</span>
        </div>
        <ThemeToggle />
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:py-20 lg:py-24">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            Optimize your CV instantly
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl text-balance">
            Automatically match your best GitHub projects against any job description to build a compelling narrative.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Form Column */}
          <div className="lg:col-span-5 h-fit sticky top-24">
            <AnalysisForm onAnalyze={handleAnalyze} loading={loading} error={error} />
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {!results && !loading ? (
                <EmptyState key="empty" />
              ) : loading ? (
                <LoadingState key="loading" />
              ) : results ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-8"
                >
                  <VerdictCard 
                    verdict={results.verdict} 
                    roleRelevancePercentage={results.roleRelevancePercentage} 
                  />

                  {results.summary && (
                    <SummaryCard summary={results.summary} />
                  )}

                  {results.projects?.length > 0 && (
                    <div className="flex flex-col gap-6">
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100 px-2 flex items-center gap-2">
                        <span className="flex w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 items-center justify-center text-xs font-semibold">{results.projects.length}</span>
                        Highlighted Projects
                      </h3>
                      
                      {results.projects.map((project, idx) => (
                        <ProjectCard key={idx} project={project} index={idx} />
                      ))}
                    </div>
                  )}

                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
