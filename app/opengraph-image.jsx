import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '@/lib/seo';
import { buildOgImage, contentType, ogImageSize } from '@/lib/seo/ogImage';

export { contentType };
export const runtime = 'nodejs';
export const size = ogImageSize;
export const alt = DEFAULT_TITLE;

export default async function OpenGraphImage() {
  return buildOgImage({
    title: 'Study abroad guidance that feels clear, modern, and practical',
    description: DEFAULT_DESCRIPTION,
  });
}
