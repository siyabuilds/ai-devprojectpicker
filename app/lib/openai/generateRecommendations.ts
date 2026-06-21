import { EnrichedRepo } from "../../types/github";
import { Recommendation } from "../../types/recommendation";

import { openai } from "./client";

import { recommendationSchema } from "./schemas";

import { recommendationSystemPrompt } from "./prompts/recommendationPrompt";

export async function generateRecommendations(
    jobDescription: string,
    profileReadme: string,
    repositories: EnrichedRepo[],
): Promise<Recommendation> {
    const response = await openai.responses.create({
        model: "o5",

        reasoning: {
            effort: "high",
        },

        instructions: recommendationSystemPrompt,

        input: [
            {
                role: "user",
                content: JSON.stringify({
                    jobDescription,
                    profileReadme,
                    repositories,
                }),
            },
        ],

        text: {
            format: {
                type: "json_schema",
                ...recommendationSchema,
            },
        },
    });

    if (!response.output_text) {
        throw new Error(
            "No recommendation response received from OpenAI",
        );
    }

    return JSON.parse(response.output_text) as Recommendation;
}