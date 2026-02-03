import { useEffect, useRef } from 'react';

const SAMPLE_RATE = 16000;
const PROCESSOR_BUFFER_SIZE = 512;

const buildAudioMessage = (base64Pcm) =>
  JSON.stringify({ type: 'audio', content: base64Pcm });

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const floatToInt16 = (input) => {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 32768 : s * 32767;
  }
  return output;
};

export default function useVoiceStream({
  socketRef,
  active,
  setMicError,
  setMicListening,
  setMicStream,
  enabled = true,
}) {
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

  const sendChunk = (buffer) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    const base64 = arrayBufferToBase64(buffer);
    socketRef.current.send(buildAudioMessage(base64));
  };

  const stopWebAudio = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const stopStream = () => {
    stopWebAudio();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setMicListening(false);
    if (setMicStream) {
      setMicStream(null);
    }
  };

  const startWithWebAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    if (setMicStream) {
      setMicStream(stream);
    }
    const AudioContext =
      window.AudioContext || window.webkitAudioContext || null;
    if (!AudioContext) return;
    const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    audioContextRef.current = audioContext;
    const source = audioContext.createMediaStreamSource(stream);
    sourceRef.current = source;
    const processor = audioContext.createScriptProcessor(
      PROCESSOR_BUFFER_SIZE,
      1,
      1,
    );
    processorRef.current = processor;
    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      const int16 = floatToInt16(input);
      sendChunk(int16.buffer);
    };
    source.connect(processor);
    processor.connect(audioContext.destination);
  };

  useEffect(() => {
    if (!enabled || !active) {
      stopStream();
      return undefined;
    }

    let isCancelled = false;
    if (setMicError) {
      setMicError(null);
    }

    const start = async () => {
      try {
        await startWithWebAudio();
        if (!isCancelled) {
          setMicListening(true);
        }
      } catch (error) {
        stopStream();
        if (!isCancelled) {
          setMicError('Microphone access denied or not available.');
          setMicListening(true);
        }
      }
    };

    start();

    return () => {
      isCancelled = true;
      stopStream();
    };
  }, [active]);
}
