export const LEADS_COLLECTION = 'leads';

export const LEAD_SOURCES = {
  AI_MATCHMAKER: 'ai_university_matchmaker',
  JOIN_US: 'join_us',
};

export const LEAD_SOURCE_LABELS = {
  [LEAD_SOURCES.AI_MATCHMAKER]: 'AI Matchmaker',
  [LEAD_SOURCES.JOIN_US]: 'Join Us Form',
};

export const getLeadSourceLabel = (source) =>
  LEAD_SOURCE_LABELS[source] ||
  `${source || 'Lead'}`.replace(/[_-]+/g, ' ').trim();

export const normalizeLeadEmail = (value) =>
  `${value || ''}`.trim().toLowerCase();

export const normalizeLeadPhone = (value) =>
  `${value || ''}`.replace(/[^\d+]/g, '').trim();

const sanitizeText = (value, maxLength = 500) => {
  const normalized = `${value || ''}`.trim();
  return normalized ? normalized.slice(0, maxLength) : '';
};

const compactObject = (value) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === null || entry === undefined || entry === '') return false;
      if (Array.isArray(entry)) return entry.length > 0;
      if (typeof entry === 'object') return Object.keys(entry).length > 0;
      return true;
    }),
  );

export const buildAiMatchmakerLead = ({
  currentUser,
  searchProfile,
  parsedResults,
  hasProfilePdf,
}) => {
  const studentName = sanitizeText(searchProfile.studentName, 120);
  const email = normalizeLeadEmail(currentUser?.email);
  const name = studentName || sanitizeText(currentUser?.displayName, 120);

  return compactObject({
    source: LEAD_SOURCES.AI_MATCHMAKER,
    sourcePage: 'ai_university_matchmaker',
    sourceLabel: getLeadSourceLabel(LEAD_SOURCES.AI_MATCHMAKER),
    leadType: 'ai_matchmaker',
    leadStatus: 'new',
    generatedAtIso: new Date().toISOString(),
    name,
    email,
    user: compactObject({
      uid: currentUser?.uid || null,
      email: email || null,
      displayName: sanitizeText(currentUser?.displayName, 120) || null,
    }),
    contact: compactObject({
      name: name || null,
      email: email || null,
      phone: null,
    }),
    profile: compactObject({
      filledBy: sanitizeText(searchProfile.filledBy, 40) || null,
      studentName: studentName || null,
      contactPreferences: Array.isArray(searchProfile.contactPreferences)
        ? searchProfile.contactPreferences.filter(Boolean)
        : [],
      degreeLevel: sanitizeText(searchProfile.degreeLevel, 80) || null,
      programArea: sanitizeText(searchProfile.programArea, 120) || null,
      specialization: sanitizeText(searchProfile.specialization, 120) || null,
      targetCountries: Array.isArray(searchProfile.targetCountries)
        ? searchProfile.targetCountries.filter(Boolean)
        : [],
      targetIntake: sanitizeText(searchProfile.targetIntake, 80) || null,
      careerGoal: sanitizeText(searchProfile.careerGoal, 240) || null,
      scoreType: sanitizeText(searchProfile.scoreType, 40) || null,
      scoreValue: sanitizeText(searchProfile.scoreValue, 40) || null,
      boardOrUniversity:
        sanitizeText(searchProfile.boardOrUniversity, 120) || null,
      englishTestStatus:
        sanitizeText(searchProfile.englishTestStatus, 40) || null,
      englishTestType: sanitizeText(searchProfile.englishTestType, 40) || null,
      englishTestScore:
        sanitizeText(searchProfile.englishTestScore, 40) || null,
      budgetAmount: sanitizeText(searchProfile.budgetAmount, 40) || null,
      budgetCurrency: sanitizeText(searchProfile.budgetCurrency, 12) || 'INR',
      fundingPlan: sanitizeText(searchProfile.fundingPlan, 80) || null,
      scholarshipNeed: sanitizeText(searchProfile.scholarshipNeed, 40) || null,
      familyPriorityTop3: Array.isArray(searchProfile.familyPriorityTop3)
        ? searchProfile.familyPriorityTop3.filter(Boolean)
        : [],
      riskComfort: sanitizeText(searchProfile.riskComfort, 40) || null,
      notes: sanitizeText(searchProfile.query, 1000) || null,
    }),
    hasProfilePdf: Boolean(hasProfilePdf),
    leadSummary:
      sanitizeText(parsedResults?.summary, 1000) ||
      'AI university shortlist generated',
    aiResult: compactObject({
      summary: sanitizeText(parsedResults?.summary, 2000) || '',
      totalUniversities: Array.isArray(parsedResults?.universities)
        ? parsedResults.universities.length
        : 0,
      universities: Array.isArray(parsedResults?.universities)
        ? parsedResults.universities.slice(0, 10).map((uni) => ({
            name: sanitizeText(uni?.name, 160),
            country: sanitizeText(uni?.country, 80),
            program: sanitizeText(uni?.program, 160),
            fit: sanitizeText(uni?.fit, 240),
            reason: sanitizeText(uni?.reason, 400),
          }))
        : [],
      nextSteps: Array.isArray(parsedResults?.nextSteps)
        ? parsedResults.nextSteps
            .slice(0, 5)
            .map((step) => sanitizeText(step, 240))
            .filter(Boolean)
        : [],
    }),
  });
};

export const validateJoinUsLead = ({ name, email, phone, sourcePage }) => {
  const cleanName = sanitizeText(name, 120);
  const cleanEmail = normalizeLeadEmail(email);
  const cleanPhone = normalizeLeadPhone(phone);
  const cleanSourcePage = sanitizeText(sourcePage, 80);

  if (!cleanName || cleanName.length < 2) {
    return 'Name must be at least 2 characters.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return 'Please provide a valid email address.';
  }

  if (!/^\+?\d{10,15}$/.test(cleanPhone)) {
    return 'Please provide a valid phone number.';
  }

  if (!cleanSourcePage) {
    return 'Lead source is invalid.';
  }

  return null;
};

export const buildJoinUsLead = ({ name, email, phone, sourcePage }) => {
  const cleanName = sanitizeText(name, 120);
  const cleanEmail = normalizeLeadEmail(email);
  const cleanPhone = normalizeLeadPhone(phone);
  const cleanSourcePage = sanitizeText(sourcePage, 80);

  return compactObject({
    source: LEAD_SOURCES.JOIN_US,
    sourcePage: cleanSourcePage,
    sourceLabel: getLeadSourceLabel(LEAD_SOURCES.JOIN_US),
    leadType: 'general_inquiry',
    leadStatus: 'new',
    generatedAtIso: new Date().toISOString(),
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    leadSummary: 'General counseling enquiry captured from site form',
    contact: {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      consentToContact: true,
      preferredChannels: ['Email', 'SMS', 'WhatsApp', 'Call'],
    },
    profile: {
      studentName: cleanName,
      contactPreferences: ['Email', 'SMS', 'WhatsApp', 'Call'],
      notes: 'Submitted through the Join Us form.',
    },
  });
};
