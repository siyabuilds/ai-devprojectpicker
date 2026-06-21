import { EnrichedRepo, LightweightRepo } from "../types/github";
import { enrichRepo } from "./enrichRepo";

export async function enrichRepos(
    username: string,
    repos: LightweightRepo[],
): Promise<EnrichedRepo[]> {
    return Promise.all(
        repos.map((repo) => enrichRepo(username, repo)),
    );
}