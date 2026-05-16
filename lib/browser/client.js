export const fileToBase64 = async (file) => {
  const buffer = await file.arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

const buildGatewayUrl = (path) => {
  if (!GATEWAY_URL) {
    throw new Error('NEXT_PUBLIC_GATEWAY_URL is not configured.');
  }
  return new URL(path.startsWith('/') ? path : `/${path}`, GATEWAY_URL);
};

const readVisitorIdFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) =>
      ['visitor_id=', 'pma_visitor=', 'visitorId='].some((prefix) =>
        entry.startsWith(prefix),
      ),
    );
  if (!match) return null;
  return decodeURIComponent(match.split('=')[1] || '') || null;
};

export const gatewayPost = async (path, body) => {
  const headers = { 'Content-Type': 'application/json' };
  const visitorId = readVisitorIdFromCookie();
  if (visitorId) headers['x-visitor-id'] = visitorId;

  const response = await fetch(buildGatewayUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error?.message ||
        payload?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return payload?.data;
};

export const dispatchOpenAiChatbot = (source) => {
  window.dispatchEvent(
    new CustomEvent('openAIChatbot', {
      detail: {
        source,
      },
    }),
  );
};

export const openExternalWindow = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
