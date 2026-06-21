import { EnrichedRepo, LightweightRepo } from "../types/github";
import { fetchRepoCommits } from "./fetchRepoCommits";
import { fetchRepoContributors } from "./fetchRepoContributors";
import { fetchRepoLanguages } from "./fetchRepoLanguages";
import { fetchRepoReadme } from "./fetchRepoReadme";

export async function enrichRepo(
    username: string,
    repo: LightweightRepo,
): Promise<EnrichedRepo> {
    const [
        readme,
        languageBreakdown,
        commitCount,
        contributorCount,
    ] = await Promise.all([
        fetchRepoReadme(username, repo.name),
        fetchRepoLanguages(username, repo.name),
        fetchRepoCommits(username, repo.name),
        fetchRepoContributors(username, repo.name),
    ]);

    return {
        name: repo.name,
        url: repo.url,

        description: repo.description,
        topics: repo.topics,

        updatedAt: repo.updatedAt,

        readme,
        languageBreakdown,

        commitCount,
        contributorCount,

        releaseCount: 0,
    };
}