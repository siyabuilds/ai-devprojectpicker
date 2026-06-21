// Verdict options for the recommendation system
export type Verdict =
  | "Strong Fit for This Role"
  | "Decent, but needs improvement"
  | "Weak match — likely to struggle getting interviews";

// RankedRepo represents a GitHub repository with a relevance score and reasoning for its recommendation.
export interface RankedRepo {
  name: string;

  relevanceScore: number;

  reasoning: string;
}

// SkillGroup represents a category of skills along with the associated skills in that category.
export interface SkillGroup {
  category: string;

  skills: string[];
}

// ProjectRecommendation represents a recommended project with its relevance score, reasoning, and associated skills.
export interface ProjectRecommendation {
  name: string;

  url: string;

  matchScore: number;

  whyItMatters: string;

  cvBullets: string[];

  keySkills: string[];
}

// Recommendation represents the overall recommendation for a candidate, including verdict, role relevance, summary, skill groupings, and recommended projects.
export interface Recommendation {
  verdict: Verdict;

  roleRelevancePercentage: number;

  summary: string;

  skillGroupings: SkillGroup[];

  projects: ProjectRecommendation[];
}

// RepoRankingResult represents the result of ranking GitHub repositories based on their relevance to a specific role or criteria.
export interface RepoRankingResult {
  repositories: RankedRepo[];
}

// RecommendationResult represents the result of generating a recommendation for a candidate, including the overall recommendation and the ranked repositories.
export interface RecommendationResult {
  recommendation: Recommendation;
}