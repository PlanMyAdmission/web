import { BASE_URL, SITE_NAME } from '@lib/seo';

const BlogPostSchema = ({ post }) => {
  if (!post?.slug || !post?.title) {
    return null;
  }

  const canonicalUrl = `${BASE_URL}/blogs/${post.slug}`;
  const imageUrl = post.coverImageUrl
    ? post.coverImageUrl.startsWith('http')
      ? post.coverImageUrl
      : `${BASE_URL}${post.coverImageUrl}`
    : `${BASE_URL}/images/seo/og-default.svg`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    image: [imageUrl],
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/brand/logo.svg`,
      },
    },
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    datePublished: post.publishedAtIso || post.updatedAtIso || undefined,
    dateModified: post.updatedAtIso || post.publishedAtIso || undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};

export default BlogPostSchema;
