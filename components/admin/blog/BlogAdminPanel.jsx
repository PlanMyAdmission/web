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
import BlogEditorForm from '@/components/admin/blog/BlogEditorForm.jsx';
import BlogPostsList from '@/components/admin/blog/BlogPostsList.jsx';
import { EMPTY_BLOG_FORM } from '@/components/admin/blog/blogHelpers.js';

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
    <section className="flex min-h-full min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between border border-main/10 bg-white px-4 py-3">
        <div>
          <h1 className="text-sm font-semibold text-[#3f1831]">Blogs</h1>
          <p className="mt-1 text-xs text-[#7a6173]">
            Manage published blog posts with image, content, and metadata.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md border border-main/12 px-3 py-2 text-xs font-medium text-main transition hover:bg-[#fff7fb]"
          onClick={handleCreateNew}
        >
          New Post
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
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
          errorMessage={errorMessage}
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
    </section>
  );
};

export default BlogAdminPanel;
