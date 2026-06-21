import { fetchRawReadme } from "./fetchRawReadme";

// fetchRepoReadme just calls fetchRawReadme so we dont have to change the logic
export function fetchRepoReadme(
    username: string,
    repo: string,
    maxLength?: number,
) {
    return fetchRawReadme(username, repo, maxLength);
}