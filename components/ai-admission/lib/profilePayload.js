const scoreTypeLabels = {
  PERCENTAGE_100: 'Percentage /100',
  CGPA_10: 'CGPA /10',
  GPA_4: 'GPA /4',
};

const buildLegacyTestSummary = (profile) => {
  const testParts = [];
  if (profile.englishTest && profile.englishTest !== 'NOT_TAKEN') {
    const englishScoreSuffix = profile.englishScore
      ? ` ${profile.englishScore}`
      : '';
    testParts.push(`${profile.englishTest}${englishScoreSuffix}`);
  }
  if (profile.aptitudeTest && profile.aptitudeTest !== 'NOT_REQUIRED') {
    const aptitudeScoreSuffix = profile.aptitudeScore
      ? ` ${profile.aptitudeScore}`
      : '';
    testParts.push(`${profile.aptitudeTest}${aptitudeScoreSuffix}`);
  }
  if (!testParts.length) {
    return 'Not taken yet';
  }
  return testParts.join(', ');
};

export const buildProfilePayload = (formData) => {
  const scoreType = scoreTypeLabels[formData.scoreType] || formData.scoreType;
  return {
    ...formData,
    gpa:
      formData.scoreValue && scoreType
        ? `${formData.scoreValue} (${scoreType})`
        : formData.gpa,
    testScores: buildLegacyTestSummary(formData),
    budget:
      formData.budgetAmount && formData.budgetCurrency
        ? `${formData.budgetAmount} ${formData.budgetCurrency} (${formData.budgetIncludes || 'tuition + living'})`
        : formData.budget,
    timeline:
      [
        formData.targetIntake,
        formData.applicationStage,
        formData.deadlineUrgency,
      ]
        .filter(Boolean)
        .join(' | ') || formData.timeline,
  };
};
