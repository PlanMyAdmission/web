import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import {
  handleAdminApiError,
  requireAdminRequest,
  serializeTimestamp,
} from '@lib/adminApiServer.js';
import {
  BLOG_POST_COLLECTION,
  createBlogExcerpt,
  normalizeBlogSlug,
  sanitizeBlogText,
} from '@lib/blogsShared.js';

const MAX_COVER_BYTES = 5 * 1024 * 1024;

const serializePost = (snapshot) => {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    title: data.title || '',
    slug: data.slug || '',
    coverImageUrl: data.coverImageUrl || '',
    content: data.content || '',
    excerpt: data.excerpt || '',
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || '',
    status: data.status === 'published' ? 'published' : 'draft',
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
    publishedAt: serializeTimestamp(data.publishedAt),
    createdBy: data.createdBy || null,
    updatedBy: data.updatedBy || null,
  };
};

const ensureUniqueSlug = async (db, slug, currentId) => {
  const snapshot = await db
    .collection(BLOG_POST_COLLECTION)
    .where('slug', '==', slug)
    .limit(5)
    .get();

  const duplicate = snapshot.docs.find((docSnap) => docSnap.id !== currentId);
  if (duplicate) {
    throw new Error('A blog post already uses this slug.');
  }
};

const getCoverExtension = (fileName = '', mimeType = '') => {
  const explicitExtension = fileName.includes('.')
    ? fileName.split('.').pop()?.toLowerCase()
    : '';

  if (explicitExtension) {
    return explicitExtension;
  }

  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/gif') return 'gif';
  return 'jpg';
};

const uploadCoverImage = async (bucket, coverUpload, slug) => {
  if (!coverUpload?.base64) {
    return '';
  }

  if (!bucket?.name) {
    throw new Error('Storage bucket is not configured.');
  }

  const mimeType = `${coverUpload.mimeType || ''}`.trim().toLowerCase();
  if (!mimeType.startsWith('image/')) {
    throw new Error('Cover image must be an image file.');
  }

  const fileBuffer = Buffer.from(coverUpload.base64, 'base64');
  if (!fileBuffer.length || fileBuffer.length > MAX_COVER_BYTES) {
    throw new Error('Cover image must be smaller than 5 MB.');
  }

  const extension = getCoverExtension(coverUpload.fileName, mimeType);
  const filePath = `blog-covers/${slug}-${Date.now()}.${extension}`;
  const token = crypto.randomUUID();
  const file = bucket.file(filePath);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
};

export async function GET(request) {
  try {
    const { db } = await requireAdminRequest(request);
    const snapshot = await db
      .collection(BLOG_POST_COLLECTION)
      .orderBy('updatedAt', 'desc')
      .limit(200)
      .get();

    return NextResponse.json({
      posts: snapshot.docs.map(serializePost),
    });
  } catch (error) {
    return handleAdminApiError(error);
  }
}

export async function POST(request) {
  try {
    const { db, bucket, decodedToken } = await requireAdminRequest(request);
    const body = await request.json();
    const id = `${body?.id || ''}`.trim();
    const title = sanitizeBlogText(body?.title);
    const slug = normalizeBlogSlug(body?.slug || title);
    const content = sanitizeBlogText(body?.content);
    const metaTitle = sanitizeBlogText(body?.metaTitle) || title;
    const metaDescription =
      sanitizeBlogText(body?.metaDescription) ||
      createBlogExcerpt(content, 155);
    const status = body?.status === 'published' ? 'published' : 'draft';
    const preservedCoverImageUrl = sanitizeBlogText(body?.coverImageUrl);

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required.' },
        { status: 400 },
      );
    }

    await ensureUniqueSlug(db, slug, id || null);

    const postRef = id
      ? db.collection(BLOG_POST_COLLECTION).doc(id)
      : db.collection(BLOG_POST_COLLECTION).doc();
    const existingDoc = id ? await postRef.get() : null;
    const existingData = existingDoc?.exists ? existingDoc.data() || {} : {};
    const coverImageUrl = body?.coverUpload?.base64
      ? await uploadCoverImage(bucket, body.coverUpload, slug)
      : preservedCoverImageUrl || existingData.coverImageUrl || '';

    const payload = {
      title,
      slug,
      content,
      excerpt: createBlogExcerpt(content),
      coverImageUrl,
      metaTitle,
      metaDescription,
      status,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: decodedToken.email || null,
      publishedAt:
        status === 'published'
          ? existingData.publishedAt || FieldValue.serverTimestamp()
          : null,
    };

    if (id && existingDoc?.exists) {
      await postRef.update(payload);
    } else {
      await postRef.set({
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
        createdBy: decodedToken.email || null,
      });
    }

    const savedDoc = await postRef.get();
    return NextResponse.json({ post: serializePost(savedDoc) });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
