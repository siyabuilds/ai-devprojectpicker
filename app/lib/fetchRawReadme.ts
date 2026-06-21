import { githubFetch } from "./githubclient";
import { GitHubReadmeResponse } from "../types/github";

export async function fetchRawReadme(
    owner: string,
    repo: string,
    maxLength = 5000,
): Promise<string> {
    try {
        const data = await githubFetch<GitHubReadmeResponse>(
            `/repos/${owner}/${repo}/readme`,
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