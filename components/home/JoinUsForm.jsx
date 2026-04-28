'use client';

import React, { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics/events.js';
import { reportError } from '@/lib/observability/logger.js';
import { submitLead } from '@/lib/leads/actions.js';
import {
  buildFullPhoneNumber,
  normalizeCountryDialCode,
  persistSubmission,
  readRecentSubmission,
  SUBMISSION_COOLDOWN_MS,
} from '@/lib/leads/form.js';
import JoinUsPhoneFields from '@/components/contact/JoinUsPhoneFields.jsx';
import JoinUsSuccess from '@/components/contact/JoinUsSuccess.jsx';

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
    if (
      lastSubmissionAt &&
      Date.now() - lastSubmissionAt < SUBMISSION_COOLDOWN_MS
    ) {
      setIsSubmitted(true);
    }
  }, []);

  const validateForm = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedCountryDialCode = normalizeCountryDialCode(
      formData.phoneCountryCode,
    );

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

    if (!formData.phoneNumber) {
      nextErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{6,15}$/.test(formData.phoneNumber)) {
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
      const result = await submitLead({
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
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      persistSubmission({
        source: 'join_us',
        sourcePage,
        name: formData.name,
        email: formData.email,
        phone: buildFullPhoneNumber(
          formData.phoneCountryCode,
          formData.phoneNumber,
        ),
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
        <form
          className="flex flex-col justify-center items-center space-y-5"
          onSubmit={handleSubmit}
        >
          <div className="w-[90%]">
            <input
              type="text"
              id="name"
              value={formData.name}
              placeholder="Name"
              className={`py-4 px-3 rounded-md w-full outline-none bg-white border ${errors.name ? 'border-red-500' : 'border-[#e8dde3]'}`}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <JoinUsPhoneFields
            formData={formData}
            errors={errors}
            onChange={(field, value) =>
              setFormData((current) => ({ ...current, [field]: value }))
            }
          />

          <div className="w-[90%]">
            <input
              type="email"
              id="email"
              value={formData.email}
              placeholder="Email"
              className={`py-4 px-3 rounded-md w-full outline-none bg-white border ${errors.email ? 'border-red-500' : 'border-[#e8dde3]'}`}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  honeypot: event.target.value,
                }))
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
              <label
                htmlFor="agreement"
                className="text-gray-700 text-sm leading-tight"
              >
                I authorize PlanMyAdmission to contact me via
                Email/SMS/WhatsApp/Call.
              </label>
            </div>
            {errors.agreed && (
              <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

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
        <JoinUsSuccess />
      )}
    </div>
  );
};

export default JoinUsForm;
