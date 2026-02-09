export const buildPrompt = (profile, mode) => `
You are an admissions analyst. Produce a concise evaluation report in JSON only.
Do not include markdown, commentary, or code fences.

Input mode: ${mode}
Profile data:
${JSON.stringify(profile, null, 2)}

Return JSON with this schema:
{
  "profile": {
    "fullName": "...",
    "lastName": "...",
    "email": "...",
    "targetCountry": "...",
    "degreeLevel": "...",
    "fieldOfStudy": "...",
    "gpa": "...",
    "testScores": "...",
    "budget": "...",
    "timeline": "..."
  },
  "summary": "2-4 sentence summary of admission outlook",
  "strengths": ["..."],
  "risks": ["..."],
  "recommendedPrograms": [
    {"program": "...", "country": "...", "reason": "..."}
  ],
  "advice": ["..."],
  "score": "0-100 fit score"
}
`;

export const admissionJsonSchema = {
  type: "object",
  properties: {
    profile: {
      type: "object",
      properties: {
        fullName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        targetCountry: { type: "string" },
        degreeLevel: { type: "string" },
        fieldOfStudy: { type: "string" },
        gpa: { type: "string" },
        testScores: { type: "string" },
        budget: { type: "string" },
        timeline: { type: "string" },
      },
    },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    recommendedPrograms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          program: { type: "string" },
          country: { type: "string" },
          reason: { type: "string" },
        },
        required: ["program", "country", "reason"],
      },
    },
    advice: { type: "array", items: { type: "string" } },
    score: { type: "string" },
  },
  required: [
    "summary",
    "strengths",
    "risks",
    "recommendedPrograms",
    "advice",
    "score",
  ],
};
