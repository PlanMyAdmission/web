import React from 'react';
import { BLOG_STATUS_LABELS, formatBlogDate } from '@/components/admin/blog/blogHelpers.js';

const BlogPostsList = ({
  isLoading,
  posts,
  selectedPostId,
  onSelectPost,
}) => {
  return (
    <aside className="min-h-0 overflow-hidden border border-main/10 bg-white">
      <div className="border-b border-main/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
        Posts
      </div>
      <div className="min-h-0 divide-y divide-main/8 overflow-y-auto">
        {isLoading ? (
          <div className="px-4 py-6 text-sm text-[#7a6173]">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#7a6173]">No blog posts yet.</div>
        ) : (
          posts.map((post) => {
            const isSelected = post.id === selectedPostId;
            return (
              <button
                key={post.id}
                type="button"
                className={`block w-full px-4 py-4 text-left transition ${
                  isSelected ? 'bg-[#fff6fa]' : 'hover:bg-[#fcfafb]'
                }`}
                onClick={() => onSelectPost(post)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#3f1831]">
                      {post.title || 'Untitled post'}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#8a7385]">
                      /blogs/{post.slug || 'draft-post'}
                    </p>
                  </div>
                  <span className="rounded-md border border-main/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-main/65">
                    {BLOG_STATUS_LABELS[post.status] || BLOG_STATUS_LABELS.draft}
                  </span>
                </div>
                <p className="mt-3 text-xs text-[#7a6173]">
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
