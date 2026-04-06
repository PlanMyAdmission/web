import React from 'react';
import { BLOG_STATUS_LABELS, formatBlogDate } from '@/components/admin/blog/blogHelpers.js';

const BlogPostsList = ({ isLoading, posts, selectedPostId, onSelectPost }) => {
  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#e5e5e5]">
      <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
          Posts
        </p>
      </div>

      <div className="pma-admin-scroll min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="px-5 py-6 text-sm text-[#777777]">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="px-5 py-6 text-sm text-[#777777]">No blog posts yet.</div>
        ) : (
          posts.map((post) => {
            const isSelected = post.id === selectedPostId;

            return (
              <button
                key={post.id}
                type="button"
                className={`block w-full border-b border-[#f0f0f0] px-5 py-4 text-left transition-colors last:border-b-0 ${
                  isSelected ? 'bg-[#fafafa]' : 'bg-white hover:bg-[#fafafa]'
                }`}
                onClick={() => onSelectPost(post)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#111111]">
                      {post.title || 'Untitled post'}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[#888888]">
                      /blogs/{post.slug || 'draft-post'}
                    </p>
                  </div>
                  <span className="inline-block rounded-full border border-[#e5e5e5] bg-[#fafafa] px-2.5 py-0.5 text-xs font-medium text-[#555555]">
                    {BLOG_STATUS_LABELS[post.status] || BLOG_STATUS_LABELS.draft}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#666666]">
                  {post.metaDescription || post.content || 'No preview text yet.'}
                </p>
                <p className="mt-2 text-[11px] text-[#888888]">
                  {formatBlogDate(post.updatedAt || post.createdAt)}
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default BlogPostsList;
