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

const gatewayHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const visitorId = readVisitorIdFromCookie();
  if (visitorId) headers['x-visitor-id'] = visitorId;
  return headers;
};

export const gatewayPost = async (path, body) => {
  const response = await fetch(buildGatewayUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: gatewayHeaders(),
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

export const gatewayGet = async (path) => {
  const response = await fetch(buildGatewayUrl(path), {
    method: 'GET',
    credentials: 'include',
    headers: gatewayHeaders(),
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

export const uploadPdf = async (file) => {
  const { uploadUrl, fileKey } = await gatewayPost('/tools/upload/presign', {});
  const upload = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': 'application/pdf' },
  });
  if (!upload.ok) {
    throw new Error(`PDF upload failed (${upload.status}). Please try again.`);
  }
  return fileKey;
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
