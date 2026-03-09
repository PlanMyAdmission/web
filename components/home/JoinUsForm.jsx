'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@lib/analytics.js';
import { reportError } from '@lib/logger.js';
import {
  buildFullPhoneNumber,
  COUNTRY_DIAL_CODE_OPTIONS,
  normalizeCountryDialCode,
  normalizePhoneNumber,
  persistSubmission,
  readRecentSubmission,
  SUBMISSION_COOLDOWN_MS,
} from '@components/contact/joinUsFormHelpers.js';

const JoinUsForm = ({ className = '', sourcePage = 'unknown' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCountryCode: '+91',
    phoneNumber: '',
    honeypot: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  useEffect(() => {
    const lastSubmissionAt = readRecentSubmission();
    if (lastSubmissionAt && Date.now() - lastSubmissionAt < SUBMISSION_COOLDOWN_MS) {
      setIsSubmitted(true);
    }
  }, []);

  const validateForm = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedCountryDialCode = normalizeCountryDialCode(formData.phoneCountryCode);
    const normalizedPhoneNumber = normalizePhoneNumber(formData.phoneNumber);

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!normalizedCountryDialCode) {
      nextErrors.phoneCountryCode = 'Country code is required';
    } else if (!/^\+\d{1,4}$/.test(normalizedCountryDialCode)) {
      nextErrors.phoneCountryCode = 'Please choose a valid country code';
    }

    if (!normalizedPhoneNumber) {
      nextErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{6,15}$/.test(normalizedPhoneNumber)) {
      nextErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!agreed) {
      nextErrors.agreed = 'You must agree to be contacted to proceed';
    }

    return nextErrors;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phoneCountryCode: '+91',
      phoneNumber: '',
      honeypot: '',
    });
    setAgreed(false);
    setErrors({});
    setFormStartedAt(Date.now());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    trackEvent('lead_submit', {
      source: 'join_us',
      surface: sourcePage,
      status: 'started',
    });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'join_us',
          sourcePage,
          name: formData.name,
          email: formData.email,
          phoneCountryCode: formData.phoneCountryCode,
          phoneNumber: formData.phoneNumber,
          leadContext: {
            honeypot: formData.honeypot,
            formStartedAt,
          },
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || 'Something went wrong. Please try again.');
      }

      persistSubmission({
        source: 'join_us',
        sourcePage,
        name: formData.name,
        email: formData.email,
        phone: buildFullPhoneNumber(formData.phoneCountryCode, formData.phoneNumber),
      });
      trackEvent('lead_submit', {
        source: 'join_us',
        surface: sourcePage,
        status: 'success',
      });
      resetForm();
      setIsSubmitted(true);
    } catch (error) {
      reportError('Error submitting Join Us lead:', error);
      trackEvent('lead_submit', {
        source: 'join_us',
        surface: sourcePage,
        status: 'error',
      });
      setErrors({
        submit: error?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`py-8 bg-light rounded-lg mb-2 ${className}`}>
      {!isSubmitted ? (
        <form className="flex flex-col justify-center items-center space-y-5" onSubmit={handleSubmit}>
          <div className="w-[90%]">
            <input
              type="text"
              id="name"
              value={formData.name}
              placeholder="Name"
              className={`py-4 px-3 rounded-md w-full outline-none bg-white border ${errors.name ? 'border-red-500' : 'border-[#e8dde3]'}`}
              onChange={(event) =>
                setFormData((current) => ({ ...current, name: event.target.value }))
              }
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="w-[90%] grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div>
              <select
                id="phone-country-code"
                value={formData.phoneCountryCode}
                className={`py-4 px-3 rounded-md w-full outline-none bg-white border ${errors.phoneCountryCode ? 'border-red-500' : 'border-[#e8dde3]'}`}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    phoneCountryCode: event.target.value,
                  }))
                }
              >
                {COUNTRY_DIAL_CODE_OPTIONS.map((option) => (
                  <option key={`${option.label}-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.phoneCountryCode && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneCountryCode}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                id="phone-number"
                value={formData.phoneNumber}
                placeholder="Phone number"
                className={`py-4 px-3 rounded-md w-full outline-none bg-white border ${errors.phoneNumber ? 'border-red-500' : 'border-[#e8dde3]'}`}
                inputMode="numeric"
                maxLength={15}
                autoComplete="tel-national"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    phoneNumber: normalizePhoneNumber(event.target.value),
                  }))
                }
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="w-[90%]">
            <input
              type="email"
              id="email"
              value={formData.email}
              placeholder="Email"
              className={`py-4 px-3 rounded-md w-full outline-none bg-white border ${errors.email ? 'border-red-500' : 'border-[#e8dde3]'}`}
              onChange={(event) =>
                setFormData((current) => ({ ...current, email: event.target.value }))
              }
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={(event) =>
                setFormData((current) => ({ ...current, honeypot: event.target.value }))
              }
            />
          </div>

          <div className="w-[90%]">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className={`mt-1 w-4 h-4 text-main bg-white border-gray-300 rounded focus:ring-main focus:ring-2 ${errors.agreed ? 'border-red-500' : ''}`}
              />
              <label htmlFor="agreement" className="text-gray-700 text-sm leading-tight">
                I authorize PlanMyAdmission to contact me via Email/SMS/WhatsApp/Call.
              </label>
            </div>
            {errors.agreed && <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>}
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

          <button
            type="submit"
            className={`bg-main px-4 py-4 rounded-md text-white w-[90%] transition-colors flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-main/90'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Starting...
              </>
            ) : (
              'Start Your Overseas Journey'
            )}
          </button>
        </form>
      ) : (
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
      )}
    </div>
  );
};

export default JoinUsForm;
