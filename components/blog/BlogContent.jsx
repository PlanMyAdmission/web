import 'server-only';

import { sanitizeBlogHtml } from '@/lib/blog/sanitize.js';

const TableOfContents = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <nav
      aria-label="Table of contents"
      className="mt-8 rounded-[24px] bg-light px-5 py-5 md:px-6"
    >
      <p className="text-xl font-semibold text-[#3f1831] md:text-2xl">
        Table of Contents
      </p>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex gap-3 text-sm text-main transition hover:opacity-80 md:text-base"
            >
              <span className="font-semibold">{index + 1}.</span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

const BlogContent = ({ html: rawHtml }) => {
  const { html, headings } = sanitizeBlogHtml(rawHtml);

  return (
    <>
      <TableOfContents items={headings} />
      <div
        className="blog-content mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default BlogContent;
