import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

const size = {
  width: 1200,
  height: 630,
};

export const runtime = 'nodejs';
export const contentType = 'image/png';

let cachedLogoDataUrl = null;

const clampText = (value = '', maxLength = 180) => {
  const normalized = `${value || ''}`.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return '';
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
};

const getLogoDataUrl = async () => {
  if (cachedLogoDataUrl) {
    return cachedLogoDataUrl;
  }

  const logoPath = path.join(
    process.cwd(),
    'public/images/brand/pma-logo-v2.svg',
  );
  const logoSvg = await readFile(logoPath, 'utf8');
  cachedLogoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;
  return cachedLogoDataUrl;
};

export const buildOgImage = async ({
  eyebrow = 'Plan My Admission',
  title,
  description,
  accent = '#f40076',
}) => {
  const logoSrc = await getLogoDataUrl();
  const safeTitle = clampText(title, 110);
  const safeDescription = clampText(description, 170);

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background:
          'radial-gradient(circle at top right, rgba(244, 0, 118, 0.18), transparent 32%), linear-gradient(135deg, #fff8fb 0%, #fff 48%, #f7ecf1 100%)',
        color: '#3f1831',
        padding: '52px 58px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Segoe UI',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 'auto -120px -140px auto',
          width: '420px',
          height: '420px',
          borderRadius: '9999px',
          background: `${accent}1f`,
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img src={logoSrc} width="90" height="90" alt="Plan My Admission" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 20,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#7f5570',
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                marginTop: '8px',
                fontSize: 22,
                fontWeight: 600,
                color: accent,
              }}
            >
              Study Abroad Guidance
            </div>
          </div>
        </div>

        <div
          style={{
            border: `2px solid ${accent}`,
            borderRadius: '9999px',
            padding: '10px 18px',
            fontSize: 18,
            color: accent,
          }}
        >
          planmyadmission.com
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '920px',
        }}
      >
        <div
          style={{
            fontSize: safeTitle.length > 70 ? 54 : 64,
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: '-0.04em',
          }}
        >
          {safeTitle}
        </div>

        {safeDescription ? (
          <div
            style={{
              maxWidth: '860px',
              fontSize: 28,
              lineHeight: 1.35,
              color: '#6f556f',
            }}
          >
            {safeDescription}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 22,
          color: '#7f5570',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '9999px',
              background: accent,
            }}
          />
          Admissions consulting, AI tools, and university discovery
        </div>
        <div>Built for students going global</div>
      </div>
    </div>,
    size,
  );
};

export const ogImageSize = size;
