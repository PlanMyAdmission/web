export const EMPTY_BLOG_FORM = {
  id: '',
  title: '',
  slug: '',
  coverImageUrl: '',
  content: '',
  metaTitle: '',
  metaDescription: '',
  status: 'draft',
};

export const BLOG_STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
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

export const formatBlogDate = (value) => {
  const date = toDate(value);
  if (!date) {
    return '—';
  }

  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
