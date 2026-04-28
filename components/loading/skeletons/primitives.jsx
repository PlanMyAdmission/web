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
