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
    ];
  },
};

export default nextConfig;
