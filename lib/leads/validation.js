export const LEAD_SOURCES = {
  AI_MATCHMAKER: 'ai_university_matchmaker',
  JOIN_US: 'join_us',
};

const LEAD_SOURCE_LABELS = {
  [LEAD_SOURCES.AI_MATCHMAKER]: 'AI Matchmaker',
  [LEAD_SOURCES.JOIN_US]: 'Join Us Form',
};

const getLeadSourceLabel = (source) =>
  LEAD_SOURCE_LABELS[source] ||
  `${source || 'Lead'}`.replace(/[_-]+/g, ' ').trim();

const normalizeLeadEmail = (value) => `${value || ''}`.trim().toLowerCase();

const normalizeLeadPhone = (value) =>
  `${value || ''}`.replace(/[^\d+]/g, '').trim();

const normalizeLeadPhoneCountryCode = (value) => {
  const digits = `${value || ''}`.replace(/\D/g, '').slice(0, 4);
  return digits ? `+${digits}` : '';
};

const normalizeLeadPhoneNumber = (value) =>
  `${value || ''}`.replace(/\D/g, '').slice(0, 15);

const buildLeadPhone = (phoneCountryCode, phoneNumber) => {
  const cleanPhoneCountryCode = normalizeLeadPhoneCountryCode(phoneCountryCode);
  const cleanPhoneNumber = normalizeLeadPhoneNumber(phoneNumber);

  if (!cleanPhoneCountryCode || !cleanPhoneNumber) {
    return '';
  }

  return `${cleanPhoneCountryCode} ${cleanPhoneNumber}`;
};

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

export const validateJoinUsLead = ({
  name,
  email,
  phone,
  phoneCountryCode,
  phoneNumber,
  sourcePage,
}) => {
  const cleanName = sanitizeText(name, 120);
  const cleanEmail = normalizeLeadEmail(email);
  const cleanPhone = normalizeLeadPhone(phone);
  const cleanPhoneCountryCode = normalizeLeadPhoneCountryCode(phoneCountryCode);
  const cleanPhoneNumber = normalizeLeadPhoneNumber(phoneNumber);
  const cleanSourcePage = sanitizeText(sourcePage, 80);

  if (!cleanName || cleanName.length < 2) {
    return 'Name must be at least 2 characters.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return 'Please provide a valid email address.';
  }

  const hasSplitPhone = cleanPhoneCountryCode || cleanPhoneNumber;

  if (hasSplitPhone) {
    if (!/^\+\d{1,4}$/.test(cleanPhoneCountryCode)) {
      return 'Please provide a valid phone country code.';
    }

    if (!/^\d{6,15}$/.test(cleanPhoneNumber)) {
      return 'Please provide a valid phone number.';
    }
  } else if (!/^\+?\d{10,15}$/.test(cleanPhone)) {
    return 'Please provide a valid phone number.';
  }

  if (!cleanSourcePage) {
    return 'Lead source is invalid.';
  }

  return null;
};

export const buildJoinUsLead = ({
  name,
  email,
  phone,
  phoneCountryCode,
  phoneNumber,
  sourcePage,
}) => {
  const cleanName = sanitizeText(name, 120);
  const cleanEmail = normalizeLeadEmail(email);
  const cleanPhoneCountryCode = normalizeLeadPhoneCountryCode(phoneCountryCode);
  const cleanPhoneNumber = normalizeLeadPhoneNumber(phoneNumber);
  const cleanPhone =
    buildLeadPhone(cleanPhoneCountryCode, cleanPhoneNumber) ||
    normalizeLeadPhone(phone);
  const cleanSourcePage = sanitizeText(sourcePage, 80);

  return {
    source: LEAD_SOURCES.JOIN_US,
    source_page: cleanSourcePage,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    details: compactObject({
      sourceLabel: getLeadSourceLabel(LEAD_SOURCES.JOIN_US),
      leadType: 'general_inquiry',
      leadStatus: 'new',
      generatedAtIso: new Date().toISOString(),
      phoneCountryCode: cleanPhoneCountryCode,
      phoneNumber: cleanPhoneNumber,
      leadSummary: 'General counseling enquiry captured from site form',
      contact: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        phoneCountryCode: cleanPhoneCountryCode,
        phoneNumber: cleanPhoneNumber,
        consentToContact: true,
        preferredChannels: ['Email', 'SMS', 'WhatsApp', 'Call'],
      },
      profile: {
        studentName: cleanName,
        contactPreferences: ['Email', 'SMS', 'WhatsApp', 'Call'],
        notes: 'Submitted through the Join Us form.',
      },
    }),
  };
};
