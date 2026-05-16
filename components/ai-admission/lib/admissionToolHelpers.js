export const LOADING_MESSAGES = [
  'Evaluating transcripts and academic fit...',
  'Mapping strengths to program requirements...',
  'Estimating admission competitiveness...',
  'Drafting personalized recommendations...',
];

export const STEP_LABELS = ['Goal', 'Academics', 'Context', 'Result'];

export const canContinueFromGoal = (formData) =>
  Boolean(
    formData.targetCountry &&
    formData.degreeLevel &&
    formData.programArea &&
    formData.targetIntake,
  );

export const canContinueFromAcademics = (formData) =>
  Boolean(formData.scoreType && formData.scoreValue);

export const canSubmitContext = (formData) =>
  Boolean(formData.budgetBucket || formData.budgetAmount);

export const openReportPrintWindow = (reportHtml) => {
  if (!reportHtml) {
    return { ok: false, reason: 'missing_html' };
  }

  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) {
    return { ok: false, reason: 'popup_blocked' };
  }

  printWindow.document.open();
  printWindow.document.write(reportHtml);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };

  return { ok: true };
};
