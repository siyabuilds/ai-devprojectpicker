import { GitHubRepo, LightweightRepo } from "../types/github";
import { githubFetch } from "./githubclient";

export async function fetchRepos(
  username: string
): Promise<LightweightRepo[]> {
  const repos = await githubFetch<GitHubRepo[]>(
    `/users/${username}/repos?sort=updated&per_page=30`
  );

  return repos.map((repo) => ({
  name: repo.name,
  description: repo.description,
  url: repo.html_url,

  primaryLanguage: repo.language,
  topics: repo.topics,

  stars: repo.stargazers_count,
  forks: repo.forks_count,

  updatedAt: repo.pushed_at,

  archived: repo.archived,
  isFork: repo.fork,
  size: repo.size,
}));
}