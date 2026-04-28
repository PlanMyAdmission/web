import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo/index.js';
import PublicSiteLayout from '@/components/layout/PublicSiteLayout.jsx';

export const metadata = {
  ...buildPageMetadata('/'),
  title: { absolute: 'Page Not Found | Plan My Admission' },
  description: 'The page you were looking for could not be found.',
};

export default function NotFound() {
  return (
    <PublicSiteLayout>
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-20 text-center">

      {/* 404 glyph */}
      <div className="relative mb-8 select-none">
        <span
          className="text-[8rem] font-black leading-none tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #F40076 0%, #840844 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </span>
        <span className="absolute bottom-3 -right-1 block h-4 w-4 rounded-full bg-main" />
      </div>

      {/* Squiggle accent */}
      <div className="mb-8 h-1.5 w-20 rounded-full bg-gradient-to-r from-main to-blurpink" />

      <h1 className="mb-3 text-3xl font-extrabold text-[#3f1831]">
        This page doesn&rsquo;t exist
      </h1>
      <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-[#6f556f]">
        The page you&rsquo;re looking for may have been moved, renamed, or never
        existed. Let&rsquo;s get you somewhere useful.
      </p>

      {/* CTAs */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-main px-7 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-px hover:bg-[#c9005f]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Go Home
        </Link>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 rounded-full bg-light px-7 py-3 text-sm font-semibold text-[#3f1831] transition-colors hover:bg-[#f0dce7]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Read Our Blog
        </Link>
      </div>

      {/* Suggestion chips */}
      <div className="w-full max-w-lg border-t border-[#f0e6ed] pt-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#b08fa0]">
          Popular pages
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'AI University Matchmaker', href: '/ai-university-matchmaker' },
            { label: 'How It Works', href: '/how-it-works' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'For Institutions', href: '/for-institutions' },
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-[#e8dde3] bg-light px-4 py-1.5 text-sm text-[#3f1831] transition-colors hover:border-main hover:bg-main hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      </main>
    </PublicSiteLayout>
  );
}
