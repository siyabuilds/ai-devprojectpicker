import { fetchRawReadme } from "./fetchRawReadme";

// fetchProfileReadme just calls fetchRawReadme so we dont have to change the logic
export function fetchProfileReadme(
    username: string,
    maxLength?: number,
) {
    return fetchRawReadme(username, username, maxLength);
}