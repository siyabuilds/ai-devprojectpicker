import { LightweightRepo } from "../../types/github";
import { RankedRepo } from "../../types/recommendation";
import { openai } from "./client";
import { rankReposSchema } from "./schemas";
import { rankReposSystemPrompt } from "./prompts/rankReposPrompt";

export async function rankRepos(
  jobDescription: string,
  repositories: LightweightRepo[],
): Promise<RankedRepo[]> {
  const response = await openai.responses.create({
    model: "o5",

    reasoning: {
      effort: "medium",
    },

    instructions: rankReposSystemPrompt,

    input: [
      {
        role: "user",
        content: JSON.stringify({
          jobDescription,
          repositories,
        }),
      },
    ],

    text: {
      format: {
        type: "json_schema",
        ...rankReposSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("No response from OpenAI");
  }

  const output = JSON.parse(response.output_text) as {
    repositories: RankedRepo[];
  };

  return output.repositories.sort(
    (a: RankedRepo, b: RankedRepo) => b.relevanceScore - a.relevanceScore,
  );
}
