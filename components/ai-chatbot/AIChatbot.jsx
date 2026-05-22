'use client';

import VoiceOrb from '@/components/ai-chatbot/VoiceOrb.jsx';
import useVoiceSession from '@/components/ai-chatbot/hooks/useVoiceSession.js';

const AIChatbot = () => {
  const { isOpen, status, isMuted, open, close, toggleMute } = useVoiceSession();

  return (
    <VoiceOrb
      isOpen={isOpen}
      status={status}
      isMuted={isMuted}
      onOpen={open}
      onClose={close}
      onToggleMute={toggleMute}
    />
  );
};

export default AIChatbot;
