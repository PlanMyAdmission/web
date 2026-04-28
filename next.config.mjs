const portalLoginUrl = 'https://portal.planmyadmission.com/login';
const portalSignupUrl = 'https://portal.planmyadmission.com/sign-up';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'api.planmyadmission.com',
      },
      {
        protocol: 'https',
        hostname: 'staging.api.planmyadmission.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
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
        source: '/login',
        destination: portalLoginUrl,
        permanent: false,
      },
      {
        source: '/register',
        destination: portalSignupUrl,
        permanent: false,
      },
      {
        source: '/sign-up',
        destination: portalSignupUrl,
        permanent: false,
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
        source: '/terms&conditions',
        destination: '/terms-and-conditions',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/',
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
