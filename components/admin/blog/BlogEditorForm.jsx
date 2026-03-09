import Image from 'next/image';
import React from 'react';

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
    <div className="min-h-0 overflow-auto border border-main/10 bg-white">
      {errorMessage && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-5 px-4 py-4 md:px-5 md:py-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
              Title
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-md border border-main/12 px-3 py-2 text-sm text-[#442337] outline-none transition focus:border-main/28"
              value={form.title}
              onChange={(event) => onFieldChange('title', event.target.value)}
              placeholder="Study abroad guide title"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
              Status
            </label>
            <select
              className="mt-2 w-full rounded-md border border-main/12 px-3 py-2 text-sm text-[#442337] outline-none transition focus:border-main/28"
              value={form.status}
              onChange={(event) => onFieldChange('status', event.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
              Slug
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-md border border-main/12 px-3 py-2 text-sm text-[#442337] outline-none transition focus:border-main/28"
              value={form.slug}
              onChange={(event) => onSlugChange(event.target.value)}
              placeholder="study-abroad-guide"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm text-[#442337] file:mr-4 file:rounded-md file:border-0 file:bg-[#fff7fb] file:px-3 file:py-2 file:text-sm file:font-medium file:text-main"
              onChange={onCoverChange}
            />
            {coverFile ? (
              <p className="mt-2 text-xs text-[#7a6173]">Selected: {coverFile.name}</p>
            ) : form.coverImageUrl ? (
              <div className="mt-3 overflow-hidden rounded-md border border-main/10">
                <Image
                  src={form.coverImageUrl}
                  alt={form.title || 'Blog cover'}
                  width={1200}
                  height={630}
                  className="h-36 w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
            Content
          </label>
          <textarea
            className="mt-2 min-h-[320px] w-full rounded-md border border-main/12 px-3 py-3 text-sm leading-7 text-[#442337] outline-none transition focus:border-main/28"
            value={form.content}
            onChange={(event) => onFieldChange('content', event.target.value)}
            placeholder="Write the article content here. Each paragraph can be separated with a blank line."
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
              Meta Title
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-md border border-main/12 px-3 py-2 text-sm text-[#442337] outline-none transition focus:border-main/28"
              value={form.metaTitle}
              onChange={(event) => onFieldChange('metaTitle', event.target.value)}
              placeholder="SEO title"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
              Meta Description
            </label>
            <textarea
              className="mt-2 min-h-[108px] w-full rounded-md border border-main/12 px-3 py-2 text-sm leading-7 text-[#442337] outline-none transition focus:border-main/28"
              value={form.metaDescription}
              onChange={(event) => onFieldChange('metaDescription', event.target.value)}
              placeholder="SEO description"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-main/10 pt-4">
          <p className="text-xs text-[#7a6173]">
            Published posts render at <span className="font-medium text-[#3f1831]">/blogs/slug</span>
          </p>
          <button
            type="button"
            className="rounded-md bg-[#3f1831] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2c1022] disabled:cursor-not-allowed disabled:opacity-70"
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
