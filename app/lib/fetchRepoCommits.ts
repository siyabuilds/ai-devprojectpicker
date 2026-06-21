import { githubFetch } from "./githubclient";

export async function fetchRepoCommits(
    username: string,
    repo: string,
): Promise<number> {
    try {
        const commits = await githubFetch<unknown[]>(
            `/repos/${username}/${repo}/commits?per_page=100`,
        );

        return commits.length;
    } catch {
        return 0;
    }
}