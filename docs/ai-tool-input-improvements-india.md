# AI Tool Input Improvements for Indian Users

This document captures practical input/UX improvements to make the AI tools easier for Indian students.

## Scope

- `components/ai-admission/steps/StartStep.jsx`
- `components/ai-admission/steps/CourseStep.jsx`
- `components/ai-admission/steps/ExtrasStep.jsx`
- `components/ai-admission/lib/prompt.js`
- `components/ai-university-search/SearchHeader.jsx`
- `components/ai-university-search/AIUniversitySearch.jsx`
- `components/explore_university/universityFinder/UniversitySearchForm.jsx`
- `components/explore_university/UniversityCourseFinder.jsx`
- `components/ai-chatbot/ChatbotWindow.jsx`

## Current Friction Points

1. Most AI admission inputs are free-text without examples, so users are unsure what format to enter.
2. `GPA (0.0 - 4.0)` is enforced in the course finder, but many Indian applicants have `%`, `CGPA(10)`, or board scores.
3. Test score capture is narrow and inconsistent across tools (some places use one text field, some only IELTS/TOEFL).
4. Budget is shown as USD-first in parts of the UI; INR is secondary.
5. Country/state/course inputs are too open-ended in some flows and too rigid in others.
6. Intake/timeline is unstructured text, which weakens matching quality.
7. Course examples are US-centric (for example, "MS in Data Science") and do not show Indian profile-style examples.

## Recommended Input Design (India-First)

### 1) Academic Scores: Support Indian Formats Natively

Replace single GPA text boxes with:

- `scoreType`: `Percentage (100)`, `CGPA (10)`, `GPA (4)`.
- `scoreValue`: numeric input.
- `gradingScaleNote`: helper text with examples.

Example helper text:
- `BTech: 8.2/10`
- `Class 12: 92% (CBSE)`
- `US GPA: 3.6/4.0`

### 2) Exam Inputs: Structured and Level-Aware

Use separate exam sections instead of one `Test Scores` text field.

- English tests: `IELTS`, `TOEFL iBT`, `PTE`, `Duolingo`, `Not Taken Yet`.
- Aptitude tests (UG): `SAT`, `ACT`, `Not Required`.
- Aptitude tests (PG): `GRE`, `GMAT`, `GATE`, `Not Required`.
- Add `plannedTestDate` when user picks `Not Taken Yet`.

### 3) Budget Inputs: INR-First With Optional USD

Recommended fields:

- `budgetCurrency` default `INR`.
- `annualBudget` with presets: `10L`, `15L`, `20L`, `30L`, `50L+`.
- `budgetIncludes`: `Tuition only` or `Tuition + Living`.
- `fundingPlan`: `Self-funded`, `Education loan`, `Scholarship dependent`.

Display INR first everywhere, with USD conversion as secondary text.

### 4) Timeline and Intake: Controlled Choices

Replace free-text timeline with:

- `targetIntake`: `Fall 2026`, `Spring 2027`, `Fall 2027`.
- `applicationStatus`: `Shortlisting`, `Preparing exams`, `Applying`, `Awaiting admits`.
- `deadlineUrgency`: `Less than 3 months`, `3-6 months`, `6+ months`.

### 5) Program Query: Split Into Meaningful Inputs

Instead of one course text field only, use:

- `degreeLevel`: UG/PG/PhD.
- `programArea`: Computer Science, Business, Public Health, etc.
- `specialization`: free text (optional).
- `countries`: multi-select.

Fallback free-text query can still exist for power users.

### 6) Microcopy: Indian Examples and Plain Language

Replace ambiguous labels with clearer text.

- `Target Country/Region` -> `Where do you want to study?`
- `GPA (or percentage)` -> `Academic score (%, CGPA/10, or GPA/4)`
- `Budget` -> `Your yearly budget (INR or USD)`

Example placeholders:

- `BCom, 78%, Delhi University`
- `CGPA 8.4/10, IELTS 7.5, budget 20L INR`
- `Prefer Canada + Germany, Fall 2026`

### 7) Prompt Layer: Normalize Indian Data Before AI Evaluation

In prompt builders (`components/ai-admission/lib/prompt.js`, `components/ai-university-search/AIUniversitySearch.jsx`):

- Include explicit instruction to normalize `%`, `CGPA/10`, and `GPA/4` before scoring.
- Include instruction to interpret INR budgets and convert internally.
- Include instruction to prefer country-program recommendations within stated budget and intake.
- Include "missing data handling" rules so AI asks for critical gaps instead of guessing.

## Proposed Canonical Input Schema (V2)

```json
{
  "studentProfile": {
    "name": "",
    "email": "",
    "degreeLevel": "PG",
    "programArea": "Computer Science",
    "specialization": "Data Science",
    "targetCountries": ["Canada", "Germany"],
    "targetIntake": "Fall 2026"
  },
  "academics": {
    "latestQualification": "BTech",
    "scoreType": "CGPA_10",
    "scoreValue": 8.2,
    "boardOrUniversity": "VTU",
    "graduationYear": 2024
  },
  "tests": {
    "englishTest": {
      "type": "IELTS",
      "score": 7.5
    },
    "aptitudeTest": {
      "type": "GRE",
      "score": 318
    }
  },
  "budget": {
    "currency": "INR",
    "annualAmount": 2000000,
    "includesLiving": true,
    "fundingPlan": "Education loan"
  },
  "experience": {
    "workMonths": 18,
    "projects": [],
    "extracurriculars": []
  }
}
```

## Rollout Plan

### Phase 1 (Quick Wins, Low Risk)

- Add placeholders and helper examples to existing fields.
- Change labels to explicitly support `%/CGPA/GPA`.
- Add INR-first budget copy and presets.
- Add friendly validation messages with valid ranges.

### Phase 2 (Moderate Changes)

- Replace free-text `testScores` and `timeline` with structured controls.
- Add score type + value model in admission form and university search form.
- Add country multi-select and intake dropdown.

### Phase 3 (Higher Impact)

- Unify all AI tool inputs behind one shared schema and mapper.
- Add auto-conversion and normalization utility used by all prompt builders.
- Persist structured profile so users do not re-enter data across tools.

## Success Metrics

- Lower form abandonment rate on AI tools.
- Higher completion rate of required fields on first attempt.
- Fewer validation errors for score/budget inputs.
- Improved recommendation relevance feedback from Indian users.
