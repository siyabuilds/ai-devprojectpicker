"use client";

import { Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";

interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleDocumentCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString();
      if (!selection) return;
      e.preventDefault();
      e.clipboardData?.setData("text/plain", selection);
    };

    document.addEventListener("copy", handleDocumentCopy);
    return () => {
      document.removeEventListener("copy", handleDocumentCopy);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="group relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-none p-6 md:p-8 border border-white/20 dark:border-zinc-700/50 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          Professional Summary
        </h3>
        <button 
          onClick={handleCopy}
          className="p-2 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/20 dark:border-zinc-700/50 rounded-none hover:bg-white/70 dark:hover:bg-zinc-700/50 transition-all active:scale-95 shadow-sm text-zinc-600 dark:text-zinc-300"
          title="Copy summary"
        >
          {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
