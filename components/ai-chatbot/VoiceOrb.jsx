'use client';

import { Mic, MicOff, PhoneOff, X } from 'lucide-react';
import styles from './AIChatbot.module.css';

const STATUS_LABELS = {
  idle: '',
  connecting: 'Connecting…',
  ready: 'Ready',
  listening: 'Listening…',
  speaking: 'Speaking…',
  error: 'Microphone unavailable',
  closed: 'Disconnected — refresh to retry',
};

const ORB_STATE = {
  connecting: styles.stateConnecting,
  ready: styles.stateReady,
  listening: styles.stateListen,
  speaking: styles.stateSpeak,
};

const VoiceOrb = ({ isOpen, status, isMuted, onOpen, onClose, onToggleMute }) => {
  const orbClass = ORB_STATE[status] || styles.stateReady;
  const isActive = status === 'listening' || status === 'speaking';

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
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="AI Voice Consultant"
        >
          <div className={styles.panel}>
            {/* Header */}
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>AI Consultant</span>
              <button
                className={styles.closeBtn}
                onClick={onClose}
                type="button"
                aria-label="Close"
              >
                <X className={styles.closeBtnIcon} />
              </button>
            </div>

            {/* Orb */}
            <div className={`${styles.orbWrap} ${orbClass}`}>
              <div className={styles.ring} aria-hidden="true" />
              <div className={styles.ring} aria-hidden="true" />
              <div className={styles.orb} aria-hidden="true" />
            </div>

            {/* Status */}
            <p className={`${styles.statusText} ${isActive ? styles.statusActive : ''}`}>
              {STATUS_LABELS[status] ?? ''}
            </p>

            {/* Controls */}
            <div className={styles.controls}>
              <button
                className={styles.controlBtn}
                onClick={onToggleMute}
                type="button"
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                <span className={`${styles.controlIcon} ${isMuted ? styles.mutedActive : styles.muteIcon}`}>
                  {isMuted
                    ? <MicOff className={styles.controlSvg} />
                    : <Mic className={styles.controlSvg} />
                  }
                </span>
                <span className={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              <button
                className={styles.controlBtn}
                onClick={onClose}
                type="button"
                aria-label="End call"
              >
                <span className={`${styles.controlIcon} ${styles.endIcon}`}>
                  <PhoneOff className={styles.controlSvg} />
                </span>
                <span className={styles.controlLabel}>End</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceOrb;
