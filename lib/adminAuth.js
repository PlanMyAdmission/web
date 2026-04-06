export const ADMIN_USERS_COLLECTION = 'admin_users';
export const ADMIN_AUTH_PROVIDER = 'google.com';

export const hasAdminProvider = (providerId) =>
  `${providerId || ''}`.trim().toLowerCase() === ADMIN_AUTH_PROVIDER;

export const normalizeAdminEmail = (value) =>
  `${value || ''}`.trim().toLowerCase();

export const parseAdminEmailList = (value = '') =>
  Array.from(
    new Set(
      `${value || ''}`
        .split(',')
        .map((entry) => normalizeAdminEmail(entry))
        .filter(Boolean),
    ),
  );

export const getClientConfiguredAdminEmails = () =>
  parseAdminEmailList(process.env.NEXT_PUBLIC_ADMIN_EMAILS);

export const isConfiguredAdminEmail = (email, configuredEmails = []) =>
  configuredEmails.includes(normalizeAdminEmail(email));

export const getUserProviderIds = (user) =>
  Array.isArray(user?.providerData)
    ? user.providerData.map((provider) => provider?.providerId).filter(Boolean)
    : [];

export const isGoogleUser = (user) =>
  getUserProviderIds(user).some((providerId) => hasAdminProvider(providerId));

export const normalizeAdminRecord = (data) => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  return {
    active: data.active !== false,
    role: `${data.role || 'admin'}`.trim().toLowerCase() || 'admin',
    email: `${data.email || ''}`.trim().toLowerCase(),
  };
};

export const isActiveAdminRecord = (record) => Boolean(record?.active);

export const canAccessAdminIdentity = ({
  providerId,
  email,
  record,
  configuredEmails = [],
}) =>
  hasAdminProvider(providerId) &&
  (isActiveAdminRecord(record) ||
    isConfiguredAdminEmail(email, configuredEmails));

export const canAccessAdminWorkspace = (
  user,
  record,
  configuredEmails = getClientConfiguredAdminEmails(),
) =>
  isGoogleUser(user) &&
  (isActiveAdminRecord(record) ||
    isConfiguredAdminEmail(user?.email, configuredEmails));
