import Image from 'next/image';
import React from 'react';

const inputClassName =
  'mt-2 w-full rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#999999]';

const textareaClassName =
  'mt-2 w-full rounded-lg border border-[#e5e5e5] bg-white px-4 py-4 text-sm leading-7 text-[#111111] outline-none transition focus:border-[#999999]';

const Section = ({ title, children }) => (
  <section className="rounded-xl border border-[#e5e5e5] bg-white">
    <div className="border-b border-[#f0f0f0] px-4 py-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#888888]">{title}</h3>
    </div>
    <div className="px-4 py-4">{children}</div>
  </section>
);

const BlogEditorForm = ({
  form,
  coverFile,
  errorMessage,
  isSaving,
  onFieldChange,
  onCoverChange,
  onSlugChange,
  onSave,
}) => {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#e5e5e5]">
      {errorMessage ? (
        <div className="border-b border-[#f0d4d4] bg-[#fff8f8] px-5 py-3 text-sm text-[#9a4444]">
          {errorMessage}
        </div>
      ) : null}

      <div className="border-b border-[#e5e5e5] px-5 py-4">
        <p className="text-sm font-semibold text-[#111111]">{form.title || 'Untitled draft'}</p>
        <p className="mt-1 text-xs text-[#888888]">/blogs/{form.slug || 'draft-post'}</p>
      </div>

      <div className="pma-admin-scroll min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#fafafa] p-4">
        <Section title="Post">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px]">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
                Title
              </label>
              <input
                type="text"
                className={inputClassName}
                value={form.title}
                onChange={(event) => onFieldChange('title', event.target.value)}
                placeholder="Study abroad guide title"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
                Status
              </label>
              <select
                className={inputClassName}
                value={form.status}
                onChange={(event) => onFieldChange('status', event.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Slug
            </label>
            <input
              type="text"
              className={inputClassName}
              value={form.slug}
              onChange={(event) => onSlugChange(event.target.value)}
              placeholder="study-abroad-guide"
            />
          </div>
        </Section>

        <Section title="Content">
          <textarea
            className={`${textareaClassName} min-h-[420px]`}
            value={form.content}
            onChange={(event) => onFieldChange('content', event.target.value)}
            placeholder="Write the article content here. Each paragraph can be separated with a blank line."
          />
        </Section>

        <Section title="Metadata">
          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
                Meta Title
              </label>
              <input
                type="text"
                className={inputClassName}
                value={form.metaTitle}
                onChange={(event) => onFieldChange('metaTitle', event.target.value)}
                placeholder="SEO title"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
                Meta Description
              </label>
              <textarea
                className={`${textareaClassName} min-h-[132px]`}
                value={form.metaDescription}
                onChange={(event) => onFieldChange('metaDescription', event.target.value)}
                placeholder="SEO description"
              />
            </div>
          </div>
        </Section>

        <Section title="Cover Image">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-[#111111] file:mr-4 file:rounded-lg file:border-0 file:bg-[#f3f3f3] file:px-4 file:py-3 file:text-sm file:font-medium file:text-[#111111]"
            onChange={onCoverChange}
          />

          {coverFile ? (
            <p className="mt-3 text-xs text-[#777777]">Selected: {coverFile.name}</p>
          ) : form.coverImageUrl ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-[#e5e5e5] bg-white">
              <Image
                src={form.coverImageUrl}
                alt={form.title || 'Blog cover'}
                width={1200}
                height={630}
                className="h-44 w-full object-cover"
              />
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-[#e5e5e5] bg-[#fafafa] px-4 py-8 text-center text-sm text-[#777777]">
              No cover selected yet.
            </div>
          )}
        </Section>
      </div>

      <div className="border-t border-[#e5e5e5] bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#888888]">Published posts render at `/blogs/slug`.</p>
          <button
            type="button"
            className="rounded-lg bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditorForm;
