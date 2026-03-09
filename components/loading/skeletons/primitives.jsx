export const join = (...classes) => classes.filter(Boolean).join(' ');

export const Block = ({ className = '' }) => <div aria-hidden="true" className={join('pma-skeleton', className)} />;

export const Lines = ({ widths = [] }) => (
  <div className="space-y-3">
    {widths.map((width, index) => (
      <Block key={`${width}-${index}`} className={join('h-3 rounded-full', width)} />
    ))}
  </div>
);

export const Panel = ({ className = '', children }) => (
  <div className={join('rounded-lg border border-main/10 bg-white', className)}>{children}</div>
);

export const SectionLabel = ({ width = 'w-24', tone = 'bg-[#ece7ea]' }) => (
  <Block className={join('h-3 rounded-full', width, tone)} />
);

export const AdminToolbar = ({ includeButton = false }) => (
  <div className="flex flex-col gap-3 border border-main/10 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
    <Block className="h-10 w-full rounded-md bg-[#ece7ea]" />
    <div className="flex gap-3 lg:w-auto">
      <Block className="h-10 w-full rounded-md bg-[#ece7ea] lg:w-[180px]" />
      {includeButton && <Block className="hidden h-10 w-32 rounded-md bg-[#ece7ea] lg:block" />}
    </div>
  </div>
);

export const DashboardTabs = () => (
  <div className="my-6 flex gap-3 overflow-hidden rounded-md bg-light px-2 py-2">
    {Array.from({ length: 4 }).map((_, index) => (
      <Block key={`dash-tab-${index}`} className="h-9 w-28 rounded-md bg-white/80" />
    ))}
  </div>
);

export const DashboardShell = ({ children }) => (
  <div role="status" className="mx-auto max-w-7xl px-4 py-4">
    <span className="sr-only">Loading dashboard</span>
    <DashboardTabs />
    {children}
  </div>
);
