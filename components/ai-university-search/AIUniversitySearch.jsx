'use client';

import React, { useMemo, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';
import { useAuth } from '@context/AuthProvider';
import { db } from '@lib/firebase.js';
import SearchHeader from '@/components/ai-university-search/SearchHeader.jsx';
import ProfileUpload from '@/components/ai-university-search/ProfileUpload.jsx';
import ResultsPanel from '@/components/ai-university-search/ResultsPanel.jsx';

const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');

const INITIAL_SEARCH_PROFILE = {
  filledBy: '',
  studentName: '',
  contactPreferences: [],
  degreeLevel: '',
  programArea: '',
  specialization: '',
  targetCountries: [],
  targetIntake: '',
  careerGoal: '',
  scoreType: '',
  scoreValue: '',
  boardOrUniversity: '',
  englishTestStatus: '',
  englishTestType: '',
  englishTestScore: '',
  budgetAmount: '',
  budgetCurrency: 'INR',
  fundingPlan: '',
  scholarshipNeed: '',
  familyPriorityTop3: [],
  riskComfort: '',
  query: '',
};

const HERO_CHIPS = ['Student + Parent Ready', 'India-First Inputs', 'Clear Outcomes'];

const STEP_BY_FIELD = {
  filledBy: 0,
  studentName: 0,
  degreeLevel: 0,
  programArea: 0,
  targetCountries: 0,
  targetIntake: 0,
  scoreType: 1,
  scoreValue: 1,
  englishTestType: 1,
  englishTestScore: 1,
  budgetAmount: 1,
  fundingPlan: 2,
  scholarshipNeed: 2,
  familyPriorityTop3: 2,
  riskComfort: 2,
  contactPreferences: 2,
};

const SCORE_TYPE_LABELS = {
  percentage: 'Percentage (100)',
  cgpa10: 'CGPA (10)',
  gpa4: 'GPA (4)',
};

const extractJson = (raw) => {
  if (!raw) return null;
  let trimmed = raw.trim();
  if (trimmed.startsWith('–')) {
    trimmed = trimmed.slice(1).trim();
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1);
  }
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  const jsonSlice =
    jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart
      ? trimmed.slice(jsonStart, jsonEnd + 1)
      : trimmed;
  const blockMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  const candidate = blockMatch ? blockMatch[1] : jsonSlice;
  try {
    const parsed = JSON.parse(candidate);
    if (typeof parsed === 'string') {
      try {
        return JSON.parse(parsed);
      } catch (_innerError) {
        return null;
      }
    }
    return parsed;
  } catch (_error) {
    return null;
  }
};

const getGeminiText = (result) => {
  if (!result) return '';
  if (typeof result.text === 'string') return result.text;
  if (typeof result.text === 'function') return result.text();
  const parts =
    result?.candidates?.[0]?.content?.parts ||
    result?.response?.candidates?.[0]?.content?.parts ||
    [];
  return parts.map((part) => part.text || '').join('\n');
};

const getScoreRange = (scoreType) => {
  if (scoreType === 'percentage') {
    return {
      min: 0,
      max: 100,
    };
  }
  if (scoreType === 'cgpa10') {
    return {
      min: 0,
      max: 10,
    };
  }
  return {
    min: 0,
    max: 4,
  };
};

