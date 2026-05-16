"use client";

import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[300px] lg:h-[400px] flex flex-col items-center justify-center gap-6 rounded-none p-6 lg:p-8"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-zinc-200 dark:border-zinc-800 rounded-full" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="absolute inset-0 border-4 border-zinc-900 border-t-transparent dark:border-zinc-100 dark:border-t-transparent rounded-full" 
        />
      </div>
      <p className="text-zinc-500 font-medium tracking-tight animate-pulse">Running AI pipeline...</p>
    </motion.div>
  );
}
