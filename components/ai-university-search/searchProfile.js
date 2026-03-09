export const INITIAL_SEARCH_PROFILE = {
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

export const HERO_CHIPS = [
  'Student + Parent Ready',
  'India-First Inputs',
  'Clear Outcomes',
];

export const STEP_BY_FIELD = {
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

const getScoreRange = (scoreType) => {
  if (scoreType === 'percentage') return { min: 0, max: 100 };
  if (scoreType === 'cgpa10') return { min: 0, max: 10 };
  return { min: 0, max: 4 };
};

export const validateSearchProfile = (profile) => {
  const errors = {};
  const scoreRange = getScoreRange(profile.scoreType);
  const scoreValue = Number(profile.scoreValue);
  const englishTestScore = Number(profile.englishTestScore);
  const budgetAmount = Number(profile.budgetAmount);

  if (!profile.filledBy) errors.filledBy = 'Select who is filling this form.';
  if (!profile.studentName?.trim())
    errors.studentName = 'Enter the student name.';
  if (!profile.degreeLevel) errors.degreeLevel = 'Select study level.';
  if (!profile.programArea) errors.programArea = 'Select a field of study.';

  if (
    !Array.isArray(profile.targetCountries) ||
    profile.targetCountries.length === 0
  ) {
    errors.targetCountries = 'Select at least one preferred destination.';
  }

  if (!profile.targetIntake) errors.targetIntake = 'Select planned intake.';
  if (!profile.scoreType) errors.scoreType = 'Choose score format.';

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
