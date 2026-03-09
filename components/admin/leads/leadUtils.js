export const LEAD_STATUS_OPTIONS = [
  'new',
  'contacted',
  'interested',
  'qualified',
  'closed',
];

export const LEAD_STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  qualified: 'Qualified',
  closed: 'Closed',
};

export const leadToneByStatus = {
  new: 'border-[#ead8e2] bg-[#fff9fc] text-[#7c4965]',
  contacted: 'border-[#f1d3dc] bg-[#fff3f7] text-[#9d135f]',
  interested: 'border-[#efe2ca] bg-[#fffbf2] text-[#8b6110]',
  qualified: 'border-[#d8eadf] bg-[#f5fff8] text-[#2b7a4b]',
  closed: 'border-[#e1e1e8] bg-[#fafafd] text-[#626278]',
};

const toDate = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

export const formatLeadDate = (value) => {
  const date = toDate(value);
  if (!date) {
    return '—';
  }

  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatLeadList = (value = []) =>
  Array.isArray(value) && value.length ? value.join(', ') : '—';

export const formatLeadValue = (value) => {
  if (Array.isArray(value)) {
    return formatLeadList(value);
  }

  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return `${value}`;
};

export const formatLeadBudget = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined || amount === '') {
    return '—';
  }

  const numeric = Number(amount);
  if (Number.isNaN(numeric)) {
    return `${amount} ${currency}`.trim();
  }

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `${numeric.toLocaleString('en-IN')} ${currency}`.trim();
  }
};

export const formatLeadScore = (type, value) => {
  if (!type && (value === null || value === undefined || value === '')) {
    return '—';
  }

  if (!type) {
    return `${value}`;
  }

  if (value === null || value === undefined || value === '') {
    return type;
  }

  return `${type}: ${value}`;
};

export const getLeadStatus = (lead) =>
  `${lead?.leadStatus || 'new'}`.toLowerCase();

export const buildLeadSearchText = (lead) => {
  const topUniversity = lead?.aiResult?.universities?.[0]?.name || '';

  return [
    lead?.profile?.studentName,
    lead?.user?.email,
    lead?.profile?.degreeLevel,
    lead?.profile?.programArea,
    lead?.profile?.specialization,
    formatLeadList(lead?.profile?.targetCountries),
    lead?.profile?.boardOrUniversity,
    lead?.profile?.careerGoal,
    topUniversity,
  ]
    .join(' ')
    .toLowerCase();
};
