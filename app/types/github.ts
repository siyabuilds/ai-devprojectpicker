// GitHubRepo represents a GitHub repository with relevant metadata.
export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;

  homepage: string | null;
  has_pages: boolean;

  language: string | null;
  topics: string[];

  stargazers_count: number;
  forks_count: number;

  updated_at: string;
  pushed_at: string;

  archived: boolean;
  fork: boolean;
  size: number;
}

// RepoLanguage represents a programming language used in a repository along with its usage percentage.
export interface RepoLanguage {
  name: string;
  percentage: number;
}

// LightweightRepo represents a simplified version of a GitHub repository with essential metadata.
export interface LightweightRepo {
  name: string;
  description: string | null;
  url: string;

  primaryLanguage: string | null;
  topics: string[];

  stars: number;
  forks: number;

  updatedAt: string;

  archived: boolean;
  isFork: boolean;
  size: number;
}

// EnrichedRepo represents a GitHub repository with enriched metadata, including language breakdown and activity metrics.
export interface EnrichedRepo {
  name: string;
  url: string;

  description: string | null;
  readme: string;

  topics: string[];

  languageBreakdown: RepoLanguage[];

  commitCount: number;
  contributorCount: number;
  releaseCount: number;

  updatedAt: string;
}