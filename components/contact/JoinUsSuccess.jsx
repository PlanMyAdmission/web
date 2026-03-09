import React from 'react';
import Link from 'next/link';

const JoinUsSuccess = () => (
  <div className="flex flex-col justify-center items-center text-center py-8">
    <div className="mb-4">
      <svg className="w-16 h-16 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-main mb-2">Thank You!</h3>
    <p className="text-gray-700 text-sm px-4 mb-4">
      Thanks for submitting your interest. Our team will connect with you shortly.
      <br /> In the meantime explore our{' '}
      <Link style={{ textDecoration: 'underline', color: 'blue' }} href="/ai-university-matchmaker">
        AI University Matchmaker
      </Link>
    </p>
  </div>
);

export default JoinUsSuccess;
