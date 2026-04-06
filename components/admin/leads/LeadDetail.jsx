import React from 'react';
import {
  formatLeadBudget,
  formatLeadDate,
  formatLeadScore,
  formatLeadValue,
  getLeadDestinationSummary,
  getLeadEmail,
  getLeadName,
  getLeadPhone,
  getLeadPhoneCountryCode,
  getLeadPhoneNumber,
  getLeadSourceLabel,
  getLeadStatus,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_OPTIONS,
  leadToneByStatus,
} from '@/components/admin/leads/leadUtils.js';

const StatusBadge = ({ status }) => {
  const normalizedStatus = `${status || 'new'}`.toLowerCase();

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        leadToneByStatus[normalizedStatus] || leadToneByStatus.new
      }`}
    >
      {LEAD_STATUS_LABELS[normalizedStatus] || LEAD_STATUS_LABELS.new}
    </span>
  );
};

const StatusSelect = ({ leadId, value, disabled, onChange, compact = false }) => (
  <select
    className={`rounded-lg border border-[#e5e5e5] bg-white text-[#111111] outline-none transition focus:border-[#999999] ${
      compact ? 'px-3 py-2 text-xs' : 'w-full px-4 py-3 text-sm'
    }`}
    value={value}
    onClick={(event) => event.stopPropagation()}
    onChange={(event) => onChange(leadId, event.target.value)}
    disabled={disabled}
  >
    {LEAD_STATUS_OPTIONS.map((status) => (
      <option key={`${leadId}-${status}`} value={status}>
        {LEAD_STATUS_LABELS[status]}
      </option>
    ))}
  </select>
);

const DetailRow = ({ label, value }) => (
  <div className="grid gap-1 border-b border-[#f0f0f0] py-3 last:border-b-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-3">
    <dt className="text-xs font-semibold uppercase tracking-wide text-[#888888]">{label}</dt>
    <dd className="text-sm leading-6 text-[#111111]">{formatLeadValue(value)}</dd>
  </div>
);

const DetailSection = ({ title, children }) => (
  <section className="rounded-xl border border-[#e5e5e5] bg-white">
    <div className="border-b border-[#f0f0f0] px-4 py-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#888888]">{title}</h3>
    </div>
    <dl className="px-4 py-2">{children}</dl>
  </section>
);

const LeadDetail = ({ lead, updatingLeadId, onStatusChange }) => {
  if (!lead) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#777777]">
        Select a lead to view the saved profile.
      </div>
    );
  }

  const topMatches = Array.isArray(lead?.aiResult?.universities) ? lead.aiResult.universities : [];
  const nextSteps = Array.isArray(lead?.aiResult?.nextSteps) ? lead.aiResult.nextSteps : [];
  const status = getLeadStatus(lead);
  const leadName = getLeadName(lead) || 'Unnamed lead';
  const leadEmail = getLeadEmail(lead) || 'Anonymous session';
  const leadPhone = getLeadPhone(lead);
  const leadPhoneCountryCode = getLeadPhoneCountryCode(lead);
  const leadPhoneNumber = getLeadPhoneNumber(lead);
  const sourceLabel = getLeadSourceLabel(lead);
  const hasStudyPlan = [
    lead?.profile?.degreeLevel,
    lead?.profile?.programArea,
    lead?.profile?.specialization,
    lead?.profile?.targetCountries?.length,
    lead?.profile?.targetIntake,
    lead?.profile?.careerGoal,
  ].some(Boolean);
  const hasAcademicData = [
    lead?.profile?.scoreType,
    lead?.profile?.scoreValue,
    lead?.profile?.boardOrUniversity,
    lead?.profile?.englishTestStatus,
    lead?.profile?.englishTestType,
    lead?.profile?.englishTestScore,
  ].some(Boolean);
  const hasPlanningData = [
    lead?.profile?.budgetAmount,
    lead?.profile?.fundingPlan,
    lead?.profile?.scholarshipNeed,
    lead?.profile?.familyPriorityTop3?.length,
    lead?.profile?.riskComfort,
    lead?.profile?.notes,
  ].some(Boolean);
  const hasAiOutput = Boolean(lead?.aiResult?.summary) || topMatches.length > 0 || nextSteps.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#e5e5e5] px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111111]">{leadName}</p>
            <p className="mt-1 truncate text-xs text-[#888888]">{leadEmail}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-[#888888]">
            <div>
              <span className="font-semibold uppercase tracking-wide">Source</span>
              <p className="mt-1 text-[#555555]">{sourceLabel}</p>
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wide">Updated</span>
              <p className="mt-1 text-[#555555]">
                {formatLeadDate(lead?.updatedAt || lead?.createdAt)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Status
            </label>
            <div className="mt-2">
              <StatusSelect
                leadId={lead.id}
                value={lead?.leadStatus || 'new'}
                disabled={updatingLeadId === lead.id}
                onChange={onStatusChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pma-admin-scroll min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#fafafa] p-4">
        <DetailSection title="Lead">
          <DetailRow label="Created" value={formatLeadDate(lead?.createdAt || lead?.generatedAtIso)} />
          <DetailRow label="Updated" value={formatLeadDate(lead?.updatedAt || lead?.createdAt)} />
          <DetailRow label="Source" value={sourceLabel} />
          <DetailRow label="Source Page" value={lead?.sourcePage} />
          <DetailRow label="Type" value={lead?.leadType} />
          <DetailRow label="Summary" value={lead?.leadSummary} />
        </DetailSection>

        <DetailSection title="Contact">
          <DetailRow label="Name" value={leadName} />
          <DetailRow label="Email" value={leadEmail} />
          <DetailRow label="Phone" value={leadPhone} />
          <DetailRow label="Country Code" value={leadPhoneCountryCode} />
          <DetailRow label="Phone Number" value={leadPhoneNumber} />
          <DetailRow
            label="Preferred Contact"
            value={lead?.profile?.contactPreferences || lead?.contact?.preferredChannels}
          />
          <DetailRow label="Filled By" value={lead?.profile?.filledBy} />
          <DetailRow label="Destination / Phone" value={getLeadDestinationSummary(lead)} />
        </DetailSection>

        {hasStudyPlan ? (
          <DetailSection title="Study Plan">
            <DetailRow label="Degree" value={lead?.profile?.degreeLevel} />
            <DetailRow label="Program Area" value={lead?.profile?.programArea} />
            <DetailRow label="Specialization" value={lead?.profile?.specialization} />
            <DetailRow label="Target Countries" value={lead?.profile?.targetCountries} />
            <DetailRow label="Target Intake" value={lead?.profile?.targetIntake} />
            <DetailRow label="Career Goal" value={lead?.profile?.careerGoal} />
          </DetailSection>
        ) : null}

        {hasAcademicData ? (
          <DetailSection title="Academics">
            <DetailRow
              label="Academic Score"
              value={formatLeadScore(lead?.profile?.scoreType, lead?.profile?.scoreValue)}
            />
            <DetailRow label="Board / University" value={lead?.profile?.boardOrUniversity} />
            <DetailRow label="English Test" value={lead?.profile?.englishTestStatus} />
            <DetailRow
              label="English Score"
              value={formatLeadScore(lead?.profile?.englishTestType, lead?.profile?.englishTestScore)}
            />
          </DetailSection>
        ) : null}

        {hasPlanningData ? (
          <DetailSection title="Planning">
            <DetailRow
              label="Budget"
              value={formatLeadBudget(lead?.profile?.budgetAmount, lead?.profile?.budgetCurrency)}
            />
            <DetailRow label="Funding Plan" value={lead?.profile?.fundingPlan} />
            <DetailRow label="Scholarship Need" value={lead?.profile?.scholarshipNeed} />
            <DetailRow label="Family Priorities" value={lead?.profile?.familyPriorityTop3} />
            <DetailRow label="Risk Comfort" value={lead?.profile?.riskComfort} />
            <DetailRow label="Notes" value={lead?.profile?.notes} />
          </DetailSection>
        ) : null}

        {hasAiOutput ? (
          <DetailSection title="AI Output">
            <DetailRow label="Summary" value={lead?.aiResult?.summary} />
            <DetailRow
              label="Top Matches"
              value={
                topMatches.length
                  ? topMatches.map((item) => item?.name || 'Unnamed university')
                  : 'No AI matches stored.'
              }
            />
            <DetailRow
              label="Next Steps"
              value={nextSteps.length ? nextSteps : 'No next steps stored.'}
            />
          </DetailSection>
        ) : null}
      </div>
    </div>
  );
};

export { StatusBadge, StatusSelect };
export default LeadDetail;
