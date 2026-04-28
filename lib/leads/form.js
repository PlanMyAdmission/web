export const STORAGE_KEY = 'joinUsSubmissions';
export const SUBMISSION_COOLDOWN_MS = 5 * 60 * 1000;

export const COUNTRY_DIAL_CODE_OPTIONS = [
  { label: 'India (+91)', value: '+91' },
  { label: 'USA (+1)', value: '+1' },
  { label: 'UK (+44)', value: '+44' },
  { label: 'Australia (+61)', value: '+61' },
  { label: 'UAE (+971)', value: '+971' },
  { label: 'Singapore (+65)', value: '+65' },
];

export const normalizeCountryDialCode = (value) => {
  const digits = `${value || ''}`.replace(/\D/g, '').slice(0, 4);
  return digits ? `+${digits}` : '';
};

export const normalizePhoneNumber = (value) =>
  `${value || ''}`.replace(/\D/g, '').slice(0, 15);

export const buildFullPhoneNumber = (countryDialCode, phoneNumber) => {
  const normalizedDialCode = normalizeCountryDialCode(countryDialCode);
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  if (!normalizedDialCode || !normalizedPhoneNumber) {
    return '';
  }

  return `${normalizedDialCode} ${normalizedPhoneNumber}`;
};

export const readRecentSubmission = () => {
  try {
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const lastSubmission = submissions[submissions.length - 1];
    return lastSubmission?.timestamp
      ? new Date(lastSubmission.timestamp).getTime()
      : 0;
  } catch {
    return 0;
  }
};

export const persistSubmission = (payload) => {
  try {
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    submissions.push({
      ...payload,
      timestamp: new Date().toISOString(),
      id: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch {
    return;
  }
};
