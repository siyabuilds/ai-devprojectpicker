import { NextResponse } from "next/server";
import OpenAI from "openai";

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
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=15`,
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

    const repos = await githubRes.json();

    if (!repos || repos.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    // Filter relevant fields to save tokens
    const repoSummaries = repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description || "No description",
      language: repo.language,
      url: repo.html_url,
      topics: repo.topics || [],
    }));

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
- A 1-2 sentence explanation of why this project should be highlighted on the CV for this specific role.
- 2-4 key metrics or skills demonstrated in the project that match the job description (e.g. "React", "REST API", "State Management").`
        },
        {
          role: "user",
          content: `Job Description:\n${jobDescription}\n\nCandidate's Repositories:\n${JSON.stringify(repoSummaries, null, 2)}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "project_recommendations",
          schema: {
            type: "object",
            properties: {
              projects: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    url: { type: "string" },
                    matchScore: { type: "number" },
                    explanation: { type: "string" },
                    keyMetrics: { type: "array", items: { type: "string" } }
                  },
                  required: ["name", "url", "matchScore", "explanation", "keyMetrics"],
                  additionalProperties: false
                }
              }
            },
            required: ["projects"],
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
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
