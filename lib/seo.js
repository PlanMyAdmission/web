export const BASE_URL = 'https://planmyadmission.com';
export const DEFAULT_TITLE =
  'Plan My Admission | Study Abroad & Admissions Guidance';
export const DEFAULT_DESCRIPTION =
  'Plan My Admission offers expert overseas education consulting with personalized university admissions guidance, student visa support, and AI-powered tools to simplify your study abroad journey.';
export const ROUTE_META = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/home': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/contact': {
    title: 'Contact Plan My Admission | Study Abroad Help',
    description:
      'Questions about studying abroad? Contact Plan My Admission for personalized guidance on colleges, courses, exams, and applications.',
  },
  '/about': {
    title: 'About Plan My Admission | Study Abroad Experts',
    description:
      'Meet the team behind your study abroad journey. Learn about our mission and commitment to expert admissions guidance.',
  },
  '/pricing': {
    title: 'Plan My Admission Pricing | Plans & Packages',
    description:
      'Explore Plan My Admission pricing and plans designed for students preparing for study abroad.',
  },
  '/for-institutions': {
    title: 'Plan My Admission for Institutions',
    description:
      'Scale international student admissions with Plan My Admission’s AI-powered tools and counseling support.',
  },
  '/terms&conditions': {
    title: 'Terms & Conditions | Plan My Admission',
    description:
      'Read the terms and conditions for using Plan My Admission services and website.',
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | Plan My Admission',
    description:
      'Read the terms and conditions for using Plan My Admission services and website.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Plan My Admission',
    description:
      'Learn how Plan My Admission collects, uses, and safeguards your information.',
  },
  '/how-it-works': {
    title: 'How It Works | Plan My Admission',
    description:
      'Understand how Plan My Admission guides you from university selection to admission.',
  },
  '/explore': {
    title: 'Explore Universities | Plan My Admission',
    description:
      'Discover universities, courses, and destinations for your study abroad plans.',
  },
  '/ai-university-search': {
    title: 'AI University Search | Plan My Admission',
    description:
      'Search universities by course and get AI-personalized recommendations from Plan My Admission.',
  },
  '/explore/university': {
    title: 'University Explorer | Plan My Admission',
    description:
      'Explore detailed university profiles and programs to plan your admissions.',
  },
  '/blogs': {
    title: 'Plan My Admission Blog | Study Abroad Insights',
    description:
      'Read the latest study abroad insights, tips, and updates from Plan My Admission.',
  },
  '/recommendations': {
    title: 'Recommendations | Plan My Admission',
    description:
      'View personalized university recommendations based on your profile and goals.',
  },
  '/Navigating-the-American-Campus': {
    title:
      "Navigating the American Campus: A Student's Guide to Living in the USA",
    description:
      'Explore practical insights for thriving on American campuses, from housing tips to cultural integration strategies.',
  },
  '/Embarking-on-Excellence': {
    title: 'Embarking on Excellence | A Comprehensive Guide to Studying Abroad',
    description:
      'Plan your overseas education journey with expert advice on applications, scholarships, and campus life.',
  },
  '/Pennsylvania-State-University': {
    title:
      'Pennsylvania State University | Elevating Education to Unparalleled Heights',
    description:
      'Discover what makes Penn State a top choice for international students seeking academic excellence.',
  },
  '/Mastering-the-Art-of-Financial-Planning': {
    title:
      'Mastering the Art of Financial Planning for Your Study Abroad Adventure',
    description:
      'Learn smart budgeting strategies to fund your international education with confidence.',
  },
  '/dashboard/university': {
    title: 'Dashboard University Details | Plan My Admission',
    description:
      'Review shortlisted university information and course insights inside your Plan My Admission dashboard.',
  },
  '/dashboard': {
    title: 'Student Dashboard | Plan My Admission',
    description:
      'Access your personalized Plan My Admission workspace to manage profile details, documents, and recommendations.',
  },
  '/dashboard/profile': {
    title: 'Profile Dashboard | Plan My Admission',
    description:
      'Update your academic history, experience, and preferences to keep your study abroad profile ready for counselors.',
  },
  '/dashboard/recommendations': {
    title: 'University Recommendations | Plan My Admission',
    description:
      'Generate AI-backed university recommendations tailored to your profile and study abroad goals.',
  },
  '/dashboard/documents': {
    title: 'Documents Dashboard | Plan My Admission',
    description:
      'Securely upload, review, and manage the documents required for your international university applications.',
  },
  '/dashboard/shortlisted': {
    title: 'Shortlisted Universities | Plan My Admission',
    description:
      'Track the universities you have shortlisted and review key stats before submitting applications.',
  },
};
export const buildPageMetadata = (path) => {
  const meta = ROUTE_META[path] || {};
  const title = meta.title || DEFAULT_TITLE;
  const description = meta.description || DEFAULT_DESCRIPTION;
  const canonical = `${BASE_URL}${path === '/' ? '' : path}`;
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      title,
      description,
    },
  };
};
