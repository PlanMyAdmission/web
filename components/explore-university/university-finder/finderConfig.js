export const INITIAL_FORM_DATA = {
  university: '',
  studyLevel: '',
  scoreType: 'CGPA_10',
  gpa: '',
  testType: '',
  ieltsScore: '',
  toeflScore: '',
  budget: 0,
};

export const scoreTypeRanges = {
  PERCENTAGE_100: { min: 0, max: 100, label: 'Percentage (0-100)' },
  CGPA_10: { min: 0, max: 10, label: 'CGPA (0-10)' },
  GPA_4: { min: 0, max: 4, label: 'GPA (0-4)' },
};

export const normalizeToGpa4 = (scoreType, scoreValue) => {
  const numericScore = parseFloat(scoreValue);
  if (Number.isNaN(numericScore)) return NaN;
  if (scoreType === 'PERCENTAGE_100') return numericScore / 25;
  if (scoreType === 'CGPA_10') return numericScore * 0.4;
  return numericScore;
};

export const formatMinScoreForType = (minGpa, scoreType) => {
  if (scoreType === 'PERCENTAGE_100') return `${Math.round(minGpa * 25)}%`;
  if (scoreType === 'CGPA_10') return `${(minGpa * 2.5).toFixed(1)}/10`;
  return `${minGpa.toFixed(1)}/4`;
};
