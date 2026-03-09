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
      className={`inline-flex w-fit rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
        leadToneByStatus[normalizedStatus] || leadToneByStatus.new
      }`}
    >
      {LEAD_STATUS_LABELS[normalizedStatus] || LEAD_STATUS_LABELS.new}
    </span>
  );
};

const StatusSelect = ({ leadId, value, disabled, onChange, compact = false }) => (
  <select
    className={`rounded-md border border-main/12 bg-white text-[#442337] outline-none transition focus:border-main/28 ${
      compact ? 'px-2 py-1.5 text-xs' : 'w-full px-3 py-2 text-sm'
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
  <div className="grid gap-1 py-2 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-3">
    <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-main/45">{label}</dt>
    <dd className="text-sm leading-6 text-[#3f1831]">{formatLeadValue(value)}</dd>
  </div>
);

const DetailSection = ({ title, children }) => (
  <section className="border-b border-main/10 px-4 py-4 last:border-b-0">
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-main/50">{title}</h3>
    <dl className="mt-3 divide-y divide-main/8">{children}</dl>
  </section>
);

const LeadDetail = ({ lead, updatingLeadId, onStatusChange }) => {
  if (!lead) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#7a6173]">
        Select a lead to view the saved profile.
      </div>
    );
  }

  const topMatches = Array.isArray(lead?.aiResult?.universities)
    ? lead.aiResult.universities
    : [];
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
      <div className="border-b border-main/10 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#3f1831]">
              {leadName}
            </h2>
            <p className="mt-1 truncate text-xs text-[#7a6173]">
              {leadEmail}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="mt-4">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/45">
            Lead Status
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

      <div className="min-h-0 flex-1 overflow-y-auto">
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
          <DetailRow label="Preferred Contact" value={lead?.profile?.contactPreferences || lead?.contact?.preferredChannels} />
          <DetailRow label="Filled By" value={lead?.profile?.filledBy} />
          <DetailRow label="Destination / Phone" value={getLeadDestinationSummary(lead)} />
        </DetailSection>

        {hasStudyPlan && (
          <DetailSection title="Study Plan">
            <DetailRow label="Degree" value={lead?.profile?.degreeLevel} />
            <DetailRow label="Program Area" value={lead?.profile?.programArea} />
            <DetailRow label="Specialization" value={lead?.profile?.specialization} />
            <DetailRow label="Target Countries" value={lead?.profile?.targetCountries} />
            <DetailRow label="Target Intake" value={lead?.profile?.targetIntake} />
            <DetailRow label="Career Goal" value={lead?.profile?.careerGoal} />
          </DetailSection>
        )}

        {hasAcademicData && (
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
        )}

        {hasPlanningData && (
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
        )}

        {hasAiOutput && (
          <section className="border-b border-main/10 px-4 py-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-main/50">AI Output</h3>
            <div className="mt-3 space-y-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-main/45">Summary</p>
                <p className="mt-2 text-sm leading-6 text-[#3f1831]">
                  {lead?.aiResult?.summary || '—'}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-main/45">Top Matches</p>
                {topMatches.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {topMatches.map((university, index) => (
                      <div key={`${lead.id}-match-${index}`} className="border border-main/10 px-3 py-3">
                        <p className="text-sm font-medium text-[#3f1831]">{university?.name || 'Unnamed university'}</p>
                        <p className="mt-1 text-xs text-[#7a6173]">
                          {[university?.country, university?.program].filter(Boolean).join(' • ') || '—'}
                        </p>
                        {university?.fit && (
                          <p className="mt-2 text-sm leading-6 text-[#5b4556]">{university.fit}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[#7a6173]">No AI matches stored.</p>
                )}
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-main/45">Next Steps</p>
                {nextSteps.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[#3f1831]">
                    {nextSteps.map((step, index) => (
                      <li key={`${lead.id}-step-${index}`} className="flex gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-main/55" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[#7a6173]">No next steps stored.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export { StatusBadge, StatusSelect };
export default LeadDetail;
