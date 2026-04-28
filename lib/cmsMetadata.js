import 'server-only';

import {
  BASE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_IMAGE,
  SITE_NAME,
  isProductionCrawlAllowed,
} from '@/lib/seo';

const getCmsRobots = (noIndex = false) => {
  if (!isProductionCrawlAllowed() || noIndex) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }

  return {
    index: true,
    follow: true,
  };
};

export const buildCmsMetadata = ({
  path,
  title,
  description,
  noIndex = false,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  twitterImage = DEFAULT_TWITTER_IMAGE,
  keywords,
  publishedTime,
  modifiedTime,
  authors,
}) => {
  const canonical = `${BASE_URL}${path}`;
  const resolvedTitle = title || SITE_NAME;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const imageUrl =
    typeof image === 'string' && image
      ? image.startsWith('http')
        ? image
        : `${BASE_URL}${image}`
      : null;
  const twitterImageUrl =
    typeof twitterImage === 'string' && twitterImage
      ? twitterImage.startsWith('http')
        ? twitterImage
        : `${BASE_URL}${twitterImage}`
      : null;

  const isArticle = type === 'article';
  const articleAuthors =
    Array.isArray(authors) && authors.length > 0 ? authors : [SITE_NAME];

  return {
    title: {
      absolute: resolvedTitle,
    },
    description: resolvedDescription,
    ...(Array.isArray(keywords) && keywords.length > 0 ? { keywords } : {}),
    ...(isArticle ? { authors: articleAuthors.map((name) => ({ name })) } : {}),
    alternates: {
      canonical,
    },
    robots: getCmsRobots(noIndex),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      type,
      siteName: SITE_NAME,
      ...(isArticle && publishedTime ? { publishedTime } : {}),
      ...(isArticle && modifiedTime ? { modifiedTime } : {}),
      ...(isArticle ? { authors: articleAuthors } : {}),
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: resolvedTitle,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      ...(twitterImageUrl ? { images: [twitterImageUrl] } : {}),
    },
  };
};
