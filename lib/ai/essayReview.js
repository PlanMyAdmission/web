const DOCUMENT_TYPE_LABELS = {
  statement_of_purpose: 'Statement of Purpose',
  personal_statement: 'Personal Statement',
  supplemental_essay: 'Supplemental Essay',
};

const REVIEW_FOCUS_LABELS = {
  storytelling: 'Storytelling',
  authenticity: 'Authenticity',
  structure: 'Structure and flow',
  grammar: 'Grammar and polish',
  school_fit: 'School fit and specificity',
  clarity: 'Clarity and readability',
};

const toSafeString = (value) => (typeof value === 'string' ? value.trim() : '');

const toSafeStringArray = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => toSafeString(item))
        .filter(Boolean)
        .slice(0, 6)
    : [];

const toScore = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(parsed)));
};

const toCount = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.round(parsed));
};

export const buildEssayReviewPrompt = (reviewForm = {}, mode = 'text') => {
  const essayText = toSafeString(reviewForm.essayText);
  const normalizedPayload = {
    ...reviewForm,
    documentType:
      DOCUMENT_TYPE_LABELS[reviewForm.documentType] ||
      toSafeString(reviewForm.documentType),
    focusAreas: toSafeStringArray(reviewForm.focusAreas).map(
      (item) => REVIEW_FOCUS_LABELS[item] || item,
    ),
    essayText,
  };

  return `
You are a senior college admissions essay reviewer.
Return strict JSON only. Do not include markdown, prose outside JSON, or code fences.

Submission mode: ${mode}
Submission details:
${JSON.stringify(normalizedPayload, null, 2)}

Instructions:
- Evaluate this draft as an admissions document for college or university applications.
- Be direct and honest. Do not inflate scores.
- If target school, target program, or prompt are missing, mention that uncertainty in the analysis.
- Score the draft using these categories: Narrative & authenticity, Structure & flow, Specificity & school fit, Clarity & style, Reflection & depth, Prompt alignment.
- Calibrate overallScore this way:
  - 90-100: standout and highly competitive
  - 80-89: strong draft with targeted polish needed
  - 65-79: promising but materially uneven
  - 0-64: needs major revision before submission
- focusFeedback must address the selected focus areas from the submission details.
- strengths, improvementAreas, and nextDraftChecklist should be concise and specific.
- priorityFixes should be ordered by highest impact first.
- sentenceEdits should contain at most 3 short, high-impact before/after rewrites from the draft.
- revisedExcerpt should be a stronger 80-140 word rewrite of the weakest opening or section.
- Never invent achievements, family background, or academic details that are not present.

Return JSON in this shape:
{
  "documentType": "Statement of Purpose",
  "overallScore": 0,
  "overallVerdict": "Needs major revision / Promising but uneven / Strong draft / Standout potential",
  "estimatedWordCount": 0,
  "admissionsReadiness": {
    "band": "Not ready / Revision needed / Strong draft / Submission ready",
    "summary": "2-3 sentence summary"
  },
  "scoreBreakdown": [
    {
      "category": "Narrative & authenticity",
      "score": 0,
      "verdict": "Short category verdict",
      "explanation": "One concise explanation"
    }
  ],
  "focusFeedback": [
    {
      "focus": "Storytelling",
      "insight": "Specific guidance tied to that focus area"
    }
  ],
  "strengths": ["..."],
  "improvementAreas": ["..."],
  "priorityFixes": [
    {
      "priority": "High / Medium / Low",
      "issue": "Main problem",
      "whyItMatters": "Why this hurts the essay",
      "action": "Concrete revision action"
    }
  ],
  "sentenceEdits": [
    {
      "original": "Short original line",
      "improved": "Improved version",
      "rationale": "Why the new version works better"
    }
  ],
  "revisedExcerpt": "Improved excerpt",
  "coachSummary": "A concise admissions-coach takeaway",
  "nextDraftChecklist": ["..."]
}
`;
};

