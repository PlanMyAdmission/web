export const LOADING_MESSAGES = [
  'Evaluating transcripts and academic fit...',
  'Mapping strengths to program requirements...',
  'Estimating admission competitiveness...',
  'Drafting personalized recommendations...',
];

export const canContinueFromStart = (formData) =>
  Boolean(formData.fullName && formData.lastName);

export const canContinueFromCourse = (formData) =>
  Boolean(
    formData.targetCountry &&
    formData.degreeLevel &&
    formData.programArea &&
    formData.scoreValue,
  );

export const canSubmitExtras = (formData) =>
  Boolean(formData.targetIntake && formData.budgetAmount);

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
