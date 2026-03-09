export const steps = [
  { id: 'basics', title: 'Basics' },
  { id: 'academics', title: 'Academics' },
  { id: 'preferences', title: 'Preferences' },
];

export const degreeLevels = [
  { value: 'UG', label: 'Undergraduate (UG)' },
  { value: 'PG', label: 'Postgraduate (PG)' },
  { value: 'PhD', label: 'Doctorate (PhD)' },
];

export const programAreas = [
  'Computer Science',
  'Information Technology',
  'Business and Management',
  'Engineering',
  'Data Science and AI',
  'Healthcare and Life Sciences',
  'Public Health',
  'Finance and Economics',
  'Law',
  'Design and Media',
];

export const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'Australia',
  'Ireland',
  'Netherlands',
  'France',
  'Singapore',
  'New Zealand',
];

export const scoreTypes = [
  { value: 'percentage', label: 'Percentage (100)' },
  { value: 'cgpa10', label: 'CGPA (10)' },
  { value: 'gpa4', label: 'GPA (4)' },
];

export const englishTests = ['IELTS', 'TOEFL iBT', 'PTE', 'Duolingo'];
export const fundingPlans = [
  'Self-funded',
  'Education loan',
  'Scholarship dependent',
  'Mixed',
];
export const scholarshipNeeds = ['Low', 'Medium', 'High'];
export const contactOptions = ['WhatsApp', 'Email', 'Call'];
export const familyPriorities = [
  'Affordability',
  'Safety',
  'Employability',
  'Campus support',
  'Indian community',
  'Distance from home',
];
export const riskComfortOptions = ['Conservative', 'Balanced', 'Ambitious'];

export const scoreTypeLabels = scoreTypes.reduce((accumulator, item) => {
  accumulator[item.value] = item.label;
  return accumulator;
}, {});

export const getScorePlaceholder = (scoreType) => {
  if (scoreType === 'percentage') return 'Example: 86';
  if (scoreType === 'cgpa10') return 'Example: 8.2';
  return 'Example: 3.4';
};
