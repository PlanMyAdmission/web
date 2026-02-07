export default function createPcmPlayer({ sampleRate = 16000 } = {}) {
  let audioContext = null;
  let processorNode = null;
  let pcmQueue = [];
  let level = 0;
  let levelListeners = new Set();

  const init = () => {
    if (audioContext) return;
    const AudioContext =
      window.AudioContext || window.webkitAudioContext || null;
    if (!AudioContext) return;
    audioContext = new AudioContext({ sampleRate });
    processorNode = audioContext.createScriptProcessor(4096, 0, 1);
    processorNode.onaudioprocess = (event) => {
      const output = event.outputBuffer.getChannelData(0);
      let outputOffset = 0;
      let sum = 0;
      let count = 0;
      while (outputOffset < output.length) {
        if (!pcmQueue.length) {
          output.fill(0, outputOffset);
          break;
        }
        const current = pcmQueue.shift();
        if (!current) break;
        const needed = output.length - outputOffset;
        const toCopy = Math.min(current.length, needed);
        output.set(current.subarray(0, toCopy), outputOffset);
        for (let i = 0; i < toCopy; i += 1) {
          const sample = current[i];
          sum += sample * sample;
        }
        count += toCopy;
        outputOffset += toCopy;
        if (toCopy < current.length) {
          pcmQueue.unshift(current.subarray(toCopy));
        }
      }
      if (count > 0) {
        const rms = Math.sqrt(sum / count);
        level = Math.min(1, Math.max(0, rms));
      } else {
        level = 0;
      }
      if (levelListeners.size) {
        levelListeners.forEach((listener) => listener(level));
      }
    };
    processorNode.connect(audioContext.destination);
  };

  const int16BufferToFloat32 = (buffer) => {
    if (!buffer || !buffer.byteLength) return new Float32Array();
    const byteLength = buffer.byteLength - (buffer.byteLength % 2);
    if (byteLength <= 0) return new Float32Array();
    const int16 = new Int16Array(buffer.slice(0, byteLength));
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i += 1) {
      float32[i] = int16[i] / 32768;
    }
    return float32;
  };

  const enqueuePcmArrayBuffer = (buffer) => {
    if (!buffer) return;
    init();
    if (!audioContext || !processorNode) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    const samples = int16BufferToFloat32(buffer);
    if (samples.length) {
      pcmQueue.push(samples);
    }
  };

  const enqueueBase64Pcm = (content) => {
    if (!content) return;
    init();
    if (!audioContext || !processorNode) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    const base64 = content.startsWith('data:')
      ? content.split(',')[1]
      : content;
    const binary = atob(base64);
    const byteLength = binary.length - (binary.length % 2);
    const buffer = new ArrayBuffer(byteLength);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < byteLength; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const samples = int16BufferToFloat32(buffer);
    if (samples.length) {
      pcmQueue.push(samples);
    }
  };

  const stop = () => {
    pcmQueue = [];
    level = 0;
    if (levelListeners.size) {
      levelListeners.forEach((listener) => listener(level));
    }
  };

  return {
    enqueuePcmArrayBuffer,
    enqueueBase64Pcm,
    stop,
    onLevel: (listener) => {
      if (typeof listener !== 'function') return () => {};
      levelListeners.add(listener);
      listener(level);
      return () => {
        levelListeners.delete(listener);
      };
    },
  };
}
