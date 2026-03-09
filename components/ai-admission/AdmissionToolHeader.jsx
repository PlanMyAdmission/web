'use client';

import React from 'react';

const AdmissionToolHeader = ({ cx }) => (
  <div className={cx('pma-ai-tool-header')}>
    <div>
      <p className={cx('pma-ai-tool-eyebrow')}>Plan My Admission</p>
      <h2>AI Admission Evaluation</h2>
      <p className={cx('pma-ai-tool-subtitle')}>
        Upload a profile PDF or enter key details. We will generate a college evaluation
        report and let you download it as a PDF.
      </p>
    </div>
  </div>
);

export default AdmissionToolHeader;
