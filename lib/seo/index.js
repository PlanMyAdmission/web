import { ROUTE_META } from '@/lib/seo/routes.js';

export const BASE_URL = 'https://www.planmyadmission.com';
export const SITE_NAME = 'Plan My Admission';
export const DEFAULT_OG_IMAGE = '/opengraph-image';
export const DEFAULT_TWITTER_IMAGE = '/twitter-image';
export const DEFAULT_TITLE =
  'Plan My Admission | Study Abroad & Admissions Guidance';
export const DEFAULT_DESCRIPTION =
  'Plan My Admission offers expert overseas education consulting with personalized university admissions guidance, student visa support, and AI-powered tools to simplify your study abroad journey.';

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
    title: {
      absolute: title,
    },
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
      images: [DEFAULT_TWITTER_IMAGE],
    },
  };
};
