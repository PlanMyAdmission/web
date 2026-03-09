const portalLoginUrl = 'https://portal.planmyadmission.com/login';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: portalLoginUrl,
        permanent: false,
      },
      {
        source: '/dashboard/:path*',
        destination: portalLoginUrl,
        permanent: false,
      },
      {
        source: '/admin/cms',
        destination: '/admin/blogs',
        permanent: true,
      },
      {
        source: '/admin/content',
        destination: '/admin/blogs',
        permanent: true,
      },
      {
        source: '/ai-university-search',
        destination: '/ai-university-matchmaker',
        permanent: true,
      },
      {
        source: '/Navigating-the-American-Campus',
        destination: '/blogs/navigating-the-american-campus',
        permanent: true,
      },
      {
        source: '/Embarking-on-Excellence',
        destination: '/blogs/embarking-on-excellence',
        permanent: true,
      },
      {
        source: '/Pennsylvania-State-University',
        destination: '/blogs/pennsylvania-state-university',
        permanent: true,
      },
      {
        source: '/Mastering-the-Art-of-Financial-Planning',
        destination: '/blogs/mastering-the-art-of-financial-planning',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
