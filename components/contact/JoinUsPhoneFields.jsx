import React from 'react';
import {
  COUNTRY_DIAL_CODE_OPTIONS,
  normalizePhoneNumber,
} from '@/components/contact/joinUsFormHelpers.js';

const JoinUsPhoneFields = ({ formData, errors, onChange }) => (
  <div className="w-[90%] grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
    <div>
      <select
        id="phone-country-code"
        value={formData.phoneCountryCode}
        className={`py-4 px-3 rounded-md w-full outline-none bg-white border ${errors.phoneCountryCode ? 'border-red-500' : 'border-[#e8dde3]'}`}
        onChange={(event) => onChange('phoneCountryCode', event.target.value)}
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
          onChange('phoneNumber', normalizePhoneNumber(event.target.value))
        }
      />
      {errors.phoneNumber && (
        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
      )}
    </div>
  </div>
);

export default JoinUsPhoneFields;
