"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-[400px] flex flex-col items-center justify-center gap-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center text-zinc-500"
    >
      <Search className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
      <div>
        <h3 className="font-medium text-lg text-zinc-700 dark:text-zinc-300">No data yet</h3>
        <p className="text-zinc-400">Fill in the details on the left to analyze the match.</p>
      </div>
    </motion.div>
  );
}
