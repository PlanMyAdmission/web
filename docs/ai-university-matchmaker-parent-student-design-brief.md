# AI University Matchmaker: Parent + Student Friendly Design Brief

Date: March 8, 2026  
Scope: `/ai-university-matchmaker` experience (input flow + results UX)

## 1) Objective

Design a version of Matchmaker that feels:

- easy for students to complete without confusion
- reassuring for parents making financial and safety decisions
- clear, structured, and trustworthy (not “AI black box”)

This brief is intentionally practical so we can directly build it in the current codebase.

## 2) Research Summary (and Design Inference)

## Source-backed findings

- **Parents materially influence decisions** in international education journeys.
  - QS International Student Survey 2022 reports:
    - 67% candidates discuss study options with parents
    - 53% say parents have “a lot” or “a fair amount” of influence
    - 37% say safety is the top parent concern
  - Source: https://insights.qs.com/hubfs/Reports/MKT-273_GLOBAL-ISS2022_Building%20Resilience%20in%20Global%20Higher%20Education.pdf

- **India context is mobile-heavy and mixed-connectivity**.
  - DataReportal India 2025: 1.12B mobile connections, 806M internet users, 55.3% internet penetration.
  - Source: https://datareportal.com/reports/digital-2025-india

- **Long/multi-column forms increase errors and confusion**.
  - Baymard: extensive multi-column layouts cause misreading and missed required fields; single-column scanning performs better.
  - Source: https://baymard.com/blog/avoid-multi-column-forms

- **Users need clear required vs optional behavior and fewer fields**.
  - Baymard emphasizes explicit required/optional handling and reducing unnecessary fields.
  - Source: https://baymard.com/blog/required-optional-form-fields

- **Accessible error recovery must be explicit and local to fields**.
  - W3C G83 recommends text-based identification of omitted mandatory fields and preserving entered data on resubmission.
  - Source: https://www.w3.org/WAI/WCAG21/Techniques/general/G83

- **Form clarity principles are consistent across public service design systems**.
  - Single-column layout, visible labels, hint text, progressive disclosure, avoid placeholder-only instructions.
  - Source: https://designsystem.parliament.uk/how-tos/designing-forms/
  - Source: https://design-system.service.gov.uk/components/text-input/

## Design inference for this feature

- We should build a **guided, stepwise flow** (not an open-ended dense form).
- We should support **dual audience mode**: student-first and parent-first.
- We should show **cost, safety, and outcomes transparently** in results to increase parent confidence.
- We should keep **minimum required inputs short**, then progressively collect optional detail.

## 3) Product Concept

## New concept name in-product

`AI University Matchmaker: Family Edition`

## Core idea

One journey, two perspectives:

- **Student View**: course fit, growth path, application plan
- **Parent View**: affordability, safety, employability, support systems

Users can switch views in results without re-entering data.

## 4) Proposed Information Architecture

## Step flow

1. `Who is filling this form?`
2. `Student profile basics`
3. `Study goals`
4. `Academic readiness`
5. `Budget and family constraints`
6. `Priorities and support needs`
7. `Review and generate matches`
8. `Results: Student View / Parent View`

## Why this structure

- keeps cognitive load low
- supports mobile users
- allows progressive disclosure of advanced fields
- allows easy extension without breaking baseline completion

## 5) Proposed Input Model (new fields included)

## A. Context and role

| Field | Type | Required | Notes |
|---|---|---|---|
| `filledBy` | radio (`student`, `parent`, `guardian`) | Yes | Personalizes copy and result emphasis |
| `studentName` | text | Yes | For report personalization |
| `contactPreference` | checkbox (`WhatsApp`, `Email`, `Call`) | Yes | Parent-friendly follow-up |

## B. Study goals

| Field | Type | Required | Notes |
|---|---|---|---|
| `studyLevel` | select (UG, PG, PhD) | Yes | Existing field, clearer naming |
| `programArea` | select | Yes | Existing |
| `specialization` | text | Optional | Existing |
| `targetCountries` | multi-select | Yes | Replace single country with ranked list |
| `targetIntake` | select | Yes | Existing |
| `careerGoal` | chips + text | Optional | Eg: research, industry, PR track |

## C. Academic readiness

| Field | Type | Required | Notes |
|---|---|---|---|
| `scoreType` | radio (`Percentage`, `CGPA/10`, `GPA/4`) | Yes | India-first grading support |
| `scoreValue` | numeric | Yes | Dynamic validation by type |
| `boardOrUniversity` | text | Optional | Example: CBSE, Mumbai University |
| `englishTestStatus` | select (`Taken`, `Planned`, `Not yet`) | Yes | Reduces ambiguity |
| `englishTestType` | conditional select | Conditional | IELTS/TOEFL/PTE/Duolingo |
| `englishTestScore` | conditional numeric | Conditional | Only if test taken |

