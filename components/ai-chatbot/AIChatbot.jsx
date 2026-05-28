'use client';

import dynamic from 'next/dynamic';
import useVoiceSession from '@/components/ai-chatbot/hooks/useVoiceSession.js';

const VoiceOrb = dynamic(() => import('./VoiceOrb.jsx'), { ssr: false });

const AIChatbot = () => {
  const {
    isOpen,
    status,
    isMuted,
    micStream,
    latestTranscript,
    transcriptsVisible,
    open,
    close,
    toggleMute,
    toggleTranscripts,
  } = useVoiceSession();

  return (
    <VoiceOrb
      isOpen={isOpen}
      status={status}
      isMuted={isMuted}
      micStream={micStream}
      latestTranscript={latestTranscript}
      transcriptsVisible={transcriptsVisible}
      onOpen={open}
      onClose={close}
      onToggleMute={toggleMute}
      onToggleTranscripts={toggleTranscripts}
    />
  );
};

export default AIChatbot;
