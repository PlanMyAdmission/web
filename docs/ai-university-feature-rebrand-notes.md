# AI University Matchmaker Rebrand Notes

Date: March 8, 2026

## Why the current name is off

Current label: `AI University Search`

What the tool actually does:
- Takes user preferences (+ optional PDF profile)
- Runs AI reasoning
- Returns curated recommendation list with fit labels (`Ambitious/Good Fit/Safe Fit`)

This is a recommendation/match workflow, not literal search.

## Naming Options

### Option 1: AI University Matchmaker (Selected)

Why:
- Clearly communicates matching logic
- User expectation aligns with output (recommendations, not database lookup)
- Easy to market

UI copy:
- Page title: `AI University Matchmaker`
- CTA: `Generate My Matches`

### Option 2: AI Program Fit Finder

Why:
- Emphasizes fit scoring and suitability
- Good if you want academic-positioning tone

UI copy:
- Page title: `AI Program Fit Finder`
- CTA: `Find Best-Fit Programs`

### Option 3: Study Abroad Shortlist AI

Why:
- Outcome-first naming (`shortlist`)
- Strong for conversion-focused funnel

UI copy:
- Page title: `Study Abroad Shortlist AI`
- CTA: `Generate Shortlist`

### Option 4: AdmitPath AI

Why:
- Brandable product identity
- Works if you want to extend into full application planning feature set

UI copy:
- Page title: `AdmitPath AI`
- CTA: `Build My Plan`

## Recommendation

Use `AI University Matchmaker` for v1 rebrand.

Reason:
- Most intuitive for first-time users
- Minimal confusion
- Works with current behavior without backend changes

## New Feature Concept (v2)

Feature name:
- `AI University Matchmaker Pro`

Core additions:
- Match score breakdown for academics, budget alignment, intake timing, and profile strength.
- Explainability panel with reasons for `Ambitious/Good Fit/Safe Fit` and guidance to improve fit.
- Scenario mode to simulate budget, country, and intake changes.
- Application readiness checklist for exams, SOP/LOR status, and deadline risks.

## Suggested Information Architecture

- Step 1: `Your Preferences`
- Step 2: `Profile Evidence (optional PDF)`
- Step 3: `AI Matches`
- Step 4: `What to improve`
- Step 5: `Save shortlist / next steps`

## Suggested Microcopy Updates

Replace:
- `Search Preferences` -> `Match Preferences`
- `Search` -> `Generate Matches`
- `Building your best-fit university matches...` -> `Generating your university matches...`

## Route + SEO Migration Plan

Current route:
- `/ai-university-search`

Proposed route:
- `/ai-university-matchmaker`

Migration:
- keep old route with permanent redirect to new route
- update page metadata title/description
- update internal nav and any CTA links
- track event rename in analytics (`ai_university_search_opened` -> `ai_matchmaker_opened`)

## Rollout Plan

Phase 1:
- Rename UI labels only
- Keep route and component names stable

Phase 2:
- Add new route slug and redirect
- Rename component/file names for code clarity

Phase 3:
- Add v2 match score breakdown + scenario mode

## Open Decisions

- Do you want outcome-focused naming (`Shortlist AI`) or mechanism-focused naming (`Matchmaker`)?
- Keep route stable for now, or migrate immediately?
- Should v2 include explainability first or scenario mode first?
