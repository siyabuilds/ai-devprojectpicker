import { LightweightRepo } from "../types/github";

export function filterRepos(
  repos: LightweightRepo[]
): LightweightRepo[] {
  const twoYearsAgo = new Date();

  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  return repos.filter((repo) => {
    if (repo.archived) {
      return false;
    }

    if (repo.isFork) {
      return false;
    }

    if (repo.size < 10) {
      return false;
    }

    if (new Date(repo.updatedAt) < twoYearsAgo) {
      return false;
    }

    return true;
  });
}