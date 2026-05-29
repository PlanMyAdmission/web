import React from 'react';

const AIToolShell = ({ eyebrow, title, subtitle, children }) => (
  <div className="bg-gradient-to-br from-[#fdf7fa] to-white">
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 md:px-6">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-main mb-3">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl md:text-3xl font-bold text-[#3f1831] leading-tight">
        {title}
      </h1>
      <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-main to-blurpink" />
      {subtitle ? (
        <p className="mt-4 text-base text-grey leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-8">{children}</div>
    </div>
  </div>
);

export const AIToolCard = ({ children, className = '' }) => (
  <div
    className={`rounded-md border border-[#efc5d9] bg-[#fdfaf9] p-6 md:p-7 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const AIToolSection = ({ title, subtitle, children }) => (
  <div className="space-y-4">
    {title ? (
      <div>
        <h3 className="text-base font-semibold text-[#3f1831]">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-grey">{subtitle}</p>
        ) : null}
      </div>
    ) : null}
    {children}
  </div>
);

export const AIToolField = ({ label, hint, children, error }) => (
  <label className="block">
    <span className="block text-xs font-semibold uppercase tracking-wider text-grey mb-1.5">
      {label}
    </span>
    {children}
    {hint && !error ? (
      <span className="block text-xs text-grey mt-1">{hint}</span>
    ) : null}
    {error ? (
      <span className="block text-xs text-red-500 mt-1">{error}</span>
    ) : null}
  </label>
);

export const inputClass =
  'w-full py-2.5 px-3 rounded-md bg-white border border-[#e8dde3] text-[#3f1831] outline-none focus:border-main placeholder:text-gray-400 transition-colors';

export const AIToolChips = ({ options, value, onChange, multi = false, max }) => {
  const selected = multi ? value || [] : value;
  const atMax = multi && max != null && selected.length >= max;
  const isActive = (v) => (multi ? selected.includes(v) : selected === v);
  const toggle = (v) => {
    if (!multi) return onChange(v === selected ? '' : v);
    if (selected.includes(v)) return onChange(selected.filter((x) => x !== v));
    if (atMax) return;
    return onChange([...selected, v]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const v = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const active = isActive(v);
        const locked = atMax && !active;
        return (
          <button
            key={v}
            type="button"
            onClick={() => toggle(v)}
            disabled={locked}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              active
                ? 'bg-main text-white border-main'
                : locked
                ? 'bg-white text-[#b8a8be] border-[#e8dde3] cursor-not-allowed'
                : 'bg-white text-[#3f1831] border-[#e8dde3] hover:border-main'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export const AIToolActions = ({ onBack, onNext, nextLabel = 'Continue', disabled }) => (
  <div className="flex items-center justify-between gap-3 pt-2">
    {onBack ? (
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2.5 rounded-full border border-[#e8dde3] text-[#3f1831] hover:bg-light transition-colors"
      >
        Back
      </button>
    ) : (
      <span />
    )}
    <button
      type="button"
      onClick={onNext}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-full bg-main text-white font-semibold transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-main/90'
      }`}
    >
      {nextLabel}
    </button>
  </div>
);

export default AIToolShell;
