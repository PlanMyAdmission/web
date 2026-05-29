'use client';

import React from 'react';

const StepProgress = ({ steps = [], activeStep = 0 }) => {
  const total = Math.max(steps.length, 1);
  const safeIndex = Math.min(Math.max(activeStep, 0), total - 1);
  const percent = ((safeIndex + 1) / total) * 100;

  return (
    <div className="my-4">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-main">
          Step {safeIndex + 1} of {total}
        </span>
        <span className="text-sm font-semibold text-[#3f1831]">
          {steps[safeIndex] || ''}
        </span>
      </div>
      <div className="w-full h-1.5 bg-light rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-main to-blurpink transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgress;
