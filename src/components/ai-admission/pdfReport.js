const toLineArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [String(value)];
};

const sanitize = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const buildList = (items) =>
  items.length
    ? items.map((item) => `<li>${sanitize(item)}</li>`).join('')
    : '<li>Not provided</li>';

export const buildAdmissionReportHtml = ({
  profile,
  evaluation,
  sourceLabel,
}) => {
  const strengths = toLineArray(evaluation.strengths);
  const risks = toLineArray(evaluation.risks);
  const advice = toLineArray(evaluation.advice);
  const recommendations = Array.isArray(evaluation.recommendedPrograms)
    ? evaluation.recommendedPrograms
    : [];

  const recommendationsHtml = recommendations.length
    ? recommendations
        .slice(0, 6)
        .map(
          (rec) => `
            <li>
              <strong>${sanitize(rec.program || 'Program')}</strong>
              <span>${sanitize(rec.country || 'Country')}</span>
              <p>${sanitize(rec.reason || 'Reason not provided')}</p>
            </li>
          `,
        )
        .join('')
    : '<li>Not provided</li>';

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Plan My Admission - AI Evaluation Report</title>
        <style>
          :root {
            --ink: #333333;
            --muted: #666666;
            --accent: #f40076;
            --paper: #fefbfc;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--ink);
            background: var(--paper);
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0 auto;
            background: white;
          }
          h1 {
            margin: 0 0 4mm;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            font-size: 22pt;
            font-weight: 700;
            color: var(--accent);
          }
          .meta {
            font-size: 9pt;
            color: var(--muted);
            margin-bottom: 6mm;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6mm;
          }
          .card {
            border: 1px solid #e5e2dc;
            border-radius: 10px;
            padding: 12px;
          }
          .card h2 {
            margin: 0 0 6px;
            font-size: 12pt;
          }
          .card p {
            margin: 0 0 6px;
            font-size: 10pt;
            color: var(--muted);
          }
          ul {
            margin: 6px 0 0;
            padding-left: 16px;
            font-size: 10pt;
            color: var(--muted);
          }
          .list-clean {
            list-style: none;
            padding-left: 0;
          }
          .list-clean li {
            margin-bottom: 8px;
          }
          .list-clean strong {
            display: block;
            color: var(--ink);
          }
          .score {
            margin-top: 6mm;
            font-size: 12pt;
            font-weight: 600;
            color: var(--accent);
          }
          @media print {
            body { background: white; }
            .page { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <h1>Plan My Admission - AI College Evaluation Report</h1>
          <div class="meta">${sanitize(sourceLabel || 'Profile form submission')}</div>

          <div class="grid">
            <div class="card">
              <h2>Candidate Snapshot</h2>
              <p><strong>Name:</strong> ${sanitize(
                `${profile.fullName || ''} ${profile.lastName || ''}`.trim() ||
                  'Not provided',
              )}</p>
              <p><strong>Email:</strong> ${sanitize(profile.email || 'Not provided')}</p>
              <p><strong>Target Country/Region:</strong> ${sanitize(
                profile.targetCountry || 'Not provided',
              )}</p>
              <p><strong>Degree Level:</strong> ${sanitize(
                profile.degreeLevel || 'Not provided',
              )}</p>
              <p><strong>Field of Study:</strong> ${sanitize(
                profile.fieldOfStudy || 'Not provided',
              )}</p>
              <p><strong>GPA:</strong> ${sanitize(profile.gpa || 'Not provided')}</p>
              <p><strong>Test Scores:</strong> ${sanitize(
                profile.testScores || 'Not provided',
              )}</p>
              <p><strong>Budget:</strong> ${sanitize(profile.budget || 'Not provided')}</p>
              <p><strong>Timeline:</strong> ${sanitize(profile.timeline || 'Not provided')}</p>
            </div>
            <div class="card">
              <h2>Evaluation Summary</h2>
              <p>${sanitize(evaluation.summary || 'No summary provided.')}</p>
              <div class="score">${
                evaluation.score
                  ? `Overall Fit Score: ${sanitize(evaluation.score)}`
                  : ''
              }</div>
            </div>
          </div>

          <div class="grid" style="margin-top: 6mm;">
            <div class="card">
              <h2>Strengths</h2>
              <ul>${buildList(strengths)}</ul>
            </div>
            <div class="card">
              <h2>Risks / Gaps</h2>
              <ul>${buildList(risks)}</ul>
            </div>
          </div>

          <div class="card" style="margin-top: 6mm;">
            <h2>Recommended Programs</h2>
            <ul class="list-clean">${recommendationsHtml}</ul>
          </div>

          <div class="card" style="margin-top: 6mm;">
            <h2>Actionable Advice</h2>
            <ul>${buildList(advice)}</ul>
          </div>
        </div>
      </body>
    </html>
  `;
};
