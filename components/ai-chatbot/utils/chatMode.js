export const isVoiceCapable = (mode) => mode === 'voice' || mode === 'both';
export const isTextCapable = (mode) => mode === 'text' || mode === 'both';
export const isValidMode = (mode) =>
  mode === 'text' || mode === 'voice' || mode === 'both';
