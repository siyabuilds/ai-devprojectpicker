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

export const recommendationSchema = {
  name: "recommendation",
  schema: {
    type: "object",
    properties: {
      verdict: {
        type: "string",
        enum: [
          "Strong Fit for This Role",
          "Decent, but needs improvement",
          "Weak match — likely to struggle getting interviews",
        ],
      },

      roleRelevancePercentage: {
        type: "number",
      },

      summary: {
        type: "string",
      },

      skillGroupings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            category: {
              type: "string",
            },
            skills: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["category", "skills"],
          additionalProperties: false,
        },
      },

      projects: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },

            url: {
              type: "string",
            },

            matchScore: {
              type: "number",
            },

            whyItMatters: {
              type: "string",
            },

            cvBullets: {
              type: "array",
              items: {
                type: "string",
              },
            },

            keySkills: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },

          required: [
            "name",
            "url",
            "matchScore",
            "whyItMatters",
            "cvBullets",
            "keySkills",
          ],

          additionalProperties: false,
        },
      },
    },

    required: [
      "verdict",
      "roleRelevancePercentage",
      "summary",
      "skillGroupings",
      "projects",
    ],

    additionalProperties: false,
  },

  strict: true,
} as const;