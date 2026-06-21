import { githubFetch } from "./githubclient";
import { GitHubReadmeResponse } from "../types/github";

export async function fetchRepoReadme(
    username: string,
    repo: string,
    maxLength = 3000,
): Promise<string> {
    try {
        const data = await githubFetch<GitHubReadmeResponse>(
            `/repos/${username}/${repo}/readme`,
        );

        if (!data || !data.content) {
            return "";
        }

        const readme = Buffer.from(data.content, "base64").toString("utf-8");

        return readme.length > maxLength
            ? readme.substring(0, maxLength) + "..."
            : readme;
    } catch {
        return "";
    }
}