export const adminRequest = async ({
  currentUser,
  url,
  method = 'GET',
  body,
}) => {
  if (!currentUser) {
    throw new Error('Admin session is missing. Please sign in again.');
  }

  const token = await currentUser.getIdToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
    cache: 'no-store',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed.');
  }

  return payload;
};
