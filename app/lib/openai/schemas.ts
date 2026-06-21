export const rankReposSchema = {
  name: "repo_ranking",
  schema: {
    type: "object",
    properties: {
      repositories: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            relevanceScore: {
              type: "number"
            },
            reasoning: {
              type: "string"
            }
          },
          required: [
            "name",
            "relevanceScore",
            "reasoning"
          ],
          additionalProperties: false
        }
      }
    },
    required: ["repositories"],
    additionalProperties: false
  },
  strict: true
} as const;