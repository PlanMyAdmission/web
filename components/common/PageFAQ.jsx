'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import FAQ from '@/components/home/FAQ.jsx';
import { getFaqConfigForPath } from '@/lib/seo/faqs.js';

const PageFAQ = () => {
  const pathname = usePathname() || '/';
  const faqConfig = useMemo(() => getFaqConfigForPath(pathname), [pathname]);

  if (!faqConfig?.items?.length) {
    return null;
  }

  return <FAQ data={faqConfig.items} heading={faqConfig.heading} />;
};

export default PageFAQ;
