import React from 'react';
const ProcessingStep = ({ message }) => {
  return (
    <div className="pma-ai-processing">
      <h3>Evaluating Profile</h3>
      <p>Analyzing your profile...</p>
      <div className="pma-ai-processing-message">{message}</div>
    </div>
  );
};
export default ProcessingStep;
