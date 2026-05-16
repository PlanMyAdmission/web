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

  const blob = new Blob([reportHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');

  if (!printWindow) {
    URL.revokeObjectURL(url);
    return { ok: false, reason: 'popup_blocked' };
  }

  const cleanup = () => {
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  printWindow.addEventListener?.('load', () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      /* user can print manually */
    }
    cleanup();
  });

  // Fallback if 'load' never fires (some browsers with Blob URLs)
  setTimeout(cleanup, 90_000);

  return { ok: true };
};
