export const mapModuleClasses = (styles, ...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(' ');
