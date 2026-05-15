"use client";

import { Check } from "lucide-react";
import { ProjectResult } from "../types";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: ProjectResult;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <a href={project.url} target="_blank" rel="noreferrer" className="font-display font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
          {project.name}
          <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold text-sm rounded-full border border-green-200 dark:border-green-500/20">
          {project.matchScore}% Match
        </span>
      </div>
      
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        {project.whyItMatters}
      </p>

      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">CV Bullets</h4>
        <ul className="flex flex-col gap-2">
          {project.cvBullets.map((bullet, i) => (
            <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <Check className="w-4 h-4 shrink-0 text-zinc-400 mt-1" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Matched Skills</h4>
        <div className="flex flex-wrap gap-2">
          {project.keyMetrics.map((metric, i) => (
            <span key={i} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700">
              {metric}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
