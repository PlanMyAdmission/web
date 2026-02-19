export const BASE_URL = 'https://planmyadmission.com';
export const SITE_NAME = 'Plan My Admission';
export const DEFAULT_OG_IMAGE = '/images/seo/og-default.svg';
export const DEFAULT_TITLE =
  'Plan My Admission | Study Abroad & Admissions Guidance';
export const DEFAULT_DESCRIPTION =
  'Plan My Admission offers expert overseas education consulting with personalized university admissions guidance, student visa support, and AI-powered tools to simplify your study abroad journey.';
export const ROUTE_META = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    sitemap: {
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  },
  '/home': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    noIndex: true,
    sitemap: false,
  },
  '/contact': {
    title: 'Contact Plan My Admission | Study Abroad Help',
    description:
      'Questions about studying abroad? Contact Plan My Admission for personalized guidance on colleges, courses, exams, and applications.',
    sitemap: {
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  },
  '/about': {
    title: 'About Plan My Admission | Study Abroad Experts',
    description:
      'Meet the team behind your study abroad journey. Learn about our mission and commitment to expert admissions guidance.',
    sitemap: {
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  },
  '/pricing': {
    title: 'Plan My Admission Pricing | Plans & Packages',
    description:
      'Explore Plan My Admission pricing and plans designed for students preparing for study abroad.',
    sitemap: {
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  },
  '/for-institutions': {
    title: 'Plan My Admission for Institutions',
    description:
      'Scale international student admissions with Plan My Admission’s AI-powered tools and counseling support.',
    sitemap: {
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  },
  '/terms&conditions': {
    title: 'Terms & Conditions | Plan My Admission',
    description:
      'Read the terms and conditions for using Plan My Admission services and website.',
    sitemap: false,
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | Plan My Admission',
    description:
      'Read the terms and conditions for using Plan My Admission services and website.',
    sitemap: {
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Plan My Admission',
    description:
      'Learn how Plan My Admission collects, uses, and safeguards your information.',
    sitemap: {
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  },
  '/how-it-works': {
    title: 'How It Works | Plan My Admission',
    description:
      'Understand how Plan My Admission guides you from university selection to admission.',
    sitemap: {
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  },
  '/explore': {
    title: 'Explore Universities | Plan My Admission',
    description:
      'Discover universities, courses, and destinations for your study abroad plans.',
    sitemap: {
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  },
  '/ai-university-search': {
    title: 'AI University Search | Plan My Admission',
    description:
      'Search universities by course and get AI-personalized recommendations from Plan My Admission.',
    sitemap: {
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  },
  '/explore/university': {
    title: 'University Explorer | Plan My Admission',
    description:
      'Explore detailed university profiles and programs to plan your admissions.',
    sitemap: {
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  },
  '/blogs': {
    title: 'Plan My Admission Blog | Study Abroad Insights',
    description:
      'Read the latest study abroad insights, tips, and updates from Plan My Admission.',
    sitemap: {
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  },
  '/recommendations': {
    title: 'Recommendations | Plan My Admission',
    description:
      'View personalized university recommendations based on your profile and goals.',
    sitemap: {
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  },
  '/Navigating-the-American-Campus': {
    title:
      "Navigating the American Campus: A Student's Guide to Living in the USA",
    description:
      'Explore practical insights for thriving on American campuses, from housing tips to cultural integration strategies.',
    type: 'article',
    sitemap: {
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  },
  '/Embarking-on-Excellence': {
    title: 'Embarking on Excellence | A Comprehensive Guide to Studying Abroad',
    description:
      'Plan your overseas education journey with expert advice on applications, scholarships, and campus life.',
    type: 'article',
    sitemap: {
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  },
  '/Pennsylvania-State-University': {
    title:
      'Pennsylvania State University | Elevating Education to Unparalleled Heights',
    description:
      'Discover what makes Penn State a top choice for international students seeking academic excellence.',
    type: 'article',
    sitemap: {
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  },
  '/Mastering-the-Art-of-Financial-Planning': {
    title:
      'Mastering the Art of Financial Planning for Your Study Abroad Adventure',
    description:
      'Learn smart budgeting strategies to fund your international education with confidence.',
    type: 'article',
    sitemap: {
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  },
  '/dashboard/university': {
    title: 'Dashboard University Details | Plan My Admission',
    description:
      'Review shortlisted university information and course insights inside your Plan My Admission dashboard.',
    noIndex: true,
    sitemap: false,
  },
  '/dashboard': {
    title: 'Student Dashboard | Plan My Admission',
    description:
      'Access your personalized Plan My Admission workspace to manage profile details, documents, and recommendations.',
    noIndex: true,
    sitemap: false,
  },
  '/dashboard/profile': {
    title: 'Profile Dashboard | Plan My Admission',
    description:
      'Update your academic history, experience, and preferences to keep your study abroad profile ready for counselors.',
    noIndex: true,
    sitemap: false,
  },
  '/dashboard/recommendations': {
    title: 'University Recommendations | Plan My Admission',
    description:
      'Generate AI-backed university recommendations tailored to your profile and study abroad goals.',
    noIndex: true,
    sitemap: false,
  },
  '/dashboard/documents': {
    title: 'Documents Dashboard | Plan My Admission',
    description:
      'Securely upload, review, and manage the documents required for your international university applications.',
    noIndex: true,
    sitemap: false,
  },
  '/dashboard/shortlisted': {
    title: 'Shortlisted Universities | Plan My Admission',
    description:
      'Track the universities you have shortlisted and review key stats before submitting applications.',
    noIndex: true,
    sitemap: false,
  },
};

export const getCanonicalUrl = (path = '/') => {
  const normalizedPath = path === '/' ? '' : path;
  return `${BASE_URL}${normalizedPath}`;
};

export const getRouteMeta = (path = '/') => {
  return ROUTE_META[path] || {};
};

export const isDashboardPath = (path = '/') => path.startsWith('/dashboard');

export const isProductionCrawlAllowed = () => {
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === 'production';
  }
  return process.env.NODE_ENV === 'production';
};

export const getRobotsDirectives = (path = '/') => {
  const routeMeta = getRouteMeta(path);
  const shouldNoIndex =
    !isProductionCrawlAllowed() ||
    routeMeta.noIndex === true ||
    isDashboardPath(path);

  return shouldNoIndex
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      }
    : {
        index: true,
        follow: true,
      };
};

export const getSitemapEntries = () => {
  const now = new Date();
  return Object.entries(ROUTE_META)
    .filter(([path, meta]) => meta.sitemap !== false && !isDashboardPath(path))
    .map(([path, meta]) => {
      const sitemapConfig = meta.sitemap || {};
      return {
        url: getCanonicalUrl(path),
        lastModified: now,
        changeFrequency: sitemapConfig.changeFrequency || 'monthly',
        priority: sitemapConfig.priority || 0.5,
      };
    });
};

export const buildPageMetadata = (path) => {
  const meta = getRouteMeta(path);
  const title = meta.title || DEFAULT_TITLE;
  const description = meta.description || DEFAULT_DESCRIPTION;
  const canonical = getCanonicalUrl(path);
  const pageType = meta.type || 'website';

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: getRobotsDirectives(path),
    openGraph: {
      title,
      description,
      url: canonical,
      type: pageType,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
};
