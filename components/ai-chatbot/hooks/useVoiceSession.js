'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createChatClient } from '@/lib/chat/client.js';
import {
  CHAT_WS_URL,
  CHATBOT_SESSION_ID_STORAGE_KEY,
} from '@/lib/chat/constants.js';
import audioWorkletProcessorSource from '../audioWorkletProcessor.js';

const TARGET_SAMPLE_RATE = 16000;

const readStoredSessionId = () => {
  try {
    return window.localStorage.getItem(CHATBOT_SESSION_ID_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

const writeStoredSessionId = (id) => {
  try {
    if (id) window.localStorage.setItem(CHATBOT_SESSION_ID_STORAGE_KEY, id);
  } catch {}
};

const downsample = (f32, fromRate, toRate) => {
  if (fromRate === toRate) return f32;
  const ratio = fromRate / toRate;
  const outLen = Math.floor(f32.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const src = i * ratio;
    const lo = Math.floor(src);
    const hi = Math.min(lo + 1, f32.length - 1);
    out[i] = f32[lo] + (f32[hi] - f32[lo]) * (src - lo);
  }
  return out;
};

const toInt16 = (f32) => {
  const i16 = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    i16[i] = s < 0 ? s * 32768 : s * 32767;
  }
  return i16;
};

const useVoiceSession = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [micStream, setMicStream] = useState(null);
  const [latestTranscript, setLatestTranscript] = useState(null);
  const [transcriptsVisible, setTranscriptsVisible] = useState(true);

  const clientRef = useRef(null);
  const audioCtxRef = useRef(null);
  const micStateRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const activeSourcesRef = useRef([]);
  const isMutedRef = useRef(false);
  const mountedRef = useRef(false);
  const agentBufferRef = useRef('');
  const workletUrlRef = useRef(null);

  const safeSet = useCallback((s) => {
    if (mountedRef.current) setStatus(s);
  }, []);

  const stopAllSources = useCallback(() => {
    for (const src of activeSourcesRef.current) {
      try {
        src.stop();
      } catch (_) {
        continue;
      }
    }
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
  }, []);

  const playPCM16 = useCallback((audioCtx, arrayBuffer) => {
    if (!arrayBuffer || arrayBuffer.byteLength < 2) return;
    try {
      const i16 = new Int16Array(arrayBuffer);
      const f32 = new Float32Array(i16.length);
      for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768;
      const buf = audioCtx.createBuffer(1, f32.length, TARGET_SAMPLE_RATE);
      buf.getChannelData(0).set(f32);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(audioCtx.destination);
      activeSourcesRef.current.push(src);
      src.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter(
          (s) => s !== src,
        );
      };
      const now = audioCtx.currentTime;
      const startAt = Math.max(now, nextPlayTimeRef.current);
      src.start(startAt);
      nextPlayTimeRef.current = startAt + buf.duration;
    } catch (_) {}
  }, []);

  const startMic = useCallback(
    async (client, audioCtx) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
          },
        });

        if (mountedRef.current) setMicStream(stream);

        const source = audioCtx.createMediaStreamSource(stream);
        let workletNode = null;
        let processor = null;

        try {
          if (audioCtx.state === 'suspended') await audioCtx.resume();
          const blob = new Blob([audioWorkletProcessorSource], {
            type: 'text/javascript',
          });
          const url = URL.createObjectURL(blob);
          workletUrlRef.current = url;
          await audioCtx.audioWorklet.addModule(url);
          workletNode = new AudioWorkletNode(
            audioCtx,
            'voice-stream-processor',
          );
          workletNode.port.postMessage({
            type: 'setMuted',
            value: isMutedRef.current,
          });
          workletNode.port.onmessage = (event) => {
            if (event.data.type === 'audioData' && clientRef.current) {
              clientRef.current.sendAudio(event.data.buffer);
            }
          };
          source.connect(workletNode);
          workletNode.connect(audioCtx.destination);
          micStateRef.current = { stream, source, node: workletNode };
        } catch (_) {
          const nativeRate = audioCtx.sampleRate;
          processor = audioCtx.createScriptProcessor(4096, 1, 1);
          const silentGain = audioCtx.createGain();
          silentGain.gain.value = 0;
          processor.onaudioprocess = (e) => {
            if (isMutedRef.current || !clientRef.current) return;
            const raw = e.inputBuffer.getChannelData(0);
            const resampled = downsample(raw, nativeRate, TARGET_SAMPLE_RATE);
            clientRef.current.sendAudio(toInt16(resampled).buffer);
          };
          source.connect(processor);
          processor.connect(silentGain);
          silentGain.connect(audioCtx.destination);
          micStateRef.current = { stream, source, processor, silentGain };
        }

        client.sendClientEvent('mic_granted');
        safeSet('listening');
      } catch (_) {
        client.sendClientEvent('mic_revoked');
        safeSet('error');
      }
    },
    [safeSet],
  );

  const cleanup = useCallback(() => {
    const mic = micStateRef.current;
    if (mic) {
      try {
        mic.node?.disconnect();
      } catch (_) {}
      try {
        mic.node?.port && (mic.node.port.onmessage = null);
      } catch (_) {}
      try {
        mic.processor?.disconnect();
      } catch (_) {}
      try {
        mic.silentGain?.disconnect();
      } catch (_) {}
      try {
        mic.source?.disconnect();
      } catch (_) {}
      try {
        mic.stream?.getTracks().forEach((t) => t.stop());
      } catch (_) {}
    }
    micStateRef.current = null;

    if (workletUrlRef.current) {
      try {
        URL.revokeObjectURL(workletUrlRef.current);
      } catch (_) {}
      workletUrlRef.current = null;
    }

    if (mountedRef.current) setMicStream(null);

    try {
      clientRef.current?.close();
    } catch (_) {}
    clientRef.current = null;

    try {
      audioCtxRef.current?.close();
    } catch (_) {}
    audioCtxRef.current = null;

    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
    agentBufferRef.current = '';
  }, []);

  const startSession = useCallback(() => {
    if (!CHAT_WS_URL) return;
    cleanup();
    safeSet('connecting');
    if (mountedRef.current) setLatestTranscript(null);

    const audioCtx = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE });
    audioCtxRef.current = audioCtx;

    const client = createChatClient({
      sessionId: readStoredSessionId(),
      onSessionReady: ({ sessionId }) => {
        writeStoredSessionId(sessionId);
        client.sendMode('voice');
      },
      onMode: ({ mode }) => {
        if (mode === 'voice') startMic(client, audioCtx);
      },
      onChunkStart: () => {
        agentBufferRef.current = '';
      },
      onChunk: ({ content }) => {
        agentBufferRef.current += content;
        if (mountedRef.current) {
          setLatestTranscript({
            role: 'agent',
            content: agentBufferRef.current,
          });
        }
      },
      onChunkEnd: () => {
        agentBufferRef.current = '';
      },
      onTranscript: ({ content, final }) => {
        if (!final || !content || !mountedRef.current) return;
        setLatestTranscript({ role: 'user', content });
      },
      onAudioStart: () => {
        if (!mountedRef.current) return;
        nextPlayTimeRef.current = 0;
        safeSet('speaking');
      },
      onAudio: (buffer) => {
        if (!mountedRef.current) return;
        playPCM16(audioCtx, buffer);
      },
      onAudioEnd: () => {
        if (!mountedRef.current) return;
        safeSet('listening');
      },
      onBargeIn: () => {
        if (!mountedRef.current) return;
        stopAllSources();
        safeSet('listening');
      },
      onError: () => {
        if (mountedRef.current) safeSet('error');
      },
      onClose: () => {
        if (mountedRef.current) safeSet('closed');
      },
    });

    clientRef.current = client;
  }, [cleanup, safeSet, startMic, playPCM16, stopAllSources]);

  const open = useCallback(() => {
    setIsOpen(true);
    startSession();
  }, [startSession]);

  const close = useCallback(() => {
    setIsOpen(false);
    setStatus('idle');
    setIsMuted(false);
    isMutedRef.current = false;
    setLatestTranscript(null);
    cleanup();
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    const mic = micStateRef.current;
    if (mic?.node?.port) {
      mic.node.port.postMessage({ type: 'setMuted', value: next });
    }
    clientRef.current?.sendClientEvent(next ? 'mic_revoked' : 'mic_granted');
  }, []);

  const toggleTranscripts = useCallback(() => {
    setTranscriptsVisible((v) => !v);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
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
  };
};

export default useVoiceSession;
