'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@context/AuthProvider';
import { adminRequest } from '@lib/adminApiClient.js';
import { trackAdminAction } from '@lib/analytics.js';
import { fileToBase64 } from '@lib/clientUtils.js';
import {
  createBlogExcerpt,
  normalizeBlogSlug,
  sanitizeBlogText,
} from '@lib/blogsShared.js';
import AdminPageFrame from '@/components/admin/AdminPageFrame.jsx';
import BlogEditorForm from '@/components/admin/blog/BlogEditorForm.jsx';
import BlogPostsList from '@/components/admin/blog/BlogPostsList.jsx';
import { BLOG_STATUS_LABELS, EMPTY_BLOG_FORM } from '@/components/admin/blog/blogHelpers.js';

const BlogAdminPanel = () => {
  const { authLoading, adminLoading, currentUser, isAdminUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [form, setForm] = useState(EMPTY_BLOG_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadPosts = useCallback(async () => {
    if (!currentUser || !isAdminUser) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const payload = await adminRequest({
        currentUser,
        url: '/api/admin/blogs',
      });
      setPosts(Array.isArray(payload?.posts) ? payload.posts : []);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to load blog posts.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, isAdminUser]);

  useEffect(() => {
    if (authLoading || adminLoading) {
      return;
    }

    if (!isAdminUser) {
      setIsLoading(false);
      return;
    }

    loadPosts();
  }, [adminLoading, authLoading, isAdminUser, loadPosts]);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) || null,
    [posts, selectedPostId],
  );

  const postStats = useMemo(
    () =>
      posts.reduce(
        (totals, post) => {
          const status = post?.status === 'published' ? 'published' : 'draft';
          totals[status] += 1;
          return totals;
        },
        {
          draft: 0,
          published: 0,
        },
      ),
    [posts],
  );

  useEffect(() => {
    if (!selectedPost) {
      return;
    }

    setForm({
      id: selectedPost.id,
      title: selectedPost.title || '',
      slug: selectedPost.slug || '',
      coverImageUrl: selectedPost.coverImageUrl || '',
      content: selectedPost.content || '',
      metaTitle: selectedPost.metaTitle || '',
      metaDescription: selectedPost.metaDescription || '',
      status: selectedPost.status === 'published' ? 'published' : 'draft',
    });
    setCoverFile(null);
    setSlugTouched(true);
  }, [selectedPost]);

  const handleCreateNew = () => {
    trackAdminAction({ action: 'create_post', target: 'blog', status: 'started' });
    setSelectedPostId('');
    setForm(EMPTY_BLOG_FORM);
    setCoverFile(null);
    setSlugTouched(false);
    setErrorMessage('');
  };

  const handleFieldChange = (field, value) => {
    setForm((current) => {
      if (field === 'title') {
        return {
          ...current,
          title: value,
          slug: slugTouched ? current.slug : normalizeBlogSlug(value),
        };
      }

      if (field === 'slug') {
        return {
          ...current,
          slug: normalizeBlogSlug(value),
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const handleSave = async () => {
    const title = sanitizeBlogText(form.title);
    const slug = normalizeBlogSlug(form.slug || title);
    const content = sanitizeBlogText(form.content);
    const metaTitle = sanitizeBlogText(form.metaTitle) || title;
    const metaDescription =
      sanitizeBlogText(form.metaDescription) || createBlogExcerpt(content, 155);

    if (!title || !slug || !content) {
      setErrorMessage('Title, slug, and content are required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      if (coverFile && coverFile.size > 5 * 1024 * 1024) {
        throw new Error('Cover image must be smaller than 5 MB.');
      }

      const payload = await adminRequest({
        currentUser,
        url: '/api/admin/blogs',
        method: 'POST',
        body: {
          id: form.id || '',
          title,
          slug,
          content,
          metaTitle,
          metaDescription,
          status: form.status === 'published' ? 'published' : 'draft',
          coverImageUrl: form.coverImageUrl || '',
          coverUpload: coverFile
            ? {
                base64: await fileToBase64(coverFile),
                mimeType: coverFile.type || 'image/jpeg',
                fileName: coverFile.name || `${slug}.jpg`,
              }
            : null,
        },
      });

      const savedPost = payload?.post;
      if (!savedPost?.id) {
        throw new Error('Saved blog post response is invalid.');
      }

      setSelectedPostId(savedPost.id);
      await loadPosts();
      toast.success(form.id ? 'Blog post updated.' : 'Blog post created.');
      trackAdminAction({ action: 'save_post', target: 'blog', status: form.status });
      setCoverFile(null);
      setSlugTouched(true);
    } catch (error) {
      trackAdminAction({ action: 'save_post', target: 'blog', status: 'error' });
      setErrorMessage(error?.message || 'Failed to save blog post.');
      toast.error(error?.message || 'Failed to save blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || adminLoading || !currentUser || !isAdminUser) {
    return null;
  }

  return (
    <AdminPageFrame
      eyebrow="Editorial Workspace"
      title="Publishing studio"
      description="Treat blog management like an editorial desk: keep the post list visible, edit in one clean surface, and make publish status obvious."
      stats={[
        {
          label: 'Posts',
          value: posts.length,
          helper: 'All stored articles',
        },
        {
          label: 'Drafts',
          value: postStats.draft,
          helper: 'Still being shaped',
        },
        {
          label: 'Published',
          value: postStats.published,
          helper: 'Currently live',
        },
        {
          label: 'Current',
          value: BLOG_STATUS_LABELS[form.status] || BLOG_STATUS_LABELS.draft,
          helper: selectedPost ? 'Selected article state' : 'Fresh draft',
        },
      ]}
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-sm leading-6 text-[#777777]">
            Keep titles, slugs, and metadata tight before publishing.
          </div>
          <button
            type="button"
            className="rounded-lg bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#222222]"
            onClick={handleCreateNew}
          >
            New Draft
          </button>
        </div>
      }
      errorMessage={errorMessage}
    >
      <div className="grid h-full min-h-0 gap-4 p-3 md:p-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <BlogPostsList
          isLoading={isLoading}
          posts={posts}
          selectedPostId={selectedPostId}
          onSelectPost={(post) => {
            setSelectedPostId(post.id);
            setErrorMessage('');
          }}
        />

        <BlogEditorForm
          form={form}
          coverFile={coverFile}
          errorMessage=""
          isSaving={isSaving}
          onFieldChange={handleFieldChange}
          onCoverChange={(event) => setCoverFile(event.target.files?.[0] || null)}
          onSlugChange={(value) => {
            setSlugTouched(true);
            handleFieldChange('slug', value);
          }}
          onSave={handleSave}
        />
      </div>
    </AdminPageFrame>
  );
};

export default BlogAdminPanel;
