export const getAdminEmails = () =>
  `${process.env.NEXT_PUBLIC_ADMIN_EMAILS || ''}`
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email) => {
  const normalizedEmail = `${email || ''}`.trim().toLowerCase();
  if (!normalizedEmail) {
    return false;
  }

  return getAdminEmails().includes(normalizedEmail);
};
