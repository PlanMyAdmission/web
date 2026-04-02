export const DOCUMENT_TYPE_OPTIONS = [
  {
    value: 'statement_of_purpose',
    label: 'Statement of Purpose',
    description:
      'For graduate school, masters, and profile-driven applications.',
  },
  {
    value: 'personal_statement',
    label: 'Personal Statement',
    description:
      'For personal background, motivation, and holistic admissions prompts.',
  },
  {
    value: 'supplemental_essay',
    label: 'Supplemental Essay',
    description:
      'For school-specific essays, why-this-college prompts, and short answers.',
  },
];

export const REVIEW_FOCUS_OPTIONS = [
  {
    value: 'storytelling',
    label: 'Storytelling',
    description: 'Check whether the narrative feels memorable and well paced.',
  },
  {
    value: 'authenticity',
    label: 'Authenticity',
    description:
      'See if the voice sounds personal instead of generic or over-produced.',
  },
  {
    value: 'structure',
    label: 'Structure',
    description: 'Review flow, paragraph ordering, and transitions.',
  },
  {
    value: 'grammar',
    label: 'Grammar',
    description: 'Spot clarity, polish, and sentence-level weaknesses.',
  },
  {
    value: 'school_fit',
    label: 'School Fit',
    description:
      'Check whether the draft sounds tailored to the college or program.',
  },
  {
    value: 'clarity',
    label: 'Clarity',
    description: 'Test readability, concision, and focus.',
  },
];

export const INITIAL_REVIEW_FORM = {
  documentType: 'statement_of_purpose',
  targetUniversity: '',
  targetProgram: '',
  targetCountry: '',
  prompt: '',
  wordLimit: '',
  applicantContext: '',
  essayText: '',
  focusAreas: ['storytelling', 'school_fit'],
};

export const getDraftWordCount = (essayText = '') => {
  const normalized = `${essayText || ''}`.trim();
  if (!normalized) {
    return 0;
  }

  return normalized.split(/\s+/).length;
};

export const getDocumentTypeLabel = (value) =>
  DOCUMENT_TYPE_OPTIONS.find((item) => item.value === value)?.label || 'Essay';

export const validateReviewForm = (
  reviewForm = INITIAL_REVIEW_FORM,
  { hasPdf = false } = {},
) => {
  const errors = {};
  const essayText = `${reviewForm.essayText || ''}`.trim();
  const wordLimit = `${reviewForm.wordLimit || ''}`.trim();

  if (!reviewForm.documentType) {
    errors.documentType = 'Choose the type of document you want reviewed.';
  }

  if (!essayText && !hasPdf) {
    errors.essayText = 'Paste your draft or upload a PDF.';
  }

  if (essayText.length > 15000) {
    errors.essayText = 'Keep pasted text under 15,000 characters.';
  }

  if (`${reviewForm.targetUniversity || ''}`.trim().length > 160) {
    errors.targetUniversity = 'Keep the university name under 160 characters.';
  }

  if (`${reviewForm.targetProgram || ''}`.trim().length > 160) {
    errors.targetProgram = 'Keep the program name under 160 characters.';
  }

  if (`${reviewForm.targetCountry || ''}`.trim().length > 80) {
    errors.targetCountry = 'Keep the target country under 80 characters.';
  }

  if (`${reviewForm.prompt || ''}`.trim().length > 1800) {
    errors.prompt = 'Keep the prompt under 1,800 characters.';
  }

  if (`${reviewForm.applicantContext || ''}`.trim().length > 1800) {
    errors.applicantContext = 'Keep applicant context under 1,800 characters.';
  }

  if (wordLimit && !/^\d{2,4}$/.test(wordLimit)) {
    errors.wordLimit = 'Use a numeric word limit, for example 650.';
  }

  if (
    !Array.isArray(reviewForm.focusAreas) ||
    reviewForm.focusAreas.length < 1
  ) {
    errors.focusAreas = 'Select at least one review focus.';
  } else if (reviewForm.focusAreas.length > 3) {
    errors.focusAreas = 'Select up to three review focus areas.';
  }

  return errors;
};
