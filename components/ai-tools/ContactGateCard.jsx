'use client';

import React, { useState } from 'react';
import { gatewayPost } from '@/lib/browser/client.js';
import { trackAiToolEvent } from '@/lib/analytics/events.js';

const COUNTRY_CODES = [
  { code: '+91', label: 'IN' },
  { code: '+1', label: 'US' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'AU' },
  { code: '+971', label: 'AE' },
];

const sanitizePhone = (value) => value.replace(/[^\d]/g, '').slice(0, 15);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const inputClass =
  'py-3 px-3 rounded-md w-full outline-none bg-white border text-[#3f1831] placeholder:text-gray-400';

const ContactGateCard = ({
  toolName,
  runId,
  title = 'Get your full report',
  subtitle = 'We will send the full report to your WhatsApp and email — free, instant.',
  primaryCta = 'Send me my report',
  onSaved,
  onError,
}) => {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [isParent, setIsParent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!runId) {
      setError('We could not match your report. Please try generating it again.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    const cleanPhone = sanitizePhone(phone);
    if (cleanPhone.length < 6) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (email && !isEmail(email)) {
      setError('Please enter a valid email or leave it blank.');
      return;
    }

    setSubmitting(true);
    trackAiToolEvent({
      toolName,
      action: 'contact_card_submit',
      status: 'started',
    });

    try {
      const data = await gatewayPost('/tools/runs/save', {
        runId,
        name: name.trim(),
        phone: `${countryCode} ${cleanPhone}`,
        email: email.trim() || null,
        whatsappOptIn,
        isParent,
      });
      trackAiToolEvent({
        toolName,
        action: 'contact_card_submit',
        status: 'success',
      });
      onSaved?.(data);
    } catch (err) {
      const message = err?.message || 'Could not save your details. Please retry.';
      trackAiToolEvent({
        toolName,
        action: 'contact_card_submit',
        status: 'error',
      });
      setError(message);
      onError?.(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-md border border-[#e8dde3] bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-[#3f1831]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-grey">{subtitle}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm text-[#3f1831] mb-1">
            Full name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Aarav Sharma"
            autoComplete="name"
            className={`${inputClass} border-[#e8dde3] focus:border-main`}
            required
          />
        </div>

        <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-2">
          <div>
            <label htmlFor="contact-country" className="block text-sm text-[#3f1831] mb-1">
              Code
            </label>
            <select
              id="contact-country"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className={`${inputClass} border-[#e8dde3] focus:border-main`}
            >
              {COUNTRY_CODES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.label} {entry.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contact-phone" className="block text-sm text-[#3f1831] mb-1">
              WhatsApp / Phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(event) => setPhone(sanitizePhone(event.target.value))}
              placeholder="9876543210"
              autoComplete="tel-national"
              className={`${inputClass} border-[#e8dde3] focus:border-main`}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm text-[#3f1831] mb-1">
            Email <span className="text-grey font-normal">(optional)</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            className={`${inputClass} border-[#e8dde3] focus:border-main`}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-[#3f1831] cursor-pointer">
          <input
            type="checkbox"
            checked={whatsappOptIn}
            onChange={(event) => setWhatsappOptIn(event.target.checked)}
            className="mt-1 w-4 h-4 text-main bg-white border-gray-300 rounded focus:ring-main focus:ring-2"
          />
          <span>Send my report on WhatsApp (recommended)</span>
        </label>

        <label className="flex items-start gap-3 text-sm text-[#3f1831] cursor-pointer">
          <input
            type="checkbox"
            checked={isParent}
            onChange={(event) => setIsParent(event.target.checked)}
            className="mt-1 w-4 h-4 text-main bg-white border-gray-300 rounded focus:ring-main focus:ring-2"
          />
          <span>I am a parent applying for my child</span>
        </label>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={`mt-5 w-full bg-main rounded-md text-white px-4 py-3 transition-colors ${
          submitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-main/90'
        }`}
      >
        {submitting ? 'Sending…' : primaryCta}
      </button>

      <p className="mt-3 text-xs leading-5 text-grey">
        We never share your details. One follow-up call from a PlanMyAdmission
        counsellor within 24h.
      </p>
    </form>
  );
};

export default ContactGateCard;
