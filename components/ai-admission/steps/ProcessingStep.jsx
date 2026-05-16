import React from 'react';
import { AIToolCard } from '@/components/ai-tools/AIToolShell.jsx';

const ProcessingStep = ({ message }) => (
  <AIToolCard>
    <div className="flex flex-col items-center text-center py-8 gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-light border-t-main animate-spin" />
      <h3 className="text-lg font-semibold text-[#3f1831]">
        Evaluating your profile
      </h3>
      <p className="text-sm text-grey max-w-md">{message}</p>
    </div>
  </AIToolCard>
);

export default ProcessingStep;
