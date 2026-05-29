'use client';

import Link from 'next/link';

export default function BlogsError({ reset }) {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-20 text-center">
      <style>{`
        @keyframes pmaPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(244,0,118,0.25); }
          50%      { box-shadow: 0 0 0 16px rgba(244,0,118,0); }
        }
        @keyframes pmaBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.2; }
        }
      `}</style>

      <div
        className="mb-7 flex h-24 w-24 items-center justify-center rounded-full text-white"
        style={{
          background: 'linear-gradient(135deg, #F40076 0%, #840844 100%)',
          animation: 'pmaPulse 2.5s ease-in-out infinite',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>

      <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#e8dde3] bg-light px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#840844]">
        <span
          className="h-2 w-2 rounded-full bg-main"
          style={{ animation: 'pmaBlink 1.4s step-start infinite' }}
        />
        Unexpected Error
      </div>

      <h1 className="mb-3 text-3xl font-extrabold text-[#3f1831]">
        Something went wrong
      </h1>
      <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-[#6f556f]">
        Our team has been notified. This is likely a temporary hiccup — please
        try again, and if it keeps happening, reach out to us.
      </p>

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-main px-7 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-px hover:bg-[#c9005f]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          Try Again
        </button>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 rounded-full bg-light px-7 py-3 text-sm font-semibold text-[#3f1831] transition-colors hover:bg-[#f0dce7]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Back to Blogs
        </Link>
      </div>

      <div className="flex w-full max-w-md gap-4 rounded-2xl border border-[#e8dde3] bg-light p-5 text-left">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-main text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4m0 4h.01"/>
          </svg>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-bold text-[#3f1831]">Still stuck?</h3>
          <p className="text-sm leading-relaxed text-[#6f556f]">
            Email us at{' '}
            <a
              href="mailto:hello@planmyadmission.com"
              className="font-semibold text-main hover:underline"
            >
              hello@planmyadmission.com
            </a>
            {' '}or use the chat on the home page.
          </p>
        </div>
      </div>
    </main>
  );
}
