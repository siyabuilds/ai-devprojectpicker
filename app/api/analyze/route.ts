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

    // Filter 1: Must have a live link / deployed demo
    const reposWithDemo = allRepos.filter(
      (repo: GitHubRepo) => (repo.homepage && repo.homepage.trim() !== "") || repo.has_pages
    );

    // Filter 2: Must have at least 5+ commits
    const validRepos: GitHubRepo[] = [];
    for (const repo of reposWithDemo) {
      try {
        const commitRes = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=5`,
          {
            headers: {
              Authorization: `Bearer ${githubApiKey}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (commitRes.ok) {
          const commits = await commitRes.json();
          if (Array.isArray(commits) && commits.length >= 5) {
            validRepos.push(repo);
          }
        }
      } catch {
        console.error("Failed to fetch commits for repo", repo.name);
      }
    }

    if (validRepos.length === 0) {
      return NextResponse.json({ projects: [], summary: "" });
    }

    // Filter relevant fields to save tokens
    const repoSummaries = validRepos.map((repo: GitHubRepo) => ({
      name: repo.name,
      description: repo.description || "No description",
      language: repo.language,
      url: repo.html_url,
      topics: repo.topics || [],
    }));

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

    const completion = await openai.chat.completions.create({
      model: "gpt-5.1", // Using high performance model for best reasoning
      messages: [
        {
          role: "system",
          content: `You are an expert technical recruiter and CV optimizer. Your task is to analyze a candidate's GitHub repositories and select the top 3-5 projects that best match the provided Job Description.
          
For each selected project, you must provide:
- The project name and URL.
- A match score out of 100 representing how well the project aligns with the job requirements.
- A 1-2 sentence explanation of why this project matters and should be highlighted on the CV for this specific role.
- 2-3 suggested CV bullet points demonstrating the project's achievements, ready for the candidate to copy-paste into their resume. Focus on action verbs and outcomes relevant to the job.
- 2-4 key metrics or skills demonstrated in the project that match the job description (e.g. "React", "REST API", "State Management").

Additionally, you must provide a "Professional summary" that incorporates the candidate's skills, highlights the selected projects, perfectly aligns with the job description, and draws upon their Profile README if provided to capture their personal tone and background. IMPORTANT: Do NOT use academic or junior-level terminology such as "intern", "graduate", "student", etc. Focus solely on the characteristics in the projects that align with the job responsibilities and technical requirements. The summary should follow a tone similar to:
"Full stack developer specializing in building internal systems, workflow automation, and scalable software solutions. Proven ability to design and deliver tools that improve operational efficiency and reduce manual processes. Experienced in API integration, semantic search, and data-driven systems, with a strong focus on performance, usability, and real-world impact."`
        },
        {
          role: "user",
          content: `Job Description:\n${jobDescription}\n` +
            (profileReadme ? `\nCandidate's Profile README:\n${profileReadme}\n` : "") +
            `\nCandidate's Repositories:\n${JSON.stringify(repoSummaries, null, 2)}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "project_recommendations",
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
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
            required: ["summary", "projects"],
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
