import 'server-only';

import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'ul',
  'ol',
  'li',
  'blockquote',
  'strong',
  'em',
  'b',
  'i',
  'u',
  's',
  'br',
  'hr',
  'code',
  'pre',
  'figure',
  'figcaption',
  'img',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'span',
  'div',
];

const ALLOWED_ATTRIBUTES = {
  a: ['href', 'name', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  th: ['scope', 'colspan', 'rowspan'],
  td: ['colspan', 'rowspan'],
  '*': ['id'],
};

const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel'];

const linkTransform = (tagName, attribs) => {
  const href = attribs.href || '';
  const isExternal = /^https?:\/\//i.test(href);
  return {
    tagName,
    attribs: {
      ...attribs,
      ...(isExternal
        ? { target: '_blank', rel: 'noopener noreferrer nofollow' }
        : {}),
    },
  };
};

const SANITIZE_OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedSchemes: ALLOWED_SCHEMES,
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  allowProtocolRelative: false,
  transformTags: {
    a: linkTransform,
  },
  exclusiveFilter: (frame) => frame.tag === 'a' && !frame.attribs.href,
};

const slugify = (value = '') =>
  `${value || ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const stripTags = (value = '') =>
  `${value || ''}`
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const HEADING_RE = /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi;
const ID_ATTR_RE = /\sid=["']([^"']+)["']/i;

const injectHeadingIds = (html) => {
  const headings = [];

  const out = html.replace(HEADING_RE, (match, attrs = '', inner = '') => {
    const text = stripTags(inner);
    if (!text) return match;

    const existingId = attrs ? attrs.match(ID_ATTR_RE)?.[1] || null : null;
    const baseId =
      existingId || slugify(text) || `section-${headings.length + 1}`;
    const uniqueId = `blog-${baseId}-${headings.length + 1}`;

    headings.push({ id: uniqueId, text });

    const nextAttrs = existingId
      ? attrs.replace(ID_ATTR_RE, ` id="${uniqueId}"`)
      : `${attrs || ''} id="${uniqueId}"`;

    return `<h2${nextAttrs} class="scroll-mt-28">${inner}</h2>`;
  });

  return { html: out, headings };
};

export const sanitizeBlogHtml = (dirty = '') => {
  const clean = sanitizeHtml(`${dirty || ''}`, SANITIZE_OPTIONS);
  return injectHeadingIds(clean);
};

export const htmlToPlainText = (dirty = '') =>
  sanitizeHtml(`${dirty || ''}`, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
