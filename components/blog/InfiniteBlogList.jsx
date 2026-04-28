'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import BlogCard from '@/components/blog/BlogCard.jsx';
import { loadMoreBlogs } from '@/lib/blog/actions.js';

const InfiniteBlogList = ({ initialItems, initialCursor, initialHasMore }) => {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const seenIds = useRef(new Set(initialItems.map((item) => item.id)));

  const fetchNext = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);
    setError(null);
    try {
      const page = await loadMoreBlogs(cursor);
      const fresh = page.items.filter((item) => {
        if (seenIds.current.has(item.id)) return false;
        seenIds.current.add(item.id);
        return true;
      });
      setItems((prev) => [...prev, ...fresh]);
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch {
      setError('Could not load more blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          fetchNext();
        }
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNext, hasMore]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        {items.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="mt-8 flex items-center justify-center py-6 text-sm text-[#6f556f]"
        >
          {loading ? 'Loading more articles…' : 'Scroll to load more'}
        </div>
      )}

      {error && (
        <div className="mt-6 flex flex-col items-center gap-3 text-sm text-main">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchNext}
            className="rounded-full bg-main px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="mt-8 text-center text-sm text-[#6f556f]">
          You're all caught up.
        </p>
      )}
    </>
  );
};

export default InfiniteBlogList;
