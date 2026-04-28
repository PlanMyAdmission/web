'use client';

import Link from 'next/link';
import { trackContentClick } from '@/lib/analytics/events.js';

const BlogCardLink = ({ slug }) => {
  const href = `/blogs/${slug}`;

  return (
    <Link
      className="text-main p-3 inline-block"
      href={href}
      onClick={() => {
        trackContentClick({
          contentType: 'blog_post',
          slug,
          location: 'blogs_index',
        });
      }}
    >
      Read More {'>>'}
    </Link>
  );
};

export default BlogCardLink;