export const essayReviewJsonSchema = {
  type: 'object',
  properties: {
    documentType: {
      type: 'string',
    },
    overallScore: {
      type: 'number',
    },
    overallVerdict: {
      type: 'string',
    },
    estimatedWordCount: {
      type: 'number',
    },
    admissionsReadiness: {
      type: 'object',
      properties: {
        band: {
          type: 'string',
        },
        summary: {
          type: 'string',
        },
      },
      required: ['band', 'summary'],
    },
    scoreBreakdown: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
          },
          score: {
            type: 'number',
          },
          verdict: {
            type: 'string',
          },
          explanation: {
            type: 'string',
          },
        },
        required: ['category', 'score', 'verdict', 'explanation'],
      },
    },
    focusFeedback: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          focus: {
            type: 'string',
          },
          insight: {
            type: 'string',
          },
        },
        required: ['focus', 'insight'],
      },
    },
    strengths: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    improvementAreas: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    priorityFixes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          priority: {
            type: 'string',
          },
          issue: {
            type: 'string',
          },
          whyItMatters: {
            type: 'string',
          },
          action: {
            type: 'string',
          },
        },
        required: ['priority', 'issue', 'whyItMatters', 'action'],
      },
    },
    sentenceEdits: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          original: {
            type: 'string',
          },
          improved: {
            type: 'string',
          },
          rationale: {
            type: 'string',
          },
        },
        required: ['original', 'improved', 'rationale'],
      },
    },
    revisedExcerpt: {
      type: 'string',
    },
    coachSummary: {
      type: 'string',
    },
    nextDraftChecklist: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: [
    'documentType',
    'overallScore',
    'overallVerdict',
    'estimatedWordCount',
    'admissionsReadiness',
    'scoreBreakdown',
    'focusFeedback',
    'strengths',
    'improvementAreas',
    'priorityFixes',
    'sentenceEdits',
    'revisedExcerpt',
    'coachSummary',
    'nextDraftChecklist',
  ],
};

export const normalizeEssayReviewResult = (payload = {}) => ({
  documentType: toSafeString(payload.documentType) || 'Essay',
  overallScore: toScore(payload.overallScore),
  overallVerdict: toSafeString(payload.overallVerdict) || 'Revision needed',
  estimatedWordCount: toCount(payload.estimatedWordCount),
  admissionsReadiness: {
    band: toSafeString(payload?.admissionsReadiness?.band) || 'Revision needed',
    summary: toSafeString(payload?.admissionsReadiness?.summary),
  },
  scoreBreakdown: Array.isArray(payload.scoreBreakdown)
    ? payload.scoreBreakdown
        .map((item) => ({
          category: toSafeString(item?.category),
          score: toScore(item?.score),
          verdict: toSafeString(item?.verdict),
          explanation: toSafeString(item?.explanation),
        }))
        .filter((item) => item.category)
        .slice(0, 6)
    : [],
  focusFeedback: Array.isArray(payload.focusFeedback)
    ? payload.focusFeedback
        .map((item) => ({
          focus: toSafeString(item?.focus),
          insight: toSafeString(item?.insight),
        }))
        .filter((item) => item.focus && item.insight)
        .slice(0, 4)
    : [],
  strengths: toSafeStringArray(payload.strengths),
  improvementAreas: toSafeStringArray(payload.improvementAreas),
  priorityFixes: Array.isArray(payload.priorityFixes)
    ? payload.priorityFixes
        .map((item) => ({
          priority: toSafeString(item?.priority) || 'Medium',
          issue: toSafeString(item?.issue),
          whyItMatters: toSafeString(item?.whyItMatters),
          action: toSafeString(item?.action),
        }))
        .filter((item) => item.issue && item.action)
        .slice(0, 5)
    : [],
  sentenceEdits: Array.isArray(payload.sentenceEdits)
    ? payload.sentenceEdits
        .map((item) => ({
          original: toSafeString(item?.original),
          improved: toSafeString(item?.improved),
          rationale: toSafeString(item?.rationale),
        }))
        .filter((item) => item.original && item.improved)
        .slice(0, 3)
    : [],
  revisedExcerpt: toSafeString(payload.revisedExcerpt),
  coachSummary: toSafeString(payload.coachSummary),
  nextDraftChecklist: toSafeStringArray(payload.nextDraftChecklist),
});
