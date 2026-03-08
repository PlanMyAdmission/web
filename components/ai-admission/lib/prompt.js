export const buildPrompt = (profile, mode) => `
You are an admissions analyst. Produce a concise evaluation report in JSON only.
Do not include markdown, commentary, or code fences.

Input mode: ${mode}
Profile data:
${JSON.stringify(profile, null, 2)}

Rules:
- Normalize academic score based on scoreType:
  - PERCENTAGE_100 -> convert from /100
  - CGPA_10 -> convert from /10
  - GPA_4 -> convert from /4
- Interpret budgetCurrency and budgetAmount correctly.
- If budgetCurrency is INR, reason in INR-first terms and optionally infer USD equivalent.
- Use targetIntake, applicationStage, and deadlineUrgency in advice quality.
- If tests are not taken yet, give concrete next-step prep guidance instead of guessing scores.

Return JSON with this schema:
{
  "profile": {
    "fullName": "...",
    "lastName": "...",
    "email": "...",
    "targetCountry": "...",
    "degreeLevel": "...",
    "programArea": "...",
    "fieldOfStudy": "...",
    "scoreType": "...",
    "scoreValue": "...",
    "boardOrUniversity": "...",
    "englishTest": "...",
    "englishScore": "...",
    "aptitudeTest": "...",
    "aptitudeScore": "...",
    "budgetCurrency": "...",
    "budgetAmount": "...",
    "budgetIncludes": "...",
    "fundingPlan": "...",
    "targetIntake": "...",
    "applicationStage": "...",
    "deadlineUrgency": "...",
    "workExperienceMonths": "...",
    "workExperience": "...",
    "extracurriculars": "...",
    "notes": "..."
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
  type: 'object',
  properties: {
    profile: {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        targetCountry: {
          type: 'string',
        },
        degreeLevel: {
          type: 'string',
        },
        programArea: {
          type: 'string',
        },
        fieldOfStudy: {
          type: 'string',
        },
        scoreType: {
          type: 'string',
        },
        scoreValue: {
          type: 'string',
        },
        boardOrUniversity: {
          type: 'string',
        },
        englishTest: {
          type: 'string',
        },
        englishScore: {
          type: 'string',
        },
        aptitudeTest: {
          type: 'string',
        },
        aptitudeScore: {
          type: 'string',
        },
        budgetCurrency: {
          type: 'string',
        },
        budgetAmount: {
          type: 'string',
        },
        budgetIncludes: {
          type: 'string',
        },
        fundingPlan: {
          type: 'string',
        },
        targetIntake: {
          type: 'string',
        },
        applicationStage: {
          type: 'string',
        },
        deadlineUrgency: {
          type: 'string',
        },
        workExperienceMonths: {
          type: 'string',
        },
        workExperience: {
          type: 'string',
        },
        extracurriculars: {
          type: 'string',
        },
        notes: {
          type: 'string',
        },
        gpa: {
          type: 'string',
        },
        testScores: {
          type: 'string',
        },
        budget: {
          type: 'string',
        },
        timeline: {
          type: 'string',
        },
      },
    },
    summary: {
      type: 'string',
    },
    strengths: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    risks: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    recommendedPrograms: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          program: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          reason: {
            type: 'string',
          },
        },
        required: ['program', 'country', 'reason'],
      },
    },
    advice: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    score: {
      type: 'string',
    },
  },
  required: [
    'summary',
    'strengths',
    'risks',
    'recommendedPrograms',
    'advice',
    'score',
  ],
};
