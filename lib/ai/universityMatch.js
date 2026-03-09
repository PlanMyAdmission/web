import 'server-only';

const SCORE_TYPE_LABELS = {
  percentage: 'Percentage (100)',
  cgpa10: 'CGPA (10)',
  gpa4: 'GPA (4)',
};

const buildSearchSummary = (profile) => {
  const budgetLine = profile.budgetAmount
    ? `${profile.budgetAmount} ${profile.budgetCurrency}`
    : 'Not provided';

  const scoreLine = profile.scoreType
    ? `${SCORE_TYPE_LABELS[profile.scoreType] || profile.scoreType}: ${profile.scoreValue || 'Not provided'}`
    : 'Not provided';

  const englishLine =
    profile.englishTestStatus === 'taken'
      ? `${profile.englishTestType || 'Test not selected'}: ${profile.englishTestScore || 'Score not provided'}`
      : profile.englishTestStatus === 'planned'
        ? 'Planned'
        : profile.englishTestStatus === 'not-yet'
          ? 'Not taken yet'
          : 'Not provided';

  return [
    `Filled by: ${profile.filledBy || 'Not provided'}`,
    `Student name: ${profile.studentName || 'Not provided'}`,
    `Contact preference: ${(profile.contactPreferences || []).join(', ') || 'Not provided'}`,
    `Study level: ${profile.degreeLevel || 'Not provided'}`,
    `Program area: ${profile.programArea || 'Not provided'}`,
    `Specialization: ${profile.specialization || 'Not provided'}`,
    `Preferred destinations: ${(profile.targetCountries || []).join(', ') || 'Not provided'}`,
    `Target intake: ${profile.targetIntake || 'Not provided'}`,
    `Career goal: ${profile.careerGoal || 'Not provided'}`,
    `Academic score: ${scoreLine}`,
    `Board or university: ${profile.boardOrUniversity || 'Not provided'}`,
    `English test: ${englishLine}`,
    `Budget: ${budgetLine}`,
    `Funding plan: ${profile.fundingPlan || 'Not provided'}`,
    `Scholarship need: ${profile.scholarshipNeed || 'Not provided'}`,
    `Family priorities: ${(profile.familyPriorityTop3 || []).join(', ') || 'Not provided'}`,
    `Risk comfort: ${profile.riskComfort || 'Not provided'}`,
    `Additional notes: ${profile.query || 'None'}`,
  ].join('\n');
};

export const buildUniversityPrompt = (mode, searchProfile) => `
You are an admissions matchmaker for both students and parents. Provide university recommendations in JSON only.
Do not include markdown, commentary, or code fences.

Student and family profile summary:
${buildSearchSummary(searchProfile)}

Input mode: ${mode}
If a PDF profile is attached, use it to personalize the results. If not, provide a strong general list.

Rules:
- Respect study level, program area, destination, intake, academic score format, and budget constraints.
- Interpret budgets with INR-first reasoning when currency is INR.
- Use family priorities and risk comfort in recommendation rationale when provided.
- Keep recommendations practical and understandable for Indian students and parents.
- Mention scholarship-aware choices when scholarshipNeed is medium or high.

Return JSON with this schema:
{
  "summary": "1-2 sentence overview for student and parent",
  "universities": [
    {
      "name": "...",
      "country": "...",
      "program": "...",
      "fit": "Aspirational/Strong Match/Safer Choice",
      "reason": "1-2 sentence rationale"
    }
  ],
  "nextSteps": ["..."]
}

Return exactly 10 universities when possible.
`;

export const universityJsonSchema = {
  type: 'object',
  properties: {
    summary: {
      type: 'string',
    },
    universities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          program: {
            type: 'string',
          },
          fit: {
            type: 'string',
          },
          reason: {
            type: 'string',
          },
        },
        required: ['name', 'country', 'program', 'fit', 'reason'],
      },
    },
    nextSteps: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['summary', 'universities', 'nextSteps'],
};
