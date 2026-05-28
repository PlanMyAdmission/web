'use client';

import { Mic, MicOff, PhoneOff } from 'lucide-react';
import VoiceLevelBars from './VoiceLevelBars.jsx';
import styles from './AIChatbot.module.css';

const VoiceOrb = ({
  isOpen,
  status,
  isMuted,
  micStream,
  latestTranscript,
  transcriptsVisible,
  onOpen,
  onClose,
  onToggleMute,
  onToggleTranscripts,
}) => {
  const micListening = status === 'listening' && !isMuted;
  const role = latestTranscript?.role === 'agent' ? 'AGENT' : 'YOU';
  const transcriptText = latestTranscript?.content?.trim()
    ? latestTranscript.content
    : 'Start talking to see a live transcript.';

  return (
    <div className={styles.widget}>
      {!isOpen && (
        <button
          className={styles.bubble}
          onClick={onOpen}
          type="button"
          aria-label="Talk to Consultant"
        >
          <Mic className={styles.bubbleIcon} />
          <span className={styles.bubbleLabel}>Talk to Consultant</span>
        </button>
      )}

      {isOpen && (
        <div className={styles.voiceChat}>
          <button
            className={styles.closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          <div className={styles.voiceHeader}>
            <span className={styles.voiceTitle}>AI Consultant</span>
          </div>

          <div className={styles.voiceBody}>
            <div className={`${styles.transcriptCopy} ${transcriptsVisible ? '' : styles.transcriptHidden}`}>
              <div className={`${styles.transcriptRole} ${latestTranscript?.role === 'agent' ? styles.roleAgent : styles.roleUser}`}>
                {latestTranscript ? role : ''}
              </div>
              <div className={styles.transcriptText}>
                {transcriptText}
              </div>
            </div>

            <div className={styles.micStage}>
              <div className={styles.micInline}>
                <button
                  className={`${styles.mainMic} ${isMuted ? styles.mainMicMuted : ''}`}
                  type="button"
                  aria-pressed={isMuted}
                  aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  onClick={onToggleMute}
                >
                  {isMuted
                    ? <MicOff style={{ width: 26, height: 26 }} aria-hidden="true" />
                    : <Mic style={{ width: 26, height: 26 }} aria-hidden="true" />
                  }
                </button>
                <span className={styles.micHint}>
                  {isMuted ? 'Tap to Unmute' : 'Tap to Mute'}
                </span>
              </div>
              <VoiceLevelBars stream={micStream} active={micListening} />
            </div>

            <button
              className={styles.transcriptToggle}
              type="button"
              aria-pressed={transcriptsVisible}
              onClick={onToggleTranscripts}
            >
              <span className={styles.transcriptToggleIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 10h4M6 14h8" />
                </svg>
              </span>
              {transcriptsVisible ? 'Hide Transcript' : 'Show Transcript'}
            </button>

            <button
              className={styles.endCall}
              type="button"
              onClick={onClose}
              aria-label="End call"
            >
              <PhoneOff style={{ width: 18, height: 18 }} aria-hidden="true" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceOrb;