const validateSearchProfile = (profile) => {
  const errors = {};
  const scoreRange = getScoreRange(profile.scoreType);
  const scoreValue = Number(profile.scoreValue);
  const englishTestScore = Number(profile.englishTestScore);
  const budgetAmount = Number(profile.budgetAmount);

  if (!profile.filledBy) {
    errors.filledBy = 'Select who is filling this form.';
  }

  if (!profile.studentName?.trim()) {
    errors.studentName = 'Enter the student name.';
  }

  if (!profile.degreeLevel) {
    errors.degreeLevel = 'Select study level.';
  }

  if (!profile.programArea) {
    errors.programArea = 'Select a field of study.';
  }

  if (!Array.isArray(profile.targetCountries) || profile.targetCountries.length === 0) {
    errors.targetCountries = 'Select at least one preferred destination.';
  }

  if (!profile.targetIntake) {
    errors.targetIntake = 'Select planned intake.';
  }

  if (!profile.scoreType) {
    errors.scoreType = 'Choose score format.';
  }

  if (!profile.scoreValue && profile.scoreValue !== 0) {
    errors.scoreValue = 'Enter academic score value.';
  } else if (Number.isNaN(scoreValue)) {
    errors.scoreValue = 'Enter a valid number for academic score.';
  } else if (scoreValue < scoreRange.min || scoreValue > scoreRange.max) {
    errors.scoreValue = `Score must be between ${scoreRange.min} and ${scoreRange.max}.`;
  }

  if (profile.englishTestStatus === 'taken' && !profile.englishTestType) {
    errors.englishTestType = 'Select English test type.';
  }

  if (profile.englishTestStatus === 'taken' && !profile.englishTestScore) {
    errors.englishTestScore = 'Enter English test score.';
  } else if (
    profile.englishTestStatus === 'taken' &&
    profile.englishTestScore &&
    Number.isNaN(englishTestScore)
  ) {
    errors.englishTestScore = 'Enter a valid English test score.';
  }

  if (!profile.budgetAmount && profile.budgetAmount !== 0) {
    errors.budgetAmount = 'Enter your estimated annual budget.';
  } else if (Number.isNaN(budgetAmount) || budgetAmount <= 0) {
    errors.budgetAmount = 'Budget must be greater than zero.';
  }

  return errors;
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

const buildPrompt = (mode, searchProfile) => `
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

const universityJsonSchema = {
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

const AIUniversitySearch = () => {
  const { currentUser } = useAuth();
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState({
    type: 'idle',
    message: '',
  });
  const [results, setResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [searchProfile, setSearchProfile] = useState(INITIAL_SEARCH_PROFILE);
  const resolvedApiKey = useMemo(
    () => process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    [],
  );

  const setSearchField = (field, value) => {
    setSearchProfile((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === 'englishTestStatus' && value !== 'taken') {
        next.englishTestType = '';
        next.englishTestScore = '';
      }

      return next;
    });

    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[field];

      if (field === 'englishTestStatus' && value !== 'taken') {
        delete next.englishTestType;
        delete next.englishTestScore;
      }

      return next;
    });
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setStatus({
        type: 'error',
        message: 'Please upload a PDF file.',
      });
      return;
    }
    setPdfFile(file);
  };

  const buildGeminiParts = async () => {
    const mode = pdfFile ? 'pdf' : 'search';
    const parts = [
      {
        text: buildPrompt(mode, searchProfile),
      },
    ];

    if (pdfFile) {
      const buffer = await pdfFile.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64,
        },
        mediaResolution: {
          level: 'media_resolution_medium',
        },
      });
    }

    return parts;
  };

  const saveLeadRecord = async (parsedResults) => {
    const leadPayload = {
      source: 'ai_university_matchmaker',
      leadStatus: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      generatedAtIso: new Date().toISOString(),
      user: {
        uid: currentUser?.uid || null,
        email: currentUser?.email || null,
        displayName: currentUser?.displayName || null,
      },
      profile: {
        filledBy: searchProfile.filledBy || null,
        studentName: searchProfile.studentName || null,
        contactPreferences: Array.isArray(searchProfile.contactPreferences)
          ? searchProfile.contactPreferences
          : [],
        degreeLevel: searchProfile.degreeLevel || null,
        programArea: searchProfile.programArea || null,
        specialization: searchProfile.specialization || null,
        targetCountries: Array.isArray(searchProfile.targetCountries)
          ? searchProfile.targetCountries
          : [],
        targetIntake: searchProfile.targetIntake || null,
        careerGoal: searchProfile.careerGoal || null,
        scoreType: searchProfile.scoreType || null,
        scoreValue: searchProfile.scoreValue || null,
        boardOrUniversity: searchProfile.boardOrUniversity || null,
        englishTestStatus: searchProfile.englishTestStatus || null,
        englishTestType: searchProfile.englishTestType || null,
        englishTestScore: searchProfile.englishTestScore || null,
        budgetAmount: searchProfile.budgetAmount || null,
        budgetCurrency: searchProfile.budgetCurrency || 'INR',
        fundingPlan: searchProfile.fundingPlan || null,
        scholarshipNeed: searchProfile.scholarshipNeed || null,
        familyPriorityTop3: Array.isArray(searchProfile.familyPriorityTop3)
          ? searchProfile.familyPriorityTop3
          : [],
        riskComfort: searchProfile.riskComfort || null,
        notes: searchProfile.query || null,
      },
      hasProfilePdf: Boolean(pdfFile),
      aiResult: {
        summary: parsedResults?.summary || '',
        totalUniversities: Array.isArray(parsedResults?.universities)
          ? parsedResults.universities.length
          : 0,
        universities: Array.isArray(parsedResults?.universities)
          ? parsedResults.universities.slice(0, 10).map((uni) => ({
              name: uni?.name || '',
              country: uni?.country || '',
              program: uni?.program || '',
              fit: uni?.fit || '',
            }))
          : [],
        nextSteps: Array.isArray(parsedResults?.nextSteps)
          ? parsedResults.nextSteps.slice(0, 5)
          : [],
      },
    };

    await addDoc(collection(db, 'ai_matchmaker_leads'), leadPayload);
  };

  const generateRecommendations = async () => {
    if (!resolvedApiKey) {
      setStatus({
        type: 'error',
        message: 'AI service is not configured yet.',
      });
      return;
    }

    const nextErrors = validateSearchProfile(searchProfile);
    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors);
      const firstErrorField = Object.keys(nextErrors)[0];
      setActiveStep(STEP_BY_FIELD[firstErrorField] ?? 0);
      setStatus({
        type: 'error',
        message: 'Please complete the required fields to generate reliable matches.',
      });
      return;
    }

    setValidationErrors({});
    setStatus({
      type: 'loading',
      message: 'Generating family-friendly best-fit university matches...',
    });
    setResults(null);

    try {
      const parts = await buildGeminiParts();
      const client = new GoogleGenAI({
        apiKey: resolvedApiKey,
        apiVersion: 'v1alpha',
      });
      const result = await client.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          {
            role: 'user',
            parts,
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: universityJsonSchema,
        },
      });

      const rawText = getGeminiText(result);
      if (result?.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
        throw new Error('AI response was cut off. Please shorten the profile or try again.');
      }

      const parsed = extractJson(rawText);
      if (!parsed) {
        throw new Error('Unable to parse AI response. Please retry.');
      }

      setResults(parsed);
      try {
        await saveLeadRecord(parsed);
      } catch (leadError) {
        console.error('Failed to save lead record:', leadError);
      }
      setStatus({
        type: 'success',
        message: 'Your parent and student friendly matches are ready.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'Something went wrong while generating results.',
      });
    }
  };

  const resetAll = () => {
    setPdfFile(null);
    setResults(null);
    setValidationErrors({});
    setActiveStep(0);
    setStatus({
      type: 'idle',
      message: '',
    });
    setSearchProfile(INITIAL_SEARCH_PROFILE);
  };

  return (
    <div className={cx('pma-uni-root')}>
      <div className={cx('pma-uni-hero')}>
        <div className={cx('pma-uni-hero-main')}>
          <p className={cx('pma-uni-eyebrow')}>Plan My Admission</p>
          <h2>AI University Matchmaker</h2>
          <p className={cx('pma-uni-subtitle')}>
            Build a clear shortlist that both students and parents can trust. This guided
            flow captures academics, budget, and family priorities before generating matches.
          </p>
          <div className={cx('pma-uni-chip-row')}>
            {HERO_CHIPS.map((chip) => (
              <span key={chip} className={cx('pma-uni-chip')}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SearchHeader
        searchProfile={searchProfile}
        onFieldChange={setSearchField}
        onSearch={generateRecommendations}
        onReset={resetAll}
        activeStep={activeStep}
        onStepChange={setActiveStep}
        validationErrors={validationErrors}
        isLoading={status.type === 'loading'}
      />

      <ProfileUpload pdfFile={pdfFile} onFileChange={handleFile} />

      {status.message && (
        <div className={cx('pma-uni-status', `pma-uni-status-${status.type}`)}>{status.message}</div>
      )}

      <ResultsPanel results={results} />
    </div>
  );
};

export default AIUniversitySearch;
