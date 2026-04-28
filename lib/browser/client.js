export const fileToBase64 = async (file) => {
  const buffer = await file.arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
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