## D. Budget and family constraints

| Field | Type | Required | Notes |
|---|---|---|---|
| `annualBudgetInr` | range chips + numeric | Yes | Show in lakhs first (INR) |
| `fundingPlan` | multi-select | Yes | Self-funded, loan, scholarship dependent |
| `scholarshipNeed` | select (`Low`, `Medium`, `High`) | Yes | Drives recommendation logic |
| `maxTotalBudgetHorizon` | select | Optional | 2/3/4-year affordability framing |

## E. Family priorities (new parent-friendly block)

| Field | Type | Required | Notes |
|---|---|---|---|
| `familyPriorityTop3` | ranked chips | Yes | Safety, affordability, employability, support, proximity |
| `riskComfort` | select (`Conservative`, `Balanced`, `Ambitious`) | Yes | Better than dream/target/safe language |
| `supportPreference` | multi-select | Optional | Indian community, campus housing, student support office |

## Minimum required fields to generate first draft

`filledBy`, `studyLevel`, `programArea`, `targetCountries`, `targetIntake`, `scoreType`, `scoreValue`, `annualBudgetInr`, `familyPriorityTop3`.

Everything else can be progressive.

## 6) Result Experience (student + parent friendly)

## Fit terminology (replace confusing words)

- `Aspirational` (instead of dream/reach)
- `Strong Match` (instead of target)
- `Safer Choice` (instead of safe)

## Match card should show

- university + program
- fit label (`Aspirational/Strong Match/Safer Choice`)
- yearly cost estimate in INR (tuition + living)
- scholarship likelihood indicator
- safety/support indicator (high/medium/basic)
- 2-line “why this match”

## Parent View panel (new)

- “Family Budget Snapshot” (total expected spend range)
- “Risk and Safety Snapshot”
- “Career Outcome Snapshot” (internship/work-rights/employability signal)
- “What to do next in 30 days” checklist

## 7) UX Writing and Interaction Rules

- Labels must be explicit and plain language.
- Keep hint text outside fields; do not rely on placeholders as labels.
- Show optional fields as `(optional)`.
- Do not disable submit; allow submit and return clear inline errors.
- Error summary at top + field-level messages.
- Preserve entered data after validation failures.
- Default currency and examples in INR and lakhs.

## 8) Visual/Interaction Direction

- Keep pink brand, but aim for “calm confidence”, not decorative noise.
- Strong hero + credibility strip (“Cost-aware”, “Safety-aware”, “India-first”).
- Single-column flow on form pages; 2-column only for result cards on desktop.
- Clear “Page X of Y” step indicator for low-confidence users.
- Mobile-first spacing and touch targets.

## 9) Analytics and Success Metrics

- Form start rate
- Step completion rate by step
- Drop-off rate at each step
- Time to first match
- Parent View toggle usage
- Save/export/consultation CTA conversion
- User feedback score: “Were these matches understandable?” (1-5)

## 10) Phased Delivery Plan

## Phase 1 (Fast, high impact)

- Introduce stepwise IA and new copy
- Add `filledBy`, `scoreType`, `familyPriorityTop3`, `riskComfort`
- Update fit labels in results

## Phase 2

- Add Parent View toggle and budget/safety/outcome panels
- Add ranked country preferences and scholarship need

## Phase 3

- Saved family profile
- “What-if” scenario compare (budget/country/intake)
- Export parent-friendly PDF summary

## 11) Build Notes for Current Codebase

- Keep route: `/ai-university-matchmaker`
- Components to extend:
  - `components/ai-university-search/SearchHeader.jsx`
  - `components/ai-university-search/AIUniversitySearch.jsx`
  - `components/ai-university-search/ResultsPanel.jsx`
  - `components/ai-university-search/ProfileUpload.jsx`
- Introduce a schema mapper before prompt generation to normalize:
  - score scale
  - budget in INR
  - risk and family priorities

## 12) References

- QS Global International Student Survey 2022:  
  https://insights.qs.com/hubfs/Reports/MKT-273_GLOBAL-ISS2022_Building%20Resilience%20in%20Global%20Higher%20Education.pdf
- DataReportal Digital 2025: India:  
  https://datareportal.com/reports/digital-2025-india
- Baymard: Avoid extensive multicolumn layouts:  
  https://baymard.com/blog/avoid-multi-column-forms
- Baymard: Required vs optional fields:  
  https://baymard.com/blog/required-optional-form-fields
- W3C WCAG Technique G83 (required field error identification):  
  https://www.w3.org/WAI/WCAG21/Techniques/general/G83
- GOV.UK Design System (Text input guidance):  
  https://design-system.service.gov.uk/components/text-input/
- UK Parliament Design System (Designing forms):  
  https://designsystem.parliament.uk/how-tos/designing-forms/
