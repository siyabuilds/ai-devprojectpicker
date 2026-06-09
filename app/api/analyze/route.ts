import { NextResponse } from "next/server";
import OpenAI from "openai";

interface GitHubRepo {
  name: string;
  homepage?: string | null;
  has_pages?: boolean;
  description?: string | null;
  language?: string | null;
  html_url: string;
  topics?: string[];
  updated_at?: string;
  pushed_at?: string;
  stargazers_count?: number;
  forks_count?: number;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  try {
    const { username, jobDescription } = await req.json();

    if (!username || !jobDescription) {
      return NextResponse.json(
        { error: "Username and job description are required" },
        { status: 400 }
      );
    }

    const githubApiKey = process.env.GITHUB_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!githubApiKey || !openaiApiKey) {
      return NextResponse.json(
        { error: "Server missing API keys. Please check .env configuration." },
        { status: 500 }
      );
    }

    // 1. Fetch repositories from GitHub
    const githubRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${githubApiKey}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!githubRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repositories from GitHub. Check username or API key." },
        { status: githubRes.status }
      );
    }

    const allRepos = await githubRes.json();

    if (!allRepos || allRepos.length === 0) {
      return NextResponse.json({ projects: [], summary: "" });
    }

    // 2. Score repositories based on quality signals
    const scoredRepos = await Promise.all(
      allRepos.map(async (repo: GitHubRepo) => {
        let readmeContent = "";
        let hasReadme = false;
        try {
          const readmeRes = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/readme`,
            {
              headers: {
                Authorization: `Bearer ${githubApiKey}`,
                Accept: "application/vnd.github.v3.raw",
              },
            }
          );
          if (readmeRes.ok) {
            readmeContent = await readmeRes.text();
            hasReadme = readmeContent.trim().length > 0;
            // Limit to lower AI API costs
            if (readmeContent.length > 1000) {
              readmeContent = readmeContent.substring(0, 1000) + "...";
            }
          }
        } catch {
          console.error("Failed to fetch README for repo", repo.name);
        }

        let moreThan20Commits = false;
        try {
          const commitRes = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=21`,
            {
              headers: {
                Authorization: `Bearer ${githubApiKey}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          if (commitRes.ok) {
            const commits = await commitRes.json();
            moreThan20Commits = Array.isArray(commits) && commits.length >= 21;
          }
        } catch {
          console.error("Failed to fetch commits for repo", repo.name);
        }

        let multipleContributors = false;
        try {
          const contributorRes = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/contributors?per_page=2`,
            {
              headers: {
                Authorization: `Bearer ${githubApiKey}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          if (contributorRes.ok) {
            const contributors = await contributorRes.json();
            multipleContributors = Array.isArray(contributors) && contributors.length >= 2;
          }
        } catch {
          console.error("Failed to fetch contributors for repo", repo.name);
        }

        // Check update date within 90 days
        let updatedWithin90Days = false;
        const updatedAtStr = repo.updated_at || repo.pushed_at;
        if (typeof updatedAtStr === "string") {
          const updatedAt = new Date(updatedAtStr);
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          updatedWithin90Days = updatedAt >= ninetyDaysAgo;
        }

        const hasDescription = repo.description && typeof repo.description === "string" && repo.description.trim() !== "";
        const hasTopics = repo.topics && Array.isArray(repo.topics) && repo.topics.length > 0;
        const hasHomepage = repo.homepage && typeof repo.homepage === "string" && repo.homepage.trim() !== "";
        const hasGithubPages = repo.has_pages === true;
        const stars = typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0;
        const forks = typeof repo.forks_count === "number" ? repo.forks_count : 0;

        // Scoring rules:
        // README exists: +10
        // Description exists: +5
        // Has Topics: +10
        // Has Homepage: +15
        // Has GitHub Pages: +15
        // Updated within 90 days: +15
        // >20 commits: +15
        // Multiple contributors: +10
        // Stars: +5
        // Forks: +5
        const score = 
          (hasReadme ? 10 : 0) +
          (hasDescription ? 5 : 0) +
          (hasTopics ? 10 : 0) +
          (hasHomepage ? 15 : 0) +
          (hasGithubPages ? 15 : 0) +
          (updatedWithin90Days ? 15 : 0) +
          (moreThan20Commits ? 15 : 0) +
          (multipleContributors ? 10 : 0) +
          (stars > 0 ? 5 : 0) +
          (forks > 0 ? 5 : 0);

        return {
          repo,
          score,
          readmeContent,
          hasReadme,
          hasDescription
        };
      })
    );

    // Filter by score >= 25 and sort by score descending
    const validScoredRepos = scoredRepos
      .filter((item) => item.score >= 25)
      .sort((a, b) => b.score - a.score);

    if (validScoredRepos.length === 0) {
      return NextResponse.json({ projects: [], summary: "" });
    }

    // 3. Fetch languages for the valid repositories only and build repoSummaries
    const repoSummariesRaw = await Promise.all(
      validScoredRepos.map(async ({ repo, readmeContent, hasReadme }) => {
        let languagesStr = "";
        try {
          const langRes = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/languages`,
            {
              headers: {
                Authorization: `Bearer ${githubApiKey}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          if (langRes.ok) {
            const languages = await langRes.json();
            const totalBytes = Object.values(languages).reduce((sum: number, val: unknown) => sum + (val as number), 0) as number;
            
            if (totalBytes > 0) {
              const langPercentages = Object.entries(languages).map(([lang, bytes]) => {
                const percentage = (((bytes as number) / totalBytes) * 100).toFixed(1);
                return `${lang}: ${percentage}%`;
              });
              languagesStr = langPercentages.join(", ");
            }
          }
        } catch {
          console.error("Failed to fetch languages for repo", repo.name);
        }

        return {
          name: repo.name,
          description: (hasReadme ? readmeContent : repo.description) || "",
          languageStats: languagesStr,
          url: repo.html_url,
          topics: repo.topics || [],
        };
      })
    );
    const repoSummaries = repoSummariesRaw.filter(Boolean);

    if (repoSummaries.length === 0) {
      return NextResponse.json({ projects: [], summary: "" });
    }

    // Fetch user's profile README if it exists
    let profileReadme = "";
    try {
      const readmeRes = await fetch(
        `https://api.github.com/repos/${username}/${username}/readme`,
        {
          headers: {
            Authorization: `Bearer ${githubApiKey}`,
            Accept: "application/vnd.github.v3.raw",
          },
        }
      );
      if (readmeRes.ok) {
        profileReadme = await readmeRes.text();
        if (profileReadme.length > 3000) {
          profileReadme = profileReadme.substring(0, 3000) + "...";
        }
      }
    } catch {
      console.error("Failed to fetch profile README for", username);
    }

    // 2. Call OpenAI API for comparison
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const topRepos = repoSummaries.slice(0, 5);

    const completion = await openai.chat.completions.create({
      model: "gpt-5.1", // Using high performance model for best reasoning
      messages: [
        {
          role: "system",
          content: `
You are an expert technical recruiter and CV optimizer.

Your objective is to accurately assess and present the candidate’s alignment with the job description.
Use both the repository descriptions and repository topics (tags) to gain insights into the technologies, patterns, and focus areas of each project.

### CRITICAL RULES
- The Job Description is the PRIMARY source of truth.
- Candidate repositories are SUPPORTING evidence only.
- If there is any conflict between repo signals and job requirements, ALWAYS prioritise the Job Description.
- Do NOT include skills, roles, or labels that are not relevant to the job description.
- Use the strictly quantified "languageStats" from the repository to understand the tech stack breakdown (e.g. "TypeScript: 85.0%") instead of purely relying on topics or README mentions.

---

### PROJECT SELECTION
Select 3–5 projects that BEST match the job requirements.

Prioritise:
- Direct keyword matches (e.g. React, performance optimisation, UI development)
- Similar responsibilities (e.g. translating designs into code)
- Relevant technical patterns (e.g. state management, API integration)

Deprioritise:
- Irrelevant technologies
- Generic or weak projects
- Backend-heavy or full stack work if the role is frontend-focused

---

### OUTPUT PER PROJECT
For each project provide:
- Name + URL
- Match score (0–100) based on job alignment (not project quality alone)
- 1–2 sentence explanation tied directly to job requirements
- 2–3 CV bullet points:
  - Start with strong action verbs
  - Focus on outcomes and impact
  - Mirror job description terminology where possible
- 2–4 key matched skills/keywords from the job description

---

### VERDICT
Choose EXACTLY one:
- "Strong Fit for This Role"
- "Decent, but needs improvement"
- "Weak match — likely to struggle getting interviews"

Base this ONLY on alignment with the job description.
Also, provide an overall role match score (0-100) under roleRelevancePercentage.

---

### PROFESSIONAL SUMMARY
Generate a highly targeted professional summary that:

- Is CONCISE (readable in 5-10 seconds, max 2-3 short sentences/paragraphs).
- Establishes ONE clear professional identity strictly matching the job title (e.g., "Frontend-focused Web Developer", NOT a mixed "Front-End / Full Stack Web Developer").
- Focuses heavily on concrete impact and specific achievements (what was actually built, technologies applied, and concrete outcomes).
- Reuses key terminology from the job description where appropriate.
- STRICTLY AVOIDS generic fluff phrases (do NOT use words like "intuitive", "visually engaging", "collaborating closely", "passionate", etc.).
- Avoids junior/academic labels (e.g. "student", "intern").
- Do NOT infer experience that is not clearly supported by repositories or provided context

Tone:
- Direct, impact-driven, and recruiter-friendly (built for 5-second skimming).
- Specific over broad; practical over theoretical.
- Must sound like a real developer describing their work, not a recruiter or sales pitch.

Example of good structure:
"[Primary Identity aligned to role] specialising in [Core Tech Stack] to build [Types of applications]. Experienced in [Specific responsibilities from JD, e.g., developing dashboards, integrating APIs]. Built projects in [Candidate's repo domains], with a focus on [Specific impact/optimization]. Strong foundation in [Core requirement] with exposure to [Secondary requirement]."

The summary must reflect the candidate’s actual strengths and alignment without exaggeration for THIS specific role, avoiding any dilution of their primary skill set.

### SKILL GROUPINGS
Analyze the skills overlapping between the candidate's projects and the job requirements.
Group them logically by domain (e.g., "Languages", "Frontend", "Backend", "Databases", "Tools" - or generate other relevant categories based on the actual skills).
Only include skills that the candidate has demonstrated in their repositories which are ALSO relevant to the job requirements.
IMPORTANT: Do NOT list highly redundant skills or an exhaustive dump of everything they know. Consolidate them for impact, preferring broad impact over quantity. For example, combine CSS3, Tailwind CSS, and SCSS into a single "CSS" skill. Only include things that suggest they are a builder. Keep it extremely concise and avoid redundancy.
`
        },
        {
          role: "user",
          content: `Job Description:\n${jobDescription}\n` +
            (profileReadme ? `\nCandidate's Profile README:\n${profileReadme}\n` : "") +
            `\nCandidate's Repositories:\n${JSON.stringify(topRepos, null, 2)}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "project_recommendations",
          schema: {
            type: "object",
            properties: {
              verdict: { type: "string" },
              roleRelevancePercentage: { type: "number" },
              summary: { type: "string" },
              skillGroupings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string" },
                    skills: { type: "array", items: { type: "string" } }
                  },
                  required: ["category", "skills"],
                  additionalProperties: false
                }
              },
              projects: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    url: { type: "string" },
                    matchScore: { type: "number" },
                    whyItMatters: { type: "string" },
                    cvBullets: { type: "array", items: { type: "string" } },
                    keyMetrics: { type: "array", items: { type: "string" } }
                  },
                  required: ["name", "url", "matchScore", "whyItMatters", "cvBullets", "keyMetrics"],
                  additionalProperties: false
                }
              }
            },
            required: ["verdict", "roleRelevancePercentage", "summary", "skillGroupings", "projects"],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    const resultText = completion.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error("No response from OpenAI");
    }

    const parsedResult = JSON.parse(resultText);

    return NextResponse.json(parsedResult);
  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
