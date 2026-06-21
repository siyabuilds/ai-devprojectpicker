import { githubFetch } from "./githubclient";

export async function fetchRepoContributors(
    username: string,
    repo: string,
): Promise<number> {
    try {
        const contributors = await githubFetch<unknown[]>(
            `/repos/${username}/${repo}/contributors?per_page=100`,
        );

        return contributors.length;
    } catch {
        return 0;
    }
}