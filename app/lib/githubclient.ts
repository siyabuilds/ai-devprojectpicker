const githubApiKey = process.env.GITHUB_API_KEY;

if (!githubApiKey) {
  throw new Error("Missing GITHUB_API_KEY");
}

export async function githubFetch<T>(
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(
    `https://api.github.com${endpoint}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${githubApiKey}`,
        Accept: "application/vnd.github.v3+json",
        ...init?.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `GitHub request failed (${response.status}): ${endpoint}`
    );
  }

  return response.json();
}