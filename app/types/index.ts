export type ProjectResult = {
  name: string;
  url: string;
  matchScore: number;
  whyItMatters: string;
  cvBullets: string[];
  keyMetrics: string[];
};

export type AnalysisResult = {
  verdict: string;
  roleRelevancePercentage: number;
  summary: string;
  skillGroupings: { category: string; skills: string[] }[];
  projects: ProjectResult[];
};
