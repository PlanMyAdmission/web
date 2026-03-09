export const buildLeadPayload = ({
  currentUser,
  searchProfile,
  parsedResults,
  hasProfilePdf,
}) => ({
  source: 'ai_university_matchmaker',
  leadStatus: 'new',
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
  hasProfilePdf: hasProfilePdf,
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
          reason: uni?.reason || '',
        }))
      : [],
    nextSteps: Array.isArray(parsedResults?.nextSteps)
      ? parsedResults.nextSteps.slice(0, 5)
      : [],
  },
});
