import { RepoLanguage } from "../types/github";
import { githubFetch } from "./githubclient";

export async function fetchRepoLanguages(
    username: string,
    repo: string,
): Promise<RepoLanguage[]> {
    try {
        const languages = await githubFetch<Record<string, number>>(
            `/repos/${username}/${repo}/languages`,
        );

        const totalBytes = Object.values(languages).reduce(
            (sum, bytes) => sum + bytes,
            0,
        );

        if (!totalBytes) {
            return [];
        }

        return Object.entries(languages).map(([name, bytes]) => ({
            name,
            percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
        }));
    } catch {
        return [];
    }
}