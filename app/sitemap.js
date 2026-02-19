import { BASE_URL } from '@lib/seo';

const publicRoutes = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/home', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/how-it-works', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/explore', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/explore/university', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/ai-university-search', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/recommendations', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/blogs', changeFrequency: 'weekly', priority: 0.8 },
  {
    path: '/Embarking-on-Excellence',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/Mastering-the-Art-of-Financial-Planning',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/Navigating-the-American-Campus',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/Pennsylvania-State-University',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  { path: '/for-institutions', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: 0.4 },
];

export default function sitemap() {
  const now = new Date();
  return publicRoutes.map((route) => ({
    url: `${BASE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
