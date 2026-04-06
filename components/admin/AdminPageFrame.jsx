import React from 'react';

const AdminStatCard = ({ label, value, helper }) => (
  <div className="rounded-xl border border-[#e5e5e5] bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-[#888888]">{label}</p>
    <p className="mt-2 text-3xl font-bold leading-none text-[#111111]">{value}</p>
    {helper ? <p className="mt-2 text-xs text-[#777777]">{helper}</p> : null}
  </div>
);

const AdminPageFrame = ({
  eyebrow,
  title,
  description,
  stats = [],
  toolbar,
  errorMessage,
  children,
}) => {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col gap-6">
      <div className="rounded-2xl border border-[#e5e5e5] bg-gradient-to-r from-[#fafafa] to-[#f3f3f3] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#888888]">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold text-[#111111]">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#666666]">{description}</p>
          </div>

          {stats.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:grid-cols-2">
              {stats.map((stat) => (
                <AdminStatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  helper={stat.helper}
                />
              ))}
            </div>
          ) : null}
        </div>

        {toolbar ? <div className="mt-5">{toolbar}</div> : null}
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-[#f0d4d4] bg-[#fff8f8] px-4 py-3 text-sm text-[#9a4444]">
          {errorMessage}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
        {children}
      </div>
    </section>
  );
};

export { AdminStatCard };
export default AdminPageFrame;
