'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  BASE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  getCanonicalUrl,
  getRouteMeta,
} from '@lib/seo';

const SchemaOrg = () => {
  const pathname = usePathname() || '/';
  const routeMeta = getRouteMeta(pathname);
  const pageTitle = routeMeta.title || DEFAULT_TITLE;
  const pageDescription = routeMeta.description || DEFAULT_DESCRIPTION;
  const canonicalUrl = getCanonicalUrl(pathname);

  const organizationSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/images/brand/logo.svg`,
      sameAs: [],
    }),
    [],
  );

  const websiteSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/explore?topic={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
    [],
  );

  const webPageSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: BASE_URL,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${BASE_URL}${DEFAULT_OG_IMAGE}`,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: BASE_URL,
      },
      inLanguage: 'en-US',
    }),
    [canonicalUrl, pageDescription, pageTitle],
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
    </>
  );
};

export default SchemaOrg;
