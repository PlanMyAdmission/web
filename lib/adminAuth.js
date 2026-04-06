export const ADMIN_USERS_COLLECTION = 'admin_users';
export const ADMIN_AUTH_PROVIDER = 'google.com';
export const CONFIGURED_ADMIN_EMAILS = Object.freeze([
  'arnav.xx.gupta@gmail.com',
  'abroadstudies101@gmail.com',
]);

export const hasAdminProvider = (providerId) =>
  `${providerId || ''}`.trim().toLowerCase() === ADMIN_AUTH_PROVIDER;

export const normalizeAdminEmail = (value) =>
  `${value || ''}`.trim().toLowerCase();

export const getConfiguredAdminEmails = () =>
  Array.from(
    new Set(
      CONFIGURED_ADMIN_EMAILS.map((entry) => normalizeAdminEmail(entry)).filter(
        Boolean,
      ),
    ),
  );

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
  configuredEmails = getConfiguredAdminEmails(),
) =>
  isGoogleUser(user) &&
  (isActiveAdminRecord(record) ||
    isConfiguredAdminEmail(user?.email, configuredEmails));
